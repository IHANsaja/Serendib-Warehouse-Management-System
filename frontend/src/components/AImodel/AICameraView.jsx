import CameraFeed from "./LiveCameraFeed";

const AICameraView = () => {
  // Define the callback function to handle the video and canvas elements when ready
  const handleFrameReady = (videoElement, canvasElement) => {
    console.log("Frame is ready:", videoElement, canvasElement);
    // You can add your processing logic here
  };

  return (
    <div className="card-primary flex justify-center items-center h-full w-full">
      <CameraFeed onFrameReady={handleFrameReady} />
    </div>
  );
};

export default AICameraView;
