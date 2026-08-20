import React, { useEffect, useRef, useState } from 'react';
import { Video, VideoOff, Mic, MicOff, Maximize2, Users, ShieldCheck } from 'lucide-react';
import { getStoredUser } from '../utils/userClient';

const CameraPanel = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const user = getStoredUser();

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setError(null);
      } catch (err) {
        console.warn('[CameraPanel] Camera or mic access not granted:', err);
        setError('Camera unavailable or permission denied');
        setIsVideoOn(false);
      }
    };

    start();
    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const toggleVideo = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getVideoTracks();
      if (tracks.length > 0) {
        tracks[0].enabled = !tracks[0].enabled;
        setIsVideoOn(tracks[0].enabled);
      }
    } else {
      setIsVideoOn(!isVideoOn);
    }
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getAudioTracks();
      if (tracks.length > 0) {
        tracks[0].enabled = !tracks[0].enabled;
        setIsMuted(!tracks[0].enabled);
      }
    } else {
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="h-full w-full flex flex-col rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl font-sans relative group">
      {/* Video Viewport */}
      <div className="flex-grow w-full h-full relative bg-slate-900 overflow-hidden flex items-center justify-center">
        {isVideoOn && !error ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 gap-3 p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xl font-bold text-blue-400">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">{user?.name || 'Local User'}</p>
              <p className="text-xs text-slate-500">{error || 'Camera is turned off'}</p>
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-md border border-slate-800 text-[11px] font-medium text-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Feed</span>
        </div>

        {/* Bottom Control Overlay */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between bg-slate-950/85 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
            {user?.name || 'You'}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className={`p-1.5 rounded-md transition-colors ${isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-1.5 rounded-md transition-colors ${!isVideoOn ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              title={!isVideoOn ? 'Turn camera on' : 'Turn camera off'}
            >
              {!isVideoOn ? <VideoOff className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraPanel;

