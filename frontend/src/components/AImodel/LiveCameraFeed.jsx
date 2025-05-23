import React, { useRef, useEffect } from 'react';

const CameraFeed = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing the camera: ', err);
      }
    };

    getCameraStream();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <>
      <video ref={videoRef} autoPlay playsInline style={{ transform: 'scaleX(-1)' }} width="100%" className="rounded-md w-full h-full" />
    </>
  );
};

export default CameraFeed;
