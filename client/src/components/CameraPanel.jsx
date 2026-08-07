import React, { useEffect, useRef, useState } from 'react';

const CameraPanel = () => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream;
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        setError('Camera unavailable');
      }
    };
    start();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm text-slate-600 mb-2">Camera</div>
      <div className="flex-1 border rounded overflow-hidden bg-black flex items-center justify-center">
        {error ? (
          <div className="text-sm text-slate-400">{error}</div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}
      </div>
    </div>
  );
};

export default CameraPanel;
