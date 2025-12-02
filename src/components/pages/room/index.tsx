import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "@/components/provider/socket";
import { usePeer } from "@/components/provider/peer";

// Client signaling aligned with server: offer/answer/ice-candidate targeting socketId
const RoomPage = () => {
  const { socket } = useSocket();
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAns,
    sendStream,
    remoteStream,
  } = usePeer();
  const [myStream, setMyStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState<string | null>(null);
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);

  const callUser = useCallback(
    async ({ socketId, emailId }: { socketId: string; emailId?: string }) => {
      setRemoteSocketId(socketId);
      setRemoteEmailId(emailId || null);
      const offer = await createOffer();
      socket.emit("offer", { target: socketId, sdp: offer });
    },
    [createOffer, socket]
  );

  const handleExistingUsers = useCallback(
    async ({ users }) => {
      if (!users || users.length === 0) return;
      // Call the first existing user
      const first = users[0];
      await callUser({ socketId: first.socketId, emailId: first.emailId });
    },
    [callUser]
  );

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { socketId, emailId } = data;
      console.log("User joined:", socketId, emailId);
      await callUser({ socketId, emailId });
    },
    [callUser]
  );

  const handleIncomingOffer = useCallback(
    async (data) => {
      const { sdp, callerId, emailId } = data;
      console.log("Incoming offer from", callerId, emailId);
      setRemoteSocketId(callerId);
      setRemoteEmailId(emailId || null);
      const ans = await createAnswer(sdp);
      socket.emit("answer", { target: callerId, sdp: ans });
    },
    [createAnswer, socket]
  );

  const handleAnswer = useCallback(
    async (data) => {
      const { sdp, calleeId } = data;
      console.log("Answer received from", calleeId);
      await setRemoteAns(sdp);
    },
    [setRemoteAns]
  );

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
  }, []);

  const handleNegotiation = useCallback(() => {
    const localOffer = peer.localDescription;
    if (localOffer && remoteSocketId) {
      socket.emit("offer", { target: remoteSocketId, sdp: localOffer });
    }
  }, [peer, remoteSocketId, socket]);

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
  }, [handleAnswer, handleExistingUsers, handleIncomingOffer, handleNewUserJoined, socket]);

  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegotiation);
    return () => {
      peer.removeEventListener("negotiationneeded", handleNegotiation);
    };
  }, [handleNegotiation, peer]);

  useEffect(() => {
    const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate && remoteSocketId) {
        socket.emit("ice-candidate", {
          target: remoteSocketId,
          candidate: event.candidate,
        });
      }
    };

    const handleRemoteIce = (data: { candidate: RTCIceCandidateInit; from: string }) => {
      if (data?.candidate) {
        setRemoteSocketId((prev) => prev || data.from);
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

  return (
    <div>
      <h1>Room Page</h1>
      <button onClick={() => myStream && sendStream(myStream)}>Send My Video</button>
      <ReactPlayer url={myStream} playing />
      <ReactPlayer url={remoteStream} playing />
    </div>
  );
};

export default RoomPage;
