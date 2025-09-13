import { useRef, useEffect, useImperativeHandle, forwardRef, useState } from "react";
import axios from "axios";

// LiveCameraFeed handles playing from webcam or a provided video URL, and can run
// a real-time inference loop (start/stop) that sends frames to Roboflow and draws boxes.
const LiveCameraFeed = forwardRef(({ onDetections, sourceType = "camera", videoUrl = null, fps = 4 }, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const offscreenRef = useRef(null);
  const loopTimerRef = useRef(null);
  const streamRef = useRef(null);
  const [streamStarted, setStreamStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);

  // Tracking state
  const tracksRef = useRef([]); // [{id,x,y,width,height,lastSeen}]
  const nextIdRef = useRef(1);
  const frameIndexRef = useRef(0);

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
          videoRef.current.play();
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
        videoRef.current.play();
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
    if (!video || video.readyState < 2) return null; // HAVE_CURRENT_DATA
    const off = offscreenRef.current || document.createElement("canvas");
    offscreenRef.current = off;
    off.width = video.videoWidth;
    off.height = video.videoHeight;
    const ctx = off.getContext("2d");
    ctx.drawImage(video, 0, 0, off.width, off.height);
    return off.toDataURL("image/jpeg").replace(/^data:image\/jpeg;base64,/, "");
  };

  // Simple centroid tracker to assign persistent IDs
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
        t.x = pred.x;
        t.y = pred.y;
        t.width = pred.width;
        t.height = pred.height;
        t.lastSeen = now;
        assigned[pi] = t.id;
        unmatchedTracks.delete(bestTi);
      }
    });

    // Create new tracks for unassigned predictions
    predictions.forEach((pred, pi) => {
      if (assigned[pi] != null) return;
      const id = nextIdRef.current++;
      tracks.push({ id, x: pred.x, y: pred.y, width: pred.width, height: pred.height, lastSeen: now });
      assigned[pi] = id;
    });

    // Remove stale tracks (not seen in last N frames)
    const maxAge = 12; // frames
    for (let i = tracks.length - 1; i >= 0; i--) {
      if (now - tracks[i].lastSeen > maxAge) {
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
      drawCtx.strokeStyle = "#A43424";
      drawCtx.lineWidth = 2;
      drawCtx.strokeRect(x - width / 2, y - height / 2, width, height);
      drawCtx.font = "14px Arial";
      drawCtx.fillStyle = "#A43424";
      const caption = `ID ${id}${label ? ` · ${label}` : ""} ${confidence != null ? ` (${(confidence * 100).toFixed(1)}%)` : ""}`;
      drawCtx.fillText(caption, x - width / 2, Math.max(12, y - height / 2 - 6));
    });
  };

  const inferOnce = async () => {
    const base64Image = captureBase64();
    if (!base64Image) return null;

    try {
      const response = await axios({
        method: "POST",
        url: "https://serverless.roboflow.com/sack-counting-x1wzu-lkzgj/1",
        params: { api_key: "BnFrWCGuYJw6CLOyIqiM" },
        data: base64Image,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const raw = response.data?.predictions || [];
      const withIds = assignIds(raw);
      drawDetections(withIds);
      onDetections && onDetections(withIds);
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
    nextIdRef.current = 1;
    frameIndexRef.current = 0;

    setRunning(true);
    runningRef.current = true;
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
        autoPlay
        playsInline
        muted
        className="rounded-md w-full h-full bg-black"
        style={{ transform: "scaleX(-1)" }}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ transform: "scaleX(-1)" }}
      />
    </div>
  );
});

export default LiveCameraFeed;
