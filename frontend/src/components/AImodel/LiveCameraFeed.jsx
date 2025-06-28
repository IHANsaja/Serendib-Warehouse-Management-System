import { useRef, useEffect, useImperativeHandle, forwardRef, useState } from "react";

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
