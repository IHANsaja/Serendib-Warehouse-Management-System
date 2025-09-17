import { useRef, useEffect, useImperativeHandle, forwardRef, useState } from "react";
import axios from "axios";

// LiveCameraFeed handles playing from webcam or a provided video URL, and can run
// a real-time inference loop (start/stop) that sends frames to Roboflow and draws boxes.
const LiveCameraFeed = forwardRef(({ onDetections, sourceType = "camera", videoUrl = null, fps = 4, countConfig: userCountConfig = {} }, ref) => {
  const defaultCountConfig = {
    orientation: "vertical", // 'vertical' or 'horizontal'
    position: 0.5, // fraction [0,1] across width (vertical) or height (horizontal)
    direction: "negative", // 'negative' = high->low (right->left for vertical, bottom->top for horizontal); 'positive' = low->high
    edge: "right", // for vertical: 'left'|'right'|'center'; for horizontal: 'top'|'bottom'|'center'
    minConfidence: 0.55,
    minHits: 2,
    maxMiss: 10,
    smoothing: 0.6,
  };
  const countConfig = { ...defaultCountConfig, ...(userCountConfig || {}) };
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const offscreenRef = useRef(null);
  const loopTimerRef = useRef(null);
  const streamRef = useRef(null);
  const [streamStarted, setStreamStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);
  const playDelayTimerRef = useRef(null);

  // Rendering state (decouple overlay drawing from inference)
  const renderReqRef = useRef(null);
  const latestPredsRef = useRef([]);

  // Tracking state
  const tracksRef = useRef([]); // [{id,x,y,width,height,lastSeen,prevX,counted}]
  const nextIdRef = useRef(1);
  const frameIndexRef = useRef(0);
  const crossedCountRef = useRef(0); // deprecated: kept for compatibility with older UI
  const seenIdsRef = useRef(new Set()); // unique IDs observed this session

  const stopMediaTracks = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    } catch (e) {
      console.warn("Error stopping media tracks", e);
    }
  };

  const setupCamera = async () => {
    stopMediaTracks();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          // Do not auto-play; wait for user to click Start
          setStreamStarted(true);
        };
      }
    } catch (err) {
      console.error("Error accessing the camera:", err);
    }
  };

  const setupVideoUrl = async () => {
    stopMediaTracks();
    if (videoRef.current && videoUrl) {
      videoRef.current.srcObject = null;
      videoRef.current.src = videoUrl;
      videoRef.current.onloadedmetadata = () => {
        // Do not auto-play; wait for user to click Start
        setStreamStarted(true);
      };
    }
  };

  useEffect(() => {
    // Initialize based on source type
    if (sourceType === "camera") {
      setupCamera();
    } else if (sourceType === "video") {
      setupVideoUrl();
    }

    return () => {
      // Cleanup on unmount
      stop();
      stopMediaTracks();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceType, videoUrl]);

  const captureBase64 = () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return null; 
    const off = offscreenRef.current || document.createElement("canvas");
    offscreenRef.current = off;
    off.width = video.videoWidth;
    off.height = video.videoHeight;
    const ctx = off.getContext("2d");
    ctx.drawImage(video, 0, 0, off.width, off.height);
    return off.toDataURL("image/jpeg").replace(/^data:image\/jpeg;base64,/, "");
  };

  // Simple centroid tracker with EMA smoothing and hit/miss gating
  const assignIds = (predictions) => {
    const tracks = tracksRef.current;
    const now = ++frameIndexRef.current;

    // mark all as unmatched initially
    const unmatchedTracks = new Set(tracks.map((_, i) => i));
    const assigned = new Array(predictions.length).fill(null);

    // helper to compute squared distance
    const dist2 = (a, b) => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return dx * dx + dy * dy;
    };

    // Greedy matching by nearest track
    predictions.forEach((pred, pi) => {
      const center = { x: pred.x, y: pred.y };
      let bestTi = -1;
      let bestD2 = Infinity;
      tracks.forEach((t, ti) => {
        if (!unmatchedTracks.has(ti)) return;
        const d2 = dist2(center, t);
        if (d2 < bestD2) {
          bestD2 = d2;
          bestTi = ti;
        }
      });

      // distance threshold scales with object size (loose) + floor
      const pxThresh = Math.max(pred.width, pred.height) * 0.6 + 40; // pixels
      const thresh2 = pxThresh * pxThresh;

      if (bestTi !== -1 && bestD2 <= thresh2) {
        // assign existing track
        const t = tracks[bestTi];
        // store previous values before updating
        t.prevX = t.x;
        t.prevY = t.y;
        // EMA smoothing on positions
        const a = countConfig.smoothing ?? 0.6;
        t.x = a * pred.x + (1 - a) * t.x;
        t.y = a * pred.y + (1 - a) * t.y;
        t.width = pred.width;
        t.height = pred.height;
        t.lastSeen = now;
        t.hitStreak = (t.hitStreak || 0) + 1;
        t.missStreak = 0;
        assigned[pi] = t.id;
        unmatchedTracks.delete(bestTi);
      }
    });

    // Create new tracks for unassigned predictions
    predictions.forEach((pred, pi) => {
      if (assigned[pi] != null) return;
      const id = nextIdRef.current++;
      const x = pred.x;
      const y = pred.y;
      tracks.push({
        id,
        x,
        y,
        prevX: x,
        prevY: y,
        width: pred.width,
        height: pred.height,
        lastSeen: now,
        counted: false,
        hitStreak: 1,
        missStreak: 0,
      });
      assigned[pi] = id;
    });

    // Age unmatched tracks and remove stale ones
    const maxMiss = countConfig.maxMiss ?? 10;
    for (let i = tracks.length - 1; i >= 0; i--) {
      const t = tracks[i];
      if (unmatchedTracks.has(i)) {
        t.missStreak = (t.missStreak || 0) + 1;
      }
      if ((t.missStreak || 0) > maxMiss) {
        tracks.splice(i, 1);
      }
    }

    // attach id to predictions
    return predictions.map((p, i) => ({ ...p, id: assigned[i] }));
  };

  const drawDetections = (predictions) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !video) return;
    const drawCtx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    drawCtx.clearRect(0, 0, canvas.width, canvas.height);


    predictions.forEach((pred) => {
      const { x, y, width, height, class: label, confidence, id } = pred;
      // Draw bright yellow box for visibility
      drawCtx.strokeStyle = "#FFD700";
      drawCtx.lineWidth = 3;
      drawCtx.strokeRect(x - width / 2, y - height / 2, width, height);
      drawCtx.font = "14px Arial";
      const caption = `${label ? `${label}` : "Object"} ${(confidence != null ? (confidence * 100).toFixed(1) : "-")}%`;
      // background for text for readability
      const textX = x - width / 2;
      const textY = Math.max(16, y - height / 2 - 8);
      const metrics = drawCtx.measureText(caption);
      const pad = 3;
      drawCtx.fillStyle = "rgba(0,0,0,0.6)";
      drawCtx.fillRect(textX - pad, textY - 12 - pad, metrics.width + pad * 2, 14 + pad * 2);
      drawCtx.fillStyle = "#FFD700";
      drawCtx.fillText(caption, textX, textY);
    });

    // draw count box
    drawCtx.fillStyle = "rgba(0,0,0,0.5)";
    drawCtx.fillRect(8, 8, 160, 28);
    drawCtx.fillStyle = "#FFFFFF";
    drawCtx.font = "16px Arial";
    drawCtx.fillText(`Count: ${seenIdsRef.current.size}`, 16, 28);
  };

  const inferOnce = async () => {
    const base64Image = captureBase64();
    if (!base64Image) return null;

    try {
      const response = await axios({
        method: "POST",
        url: "https://serverless.roboflow.com/sack-counting-efnrk/4",
        params: { api_key: "D6KdLcTHQOfcX0ulcppL" },
        data: base64Image,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      // Filter predictions to only SACK class and reasonable confidence to reduce noise
      const minConf = countConfig.minConfidence ?? 0.5;
      const raw = (response.data?.predictions || []).filter(
        (p) => (p.class === "SACK" || p.class_id === 0) && (p.confidence ?? 0) >= minConf
      );
      const withIds = assignIds(raw);

      // Update unique IDs set from stable tracks (no center line logic)
      const minHits = countConfig.minHits ?? 2;
      const tracks = tracksRef.current;
      const trackMap = new Map(tracks.map((t) => [t.id, t]));
      for (const p of withIds) {
        if (p.id == null) continue;
        const t = trackMap.get(p.id);
        if (!t) continue;
        if ((t.hitStreak || 0) >= minHits) {
          seenIdsRef.current.add(p.id);
        }
      }

      // Update latest predictions for the render loop; drawing is decoupled from inference.
      latestPredsRef.current = withIds;
      onDetections && onDetections(withIds, { count: seenIdsRef.current.size });
      return withIds;
    } catch (err) {
      console.error("Roboflow error:", err.message);
      return null;
    }
  };

  const start = () => {
    if (runningRef.current) return;
    // Reset tracking for a fresh session
    tracksRef.current = [];
    latestPredsRef.current = [];
    nextIdRef.current = 1;
    frameIndexRef.current = 0;
    crossedCountRef.current = 0; // legacy (no longer used)
    seenIdsRef.current = new Set();

    // Delay video playback slightly to help sync boxes with inference, but start inference immediately
    const v = videoRef.current;
    if (v) {
      // finalize on video end
      v.onended = () => {
        try {
          const total = seenIdsRef.current.size || 0;
          window.dispatchEvent(new CustomEvent("ai:sessionComplete", { detail: { total } }));
        } catch (_) {}
        stop();
      };
      const playVideo = () => v.play().catch(() => {});
      const startDelayMs = 600; // adjust if needed to better align boxes with playback
      const startWhenReady = () => {
        if (!runningRef.current) return;
        if (v.readyState >= 2) {
          playVideo();
        } else {
          const onReady = () => {
            v.removeEventListener("loadeddata", onReady);
            playVideo();
          };
          v.addEventListener("loadeddata", onReady);
        }
      };
      if (playDelayTimerRef.current) clearTimeout(playDelayTimerRef.current);
      playDelayTimerRef.current = setTimeout(startWhenReady, startDelayMs);
    }

    // Start render loop immediately so the center line and HUD appear without waiting for inference.
    const render = () => {
      if (!runningRef.current) return;
      // Draw latest predictions (or none) every frame; keeps line visible instantly.
      try {
        drawDetections(latestPredsRef.current || []);
      } catch (_) {}
      renderReqRef.current = requestAnimationFrame(render);
    };

    setRunning(true);
    runningRef.current = true;
    // Kick off first draw immediately
    drawDetections([]);
    renderReqRef.current = requestAnimationFrame(render);

    // Inference loop at target fps
    const interval = Math.max(1, Math.floor(1000 / fps));
    const loop = async () => {
      if (!runningRef.current) return;
      await inferOnce();
      loopTimerRef.current = setTimeout(loop, interval);
    };
    loop();
  };

  const stop = () => {
    setRunning(false);
    runningRef.current = false;
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    if (renderReqRef.current) {
      cancelAnimationFrame(renderReqRef.current);
      renderReqRef.current = null;
    }
    if (playDelayTimerRef.current) {
      clearTimeout(playDelayTimerRef.current);
      playDelayTimerRef.current = null;
    }
    // Pause the video playback until user starts again
    const v = videoRef.current;
    try {
      if (v) {
        v.pause();
        v.onended = null;
      }
    } catch (_) {}
  };

  // Expose imperative controls
  useImperativeHandle(ref, () => ({
    start,
    stop,
    isRunning: () => running,
    getVideoElement: () => videoRef.current,
    getCanvasElement: () => canvasRef.current,
  }));

  return (
    <div className="relative w-full h-full p-4" style={{ maxWidth: 640, maxHeight: 480 }}>
      <video
        id="webcam-video"
        ref={videoRef}
        playsInline
        muted
        className="rounded-md w-full h-full bg-black"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
    </div>
  );
});

export default LiveCameraFeed;
