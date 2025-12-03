import React, { useEffect, useCallback, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { useSocket } from "@/components/provider/socket";
import { usePeer } from "@/components/provider/peer";

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
  } = usePeer();
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteEmailId, setRemoteEmailId] = useState<string | null>(null);
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [pendingCall, setPendingCall] = useState<{
    socketId: string;
    emailId?: string;
  } | null>(null);
  const [isMakingOffer, setIsMakingOffer] = useState(false);
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

  // Ensure we always have a local stream before sending offers/answers
  const ensureLocalStream = useCallback(async () => {
    if (myStream) return myStream;
    const stream = await getUserMediaStream();
    return stream;
  }, [getUserMediaStream, myStream]);

  const callUser = useCallback(
    async ({ socketId, emailId }: { socketId: string; emailId?: string }) => {
      const stream = await ensureLocalStream();
      if (!stream) return;
      setPendingCall(null);
      setRemoteSocketId(socketId);
      setRemoteEmailId(emailId || null);
      await sendStream(stream);
      const offer = await createOffer();
      if (!offer) return;
      socket.emit("offer", { target: socketId, sdp: offer });
    },
    [createOffer, ensureLocalStream, sendStream, socket]
  );

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

  const handleIncomingOffer = useCallback(
    async (data) => {
      const { sdp, callerId, emailId } = data;
      console.log("Incoming offer from", callerId, emailId);
      const offerCollision =
        isMakingOffer || peer.signalingState !== "stable";
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
    [
      createAnswer,
      ensureLocalStream,
      isMakingOffer,
      peer,
      sendStream,
      socket,
    ]
  );

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

  const handleNegotiation = useCallback(async () => {
    if (!remoteSocketId) return;
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
  }, [
    createOffer,
    ensureLocalStream,
    remoteSocketId,
    sendStream,
    socket,
  ]);

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
    <div>
      <h1>Room Page</h1>
      <div className="flex gap-4">
        <div>
          <p>Me</p>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-64 h-48 bg-black"
          />
        </div>
        <div>
          <p>Remote</p>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-64 h-48 bg-black"
          />
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
