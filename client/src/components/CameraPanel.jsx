import React, { useEffect, useRef, useState } from'react';
import { Video, VideoOff, Mic, MicOff, Maximize2, Users, ShieldCheck } from'lucide-react';
import { getStoredUser } from'../utils/userClient';

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
 <div className="h-full w-full flex flex-col rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xl font-sans relative group">
 {/* Video Viewport */}
 <div className="grow w-full h-full relative bg-white overflow-hidden flex items-center justify-center">
 {isVideoOn && !error ? (
 <video 
 ref={videoRef} 
 autoPlay 
 playsInline 
 muted 
 className="w-full h-full object-cover scale-x-[-1]"
 />
 ) : (
 <div className="flex flex-col items-center justify-center text-gray-600 gap-3 p-4 text-center">
 <div className="w-16 h-16 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-xl font-bold text-emerald-400">
 {user?.name ? user.name[0].toUpperCase() :'U'}
 </div>
 <div>
 <p className="text-sm font-semibold text-gray-800">{user?.name ||'Local User'}</p>
 <p className="text-xs text-gray-500">{error ||'Camera is turned off'}</p>
 </div>
 </div>
 )}

 {/* Top Badges */}
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-gray-100/80 backdrop-blur px-2.5 py-1 rounded-md border border-gray-200 text-[11px] font-medium text-gray-800">
 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
 <span>Live Feed</span>
 </div>

 {/* Bottom Control Overlay */}
 <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between bg-gray-100/85 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-200">
 <div className="text-xs font-semibold text-gray-800 truncate max-w-[120px]">
 {user?.name ||'You'}
 </div>

 <div className="flex items-center gap-1.5">
 <button
 onClick={toggleMute}
 className={`p-1.5 rounded-md transition-colors ${isMuted ?'bg-red-500/20 text-red-400 border border-red-500/40' :'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
 title={isMuted ?'Unmute microphone' :'Mute microphone'}
 >
 {isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
 </button>

 <button
 onClick={toggleVideo}
 className={`p-1.5 rounded-md transition-colors ${!isVideoOn ?'bg-red-500/20 text-red-400 border border-red-500/40' :'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
 title={!isVideoOn ?'Turn camera on' :'Turn camera off'}
 >
 {!isVideoOn ? <VideoOff className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};

// Sub-component for each Remote Peer's live video stream
const RemoteVideoTile = ({ peerId, userInfo, stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const hasVideoTrack = stream && stream.getVideoTracks().length > 0 && stream.getVideoTracks()[0].enabled;

  return (
    <div className="relative w-full h-full bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-md group flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Fallback avatar if no video stream yet */}
      {!hasVideoTrack && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-zinc-400 gap-2 p-3">
          <div className="w-14 h-14 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-xl font-bold text-emerald-400">
            {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <p className="text-xs font-semibold text-zinc-300">{userInfo?.name || 'Connected Peer'}</p>
        </div>
      )}

      {/* Peer Label */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] font-medium text-white shadow">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="truncate max-w-[110px]">{userInfo?.name || 'Peer'}</span>
      </div>
    </div>
  );
};

const CameraPanel = ({ roomId = 'default-room', peers = [], occupantCount = 1 }) => {
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const user = getStoredUser();

  // WebRTC mesh tracking
  const peerConnections = useRef(new Map()); // peerSocketId -> RTCPeerConnection
  const [remotePeers, setRemotePeers] = useState([]); // Array of { peerId, userInfo, stream }

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState(null);

  // 1. Acquire Local Camera & Microphone Stream
  useEffect(() => {
    let active = true;

    const startLocalMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 640 }, height: { ideal: 480 } }, 
          audio: true 
        });
        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setError(null);
      } catch (err) {
        console.warn('[WebRTC] Camera or mic access not granted:', err);
        setError('Camera off or permission denied');
        setIsVideoOn(false);
      }
    };

    startLocalMedia();

    return () => {
      active = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
      }
      // Close all peer connections
      peerConnections.current.forEach(pc => pc.close());
      peerConnections.current.clear();
    };
  }, []);

  // Helper to create and configure RTCPeerConnection for a remote peer
  const createPeerConnection = useCallback((targetPeerId, targetUserInfo) => {
    if (peerConnections.current.has(targetPeerId)) {
      return peerConnections.current.get(targetPeerId);
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnections.current.set(targetPeerId, pc);

    // Add local stream tracks to this peer connection
    const currentStream = screenStreamRef.current || localStreamRef.current;
    if (currentStream) {
      currentStream.getTracks().forEach(track => {
        pc.addTrack(track, currentStream);
      });
    }

    // ICE Candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketService.emit('webrtc_ice_candidate', {
          roomId,
          target: targetPeerId,
          candidate: event.candidate
        });
      }
    };

    // Remote Track Received
    pc.ontrack = (event) => {
      const incomingStream = event.streams[0];
      setRemotePeers(prev => {
        const existingIdx = prev.findIndex(p => p.peerId === targetPeerId);
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = { ...updated[existingIdx], stream: incomingStream, userInfo: targetUserInfo || updated[existingIdx].userInfo };
          return updated;
        }
        return [...prev, { peerId: targetPeerId, userInfo: targetUserInfo, stream: incomingStream }];
      });
    };

    // Connection State Change
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        pc.close();
        peerConnections.current.delete(targetPeerId);
        setRemotePeers(prev => prev.filter(p => p.peerId !== targetPeerId));
      }
    };

    return pc;
  }, [roomId]);

  // 2. WebRTC Signaling Listeners
  useEffect(() => {
    // A. Peer Joined -> initiate WebRTC Offer
    const handlePeerJoined = async ({ peerId, user: peerUser }) => {
      if (!peerId) return;
      try {
        const pc = createPeerConnection(peerId, peerUser);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socketService.emit('webrtc_offer', {
          roomId,
          target: peerId,
          offer
        });
      } catch (err) {
        console.error('[WebRTC] Failed to create offer for joined peer:', err);
      }
    };

    // B. Receive WebRTC Offer -> send WebRTC Answer
    const handleOffer = async ({ offer, sender, senderUser }) => {
      try {
        const pc = createPeerConnection(sender, senderUser);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socketService.emit('webrtc_answer', {
          roomId,
          target: sender,
          answer
        });
      } catch (err) {
        console.error('[WebRTC] Failed to handle offer from peer:', err);
      }
    };

    // C. Receive WebRTC Answer -> set remote description
    const handleAnswer = async ({ answer, sender }) => {
      try {
        const pc = peerConnections.current.get(sender);
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (err) {
        console.error('[WebRTC] Failed to handle answer from peer:', err);
      }
    };

    // D. Receive ICE Candidate
    const handleCandidate = async ({ candidate, sender }) => {
      try {
        const pc = peerConnections.current.get(sender);
        if (pc && candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.warn('[WebRTC] Error adding ICE candidate:', err);
      }
    };

    // E. Peer Left -> cleanup
    const handlePeerLeft = ({ peerId }) => {
      if (peerId && peerConnections.current.has(peerId)) {
        const pc = peerConnections.current.get(peerId);
        pc.close();
        peerConnections.current.delete(peerId);
        setRemotePeers(prev => prev.filter(p => p.peerId !== peerId));
      }
    };

    // F. Existing Room Users -> connect to them if not connected yet
    const handleRoomUsers = ({ users }) => {
      if (Array.isArray(users)) {
        users.forEach(u => {
          if (u.peerId && !peerConnections.current.has(u.peerId)) {
            handlePeerJoined({ peerId: u.peerId, user: u });
          }
        });
      }
    };

    socketService.on('peer_joined', handlePeerJoined);
    socketService.on('webrtc_offer', handleOffer);
    socketService.on('webrtc_answer', handleAnswer);
    socketService.on('webrtc_ice_candidate', handleCandidate);
    socketService.on('peer_left', handlePeerLeft);
    socketService.on('room_users', handleRoomUsers);

    return () => {
      socketService.off('peer_joined', handlePeerJoined);
      socketService.off('webrtc_offer', handleOffer);
      socketService.off('webrtc_answer', handleAnswer);
      socketService.off('webrtc_ice_candidate', handleCandidate);
      socketService.off('peer_left', handlePeerLeft);
      socketService.off('room_users', handleRoomUsers);
    };
  }, [roomId, createPeerConnection]);

  // Replace video track for all active peer connections (for camera toggle or screen share)
  const replaceVideoTrackAcrossPeers = (newVideoTrack) => {
    peerConnections.current.forEach(pc => {
      const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
      if (sender && newVideoTrack) {
        sender.replaceTrack(newVideoTrack).catch(err => console.warn('Track replace error:', err));
      }
    });
  };

  // Toggle Video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const tracks = localStreamRef.current.getVideoTracks();
      if (tracks.length > 0) {
        tracks[0].enabled = !tracks[0].enabled;
        setIsVideoOn(tracks[0].enabled);
      }
    } else {
      setIsVideoOn(!isVideoOn);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (localStreamRef.current) {
      const tracks = localStreamRef.current.getAudioTracks();
      if (tracks.length > 0) {
        tracks[0].enabled = !tracks[0].enabled;
        setIsMuted(!tracks[0].enabled);
      }
    } else {
      setIsMuted(!isMuted);
    }
  };

  // Toggle Screen Share
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        screenStreamRef.current = stream;
        const screenTrack = stream.getVideoTracks()[0];

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsScreenSharing(true);
        toast.success('Screen sharing started with peers');

        replaceVideoTrackAcrossPeers(screenTrack);

        screenTrack.onended = () => {
          setIsScreenSharing(false);
          if (localStreamRef.current && localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
            const webcamTrack = localStreamRef.current.getVideoTracks()[0];
            replaceVideoTrackAcrossPeers(webcamTrack);
          }
          toast('Screen sharing ended');
        };
      } else {
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(t => t.stop());
        }
        setIsScreenSharing(false);
        if (localStreamRef.current && localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
          const webcamTrack = localStreamRef.current.getVideoTracks()[0];
          replaceVideoTrackAcrossPeers(webcamTrack);
        }
      }
    } catch (err) {
      console.warn('Screen sharing cancelled or denied:', err);
    }
  };

  const totalVideoTiles = 1 + remotePeers.length;

  return (
    <div className="h-full w-full flex flex-col rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl font-sans relative group">
      
      {/* 1. Dynamic Video Mesh Grid Viewport */}
      <div className={`flex-grow w-full p-2.5 gap-2.5 overflow-hidden grid ${
        totalVideoTiles === 1 
          ? 'grid-cols-1 grid-rows-1' 
          : totalVideoTiles === 2 
            ? 'grid-cols-1 sm:grid-cols-2 grid-rows-1' 
            : 'grid-cols-2 grid-rows-2'
      }`}>
        
        {/* Local User Tile */}
        <div className="relative w-full h-full bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-md flex items-center justify-center">
          {((isVideoOn && !error) || isScreenSharing) ? (
            <video 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover ${isScreenSharing ? '' : 'scale-x-[-1]'}`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-400 gap-2 p-3 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-xl font-bold text-emerald-400">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-200">{user?.name || 'You'} (You)</p>
                <p className="text-[10px] text-zinc-500">{error || 'Camera is turned off'}</p>
              </div>
            </div>
          )}

          {/* Local Badges */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 text-[10px] font-medium text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{isScreenSharing ? 'Screen Share' : 'You (Live)'}</span>
          </div>

          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 text-[10px] font-medium text-white">
            <span className="truncate max-w-[100px]">{user?.name || 'You'}</span>
            {isMuted ? <MicOff className="w-3 h-3 text-red-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
          </div>
        </div>

        {/* Remote Peers Video Tiles */}
        {remotePeers.map((peer) => (
          <RemoteVideoTile
            key={peer.peerId}
            peerId={peer.peerId}
            userInfo={peer.userInfo}
            stream={peer.stream}
          />
        ))}

      </div>

      {/* 2. Interactive Bottom Controls Toolbar */}
      <div className="h-14 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-4 shrink-0">
        
        {/* Connection status badge */}
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{remotePeers.length > 0 ? `${remotePeers.length + 1} Peers in Call` : 'Ready for Peers'}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mute Microphone */}
          <button
            onClick={toggleMute}
            className={`p-2.5 rounded-xl transition-all shadow-sm ${
              isMuted 
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30' 
                : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          {/* Camera On / Off */}
          <button
            onClick={toggleVideo}
            className={`p-2.5 rounded-xl transition-all shadow-sm ${
              !isVideoOn 
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30' 
                : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
            }`}
            title={!isVideoOn ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {!isVideoOn ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`p-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 ${
              isScreenSharing 
                ? 'bg-emerald-600 text-white shadow-emerald-500/30' 
                : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
            }`}
            title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
          >
            <Monitor className="h-4 w-4" />
            <span className="text-xs font-semibold hidden md:inline">
              {isScreenSharing ? 'Stop Share' : 'Share'}
            </span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default CameraPanel;
