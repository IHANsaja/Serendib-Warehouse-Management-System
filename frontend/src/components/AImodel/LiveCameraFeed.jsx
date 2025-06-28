import { useRef, useEffect, useImperativeHandle, forwardRef, useState } from "react";
import axios from "axios";

const LiveCameraFeed = forwardRef(({ onDetections }, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streamStarted, setStreamStarted] = useState(false);

  // Expose a method to run AI externally
  useImperativeHandle(ref, () => ({
    runAIModel,
  }));

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

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

    getCameraStream();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const runAIModel = async () => {
    if (!videoRef.current || !canvasRef.current || !streamStarted) {
      alert("Video or canvas not ready.");
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Prepare image from video
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = video.videoWidth;
      tempCanvas.height = video.videoHeight;
      const ctx = tempCanvas.getContext("2d");
      ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
      const base64Image = tempCanvas.toDataURL("image/jpeg").replace(/^data:image\/jpeg;base64,/, "");

      // Roboflow API call
      const response = await axios({
        method: "POST",
        url: "https://serverless.roboflow.com/sack-counting-x1wzu-lkzgj/1",
        params: { api_key: "BnFrWCGuYJw6CLOyIqiM" },
        data: base64Image,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const predictions = response.data.predictions || [];
      const total = predictions.length;

      // Draw bounding boxes
      const drawCtx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      drawCtx.clearRect(0, 0, canvas.width, canvas.height);

      predictions.forEach((pred) => {
        const { x, y, width, height, class: label, confidence } = pred;
        drawCtx.strokeStyle = "#A43424";
        drawCtx.lineWidth = 2;
        drawCtx.strokeRect(x - width / 2, y - height / 2, width, height);
        drawCtx.fillStyle = "#A43424";
        drawCtx.font = "16px Arial";
        drawCtx.fillText(
          `${label} (${(confidence * 100).toFixed(1)}%)`,
          x - width / 2,
          y - height / 2 - 5
        );
      });

      // Report detection data back
      if (onDetections) {
        onDetections({
          totalSacks: total,
          sacksWithoutErrors: total, // You can update this logic
          overlappingSackPairs: 0,
          positionsOfOverlappingSackPairs: "",
          aiModelCount: total,
        });
      }
    } catch (err) {
      console.error("Roboflow error:", err.message);
      alert("Failed to run AI model.");
    }
  };

  return (
    <div className="relative w-full h-full p-4" style={{ maxWidth: 640, maxHeight: 480 }}>
      <video
        id="webcam-video"
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="rounded-md w-full h-full"
        style={{ transform: "scaleX(-1)" }}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
    </div>
  );
});

export default LiveCameraFeed;
