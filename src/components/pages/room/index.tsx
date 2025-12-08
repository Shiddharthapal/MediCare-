import React, { useEffect, useCallback, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { useSocket } from "@/components/provider/socket";
import { usePeer } from "@/components/provider/peer";
import { Mic, MicOff, Phone, Share2, Video, VideoOff } from "lucide-react";

// Client signaling aligned with server: offer/answer/ice-candidate targeting socketId
const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const emailId = user?.email;
  const isDoctor = user?.role === "doctor";
  const { socket } = useSocket();
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAns,
    sendStream,
    remoteStream,
    resetPeer,
  } = usePeer();

  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteEmailId, setRemoteEmailId] = useState<string | null>(null);
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [pendingCall, setPendingCall] = useState<{
    socketId: string;
    emailId?: string;
  } | null>(null);
  const [isMakingOffer, setIsMakingOffer] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callActive, setCallActive] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const hasJoinedRef = useRef(false);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    return stream;
  }, []);

  // Cleanup function to stop all tracks and reset state
  const cleanupCall = useCallback(() => {
    console.log("Cleaning up call...");

    // Stop all local media tracks
    if (myStream) {
      myStream.getTracks().forEach((track) => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      setMyStream(null);
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    socket.emit("leave-room", { roomId, emailId });

    // Close peer connection
    if (peer) {
      peer.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });
      // Note: We don't close the peer connection here as it's managed by PeerProvider
      // But we remove all tracks
      peer.getSenders().forEach((sender) => {
        try {
          peer.removeTrack(sender);
        } catch (err) {
          console.error("Error removing track:", err);
        }
      });
    }

    // Reset state
    resetPeer();
    setRemoteSocketId(null);
    setRemoteEmailId(null);
    setPendingCall(null);
    setCallActive(false);
    pendingIceRef.current = [];
  }, [myStream, peer, resetPeer]);

  // Ensure we always have a local stream before sending offers/answers
  const ensureLocalStream = useCallback(async () => {
    if (myStream) return myStream;
    const stream = await getUserMediaStream();
    return stream;
  }, [getUserMediaStream, myStream]);

  //use useCallback to call the user before media was ready
  const callUser = useCallback(
    async ({ socketId, emailId }: { socketId: string; emailId?: string }) => {
      const stream = await ensureLocalStream();
      if (!stream) return;
      setPendingCall(null);
      setRemoteSocketId(socketId);
      setRemoteEmailId(emailId || null);
      await sendStream(stream);
      const offer = await createOffer();
      socket.emit("offer", { target: socketId, sdp: offer });
    },
    [createOffer, ensureLocalStream, sendStream, socket]
  );

  //handler function for existing user
  const handleExistingUsers = useCallback(
    async ({ users }) => {
      if (!users || users.length === 0) return;
      if (!isDoctor) {
        console.log("Patient role: waiting for doctor to start call");
        return;
      }
      // Call the first existing user
      const first = users[0];
      await callUser({ socketId: first.socketId, emailId: first.emailId });
    },
    [callUser, isDoctor]
  );

  //handler function for new user join
  const handleNewUserJoined = useCallback(
    async (data) => {
      const { socketId, emailId } = data;
      console.log("User joined:", socketId, emailId);
      if (!isDoctor) {
        console.log("Patient role: waiting for doctor to start call");
        return;
      }
      await callUser({ socketId, emailId });
    },
    [callUser, isDoctor]
  );

  //handler function for incomming offer
  const handleIncomingOffer = useCallback(
    async (data) => {
      const { sdp, callerId, emailId } = data;
      console.log("Incoming offer from", callerId, emailId);
      const offerCollision = isMakingOffer || peer.signalingState !== "stable";
      const polite = true; // doctor/patient can both behave politely to avoid glare drops
      if (offerCollision && polite) {
        try {
          await peer.setLocalDescription({ type: "rollback" } as any);
        } catch (err) {
          console.error("Rollback failed", err);
        }
      }
      setRemoteSocketId(callerId);
      setRemoteEmailId(emailId || null);
      const stream = await ensureLocalStream();
      if (stream) {
        await sendStream(stream);
      }
      const ans = await createAnswer(sdp);
      socket.emit("answer", { target: callerId, sdp: ans });
      // flush any buffered ICE now that remote description is set
      if (pendingIceRef.current.length) {
        for (const cand of pendingIceRef.current) {
          try {
            await peer.addIceCandidate(new RTCIceCandidate(cand));
          } catch (err) {
            console.error("Error adding buffered ICE", err);
          }
        }
        pendingIceRef.current = [];
      }
    },
    [createAnswer, ensureLocalStream, isMakingOffer, peer, sendStream, socket]
  );

  //use useCallback function to handle the answer of video call
  const handleAnswer = useCallback(
    async (data) => {
      const { sdp, calleeId } = data;
      console.log("Answer received from", calleeId);
      if (peer.signalingState !== "have-local-offer") {
        console.warn(
          "Skipping answer because signaling state is",
          peer.signalingState
        );
        return;
      }
      await setRemoteAns(sdp);
    },
    [peer, setRemoteAns]
  );

  // handler function that negotiate  the local stream, offer
  const handleNegotiation = useCallback(async () => {
    if (!remoteSocketId) return;
    if (peer.signalingState !== "stable") return;
    const stream = await ensureLocalStream();
    if (stream) {
      await sendStream(stream);
    }
    setIsMakingOffer(true);
    try {
      const freshOffer = await createOffer();
      if (freshOffer) {
        socket.emit("offer", { target: remoteSocketId, sdp: freshOffer });
      }
    } finally {
      setIsMakingOffer(false);
    }
  }, [createOffer, ensureLocalStream, remoteSocketId, sendStream, socket]);

  //handler function for doing on/off toggle audio
  const toggleAudio = () => {
    if (myStream) {
      myStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioOn(!isAudioOn);
    }
  };

  //handler function for doing on/off video
  const toggleVideo = () => {
    if (myStream) {
      myStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  //handler function to share screen
  const handleScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const screenTrack = screenStream.getVideoTracks()[0];
      const sender = peer
        .getSenders()
        .find((s: RTCRtpSender) => s.track?.kind === "video");
      if (sender) {
        await sender.replaceTrack(screenTrack);
        screenTrack.onended = async () => {
          if (myStream) {
            const videoTrack = myStream.getVideoTracks()[0];
            if (videoTrack && sender) {
              await sender.replaceTrack(videoTrack);
            }
          }
        };
      }
    } catch (err) {
      console.error("Screen share failed:", err);
    }
  };

  //handler function to end the call
  const handleEndCall = useCallback(() => {
    console.log("Ending call...");
    // Determine if this user is the call creator (doctor in your case)
    const isCallCreator = isDoctor;

    if (isCallCreator) {
      // Creator ends call - notify remote peer to also leave
      if (remoteSocketId) {
        socket.emit("end-call-by-creator", {
          target: remoteSocketId,
          roomId,
          emailId,
        });
      }
    } else {
      // Non-creator leaves - just notify they're leaving
      if (remoteSocketId) {
        socket.emit("user-leaving", {
          target: remoteSocketId,
          roomId,
          emailId,
        });
      }
    }

    // Leave the room
    if (roomId) {
      socket.emit("leave-room", { roomId, emailId });
    }

    // Cleanup all resources
    cleanupCall();
    navigate("/");

    // // Navigate back to appointments after a short delay
    // setTimeout(() => {
    //   navigate("/");
    // }, 500);
  }, [
    remoteSocketId,
    socket,
    roomId,
    emailId,
    cleanupCall,
    navigate,
    isDoctor,
  ]);

  // If doctor ends the call, remote peers should leave and return to appointments
  useEffect(() => {
    const handleRemoteEnd = ({ emailId: endedBy }: { emailId?: string }) => {
      console.log("Call ended by creator:", endedBy);
      if (roomId) {
        socket.emit("leave-room", { roomId, emailId });
      }
      cleanupCall();
      navigate("/");
    };

    socket.on("end-call-by-creator", handleRemoteEnd);
    return () => {
      socket.off("end-call-by-creator", handleRemoteEnd);
    };
  }, [cleanupCall, emailId, navigate, roomId, socket]);

  // If remote user leaves voluntarily, clean up and navigate away
  useEffect(() => {
    const handleUserLeft = () => {
      if (roomId) {
        socket.emit("leave-room", { roomId, emailId });
      }
      cleanupCall();
      navigate("/");
    };

    socket.on("user-left", handleUserLeft);
    return () => {
      socket.off("user-left", handleUserLeft);
    };
  }, [cleanupCall, emailId, navigate, roomId, socket]);

  //hook for give the socket status
  useEffect(() => {
    const logStatus = (label: string) => {
      console.log("Socket status:", label, {
        id: socket.id,
        connected: socket.connected,
      });
    };

    logStatus("initial");
    const onConnect = () => logStatus("connected");
    const onDisconnect = () => logStatus("disconnected");
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("existing-users", handleExistingUsers);
    socket.on("user-joined", handleNewUserJoined);
    socket.on("offer", handleIncomingOffer);
    socket.on("answer", handleAnswer);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("existing-users", handleExistingUsers);
      socket.off("user-joined", handleNewUserJoined);
      socket.off("offer", handleIncomingOffer);
      socket.off("answer", handleAnswer);
    };
  }, [
    handleAnswer,
    handleExistingUsers,
    handleIncomingOffer,
    handleNewUserJoined,
    socket,
  ]);

  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegotiation);
    return () => {
      peer.removeEventListener("negotiationneeded", handleNegotiation);
    };
  }, [handleNegotiation, peer]);

  // Auto-join the room from URL with current user's email
  useEffect(() => {
    if (!socket || !roomId || !emailId || hasJoinedRef.current) return;

    const joinRoom = () => {
      if (!roomId || !emailId) return;
      console.log("Joining room from URL", roomId, "as", emailId);
      socket.emit("join-room", { roomId, emailId });
      hasJoinedRef.current = true;
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.once("connect", joinRoom);
    }

    return () => {
      socket.off("connect", joinRoom);
    };
  }, [emailId, roomId, socket]);

  //Hook that emit the ice candidate to the socket server
  useEffect(() => {
    const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate && remoteSocketId) {
        socket.emit("ice-candidate", {
          target: remoteSocketId,
          candidate: event.candidate,
        });
      }
    };

    const handleRemoteIce = (data: {
      candidate: RTCIceCandidateInit;
      from: string;
    }) => {
      if (data?.candidate) {
        setRemoteSocketId((prev) => prev || data.from);
        if (!peer.remoteDescription) {
          pendingIceRef.current.push(data.candidate);
          return;
        }
        peer.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };

    peer.addEventListener("icecandidate", handleIceCandidate);
    socket.on("ice-candidate", handleRemoteIce);

    return () => {
      peer.removeEventListener("icecandidate", handleIceCandidate);
      socket.off("ice-candidate", handleRemoteIce);
    };
  }, [peer, remoteSocketId, socket]);

  //hook to get the media stream of device
  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && myStream) {
      localVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  // Attach remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Auto-send local tracks once we have them
  useEffect(() => {
    if (myStream) {
      sendStream(myStream);
    }
  }, [myStream, sendStream]);

  // If we queued a call before media was ready, place it now
  useEffect(() => {
    if (pendingCall && myStream) {
      callUser(pendingCall);
    }
  }, [callUser, myStream, pendingCall]);

  // Redirect back if required params are missing
  useEffect(() => {
    if (!roomId) {
      navigate("/appointments");
    }
  }, [navigate, roomId]);

  return (
    <div className="fixed inset-0 bg-slate-900 mt-16 mb-2 xl:mt-16 xl:mb-4 flex flex-col">
      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video - Full Screen */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local Video - Circular PiP Bottom Right */}
        <div className="absolute top-5 right-5 w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        {/* Call Info Overlay */}
        <div className="absolute top-8 left-8 text-white">
          <p className="text-sm font-medium">
            {remoteEmailId || "Waiting for participant..."}
          </p>
        </div>
      </div>

      {/* Control Bar - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6 items-center">
        {/* Audio Toggle */}
        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full transition-all ${
            isAudioOn
              ? "bg-slate-700 hover:bg-slate-600"
              : "bg-red-600 hover:bg-red-700"
          }`}
          title={isAudioOn ? "Mute" : "Unmute"}
        >
          {isAudioOn ? (
            <Mic className="w-6 h-6 text-white" />
          ) : (
            <MicOff className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Video Toggle */}
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-all ${
            isVideoOn
              ? "bg-slate-700 hover:bg-slate-600"
              : "bg-red-600 hover:bg-red-700"
          }`}
          title={isVideoOn ? "Turn off camera" : "Turn on camera"}
        >
          {isVideoOn ? (
            <Video className="w-6 h-6 text-white" />
          ) : (
            <VideoOff className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Screen Share */}
        <button
          onClick={handleScreenShare}
          className="p-4 rounded-full bg-slate-700 hover:bg-slate-600 transition-all"
          title="Share screen"
        >
          <Share2 className="w-6 h-6 text-white" />
        </button>

        {/* End Call */}
        <button
          onClick={handleEndCall}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all"
          title="End call"
        >
          <Phone className="w-6 h-6 text-white rotate-[135deg]" />
        </button>
      </div>
    </div>
  );
};

export default RoomPage;
