import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';

const CameraView = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreamActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full aspect-video rounded-lg shadow-lg ${
          isStreamActive ? 'opacity-100' : 'opacity-50'
        }`}
      />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <button
          onClick={isStreamActive ? stopCamera : startCamera}
          className={`px-6 py-3 rounded-full flex items-center gap-2 text-white transition-colors ${
            isStreamActive 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isStreamActive ? (
            <>
              <CameraOff size={20} />
              <span>Stop Camera</span>
            </>
          ) : (
            <>
              <Camera size={20} />
              <span>Start Camera</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CameraView;