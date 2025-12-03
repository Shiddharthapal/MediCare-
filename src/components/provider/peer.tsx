import React, { useCallback, useEffect, useMemo, useState } from "react";

const PeerContext = React.createContext(null);

export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider = (props) => {
  const [remoteStream, setRemoteStream] = useState(null);
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );

  const createOffer = async () => {
    if (peer.signalingState !== "stable") {
      console.warn(
        "[peer] Skipping createOffer because signalingState is",
        peer.signalingState
      );
      return null;
    }
    const offer = await peer.createOffer();
    await peer?.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer: RTCSessionDescriptionInit) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAns = async (ans: RTCSessionDescriptionInit) => {
    await peer.setRemoteDescription(ans);
  };

  const sendStream = async (stream) => {
    const tracks = stream.getTracks();
    const senders = peer.getSenders();

    for (const track of tracks) {
      const existing = senders.find((s) => s.track && s.track.id === track.id);
      if (existing) {
        // Replace to avoid "sender already exists for track" errors
        await existing.replaceTrack(track);
      } else {
        peer.addTrack(track, stream);
      }
    }
  };

  const handleTrackEvent = useCallback((ev) => {
    const stream = ev.streams;
    setRemoteStream(stream[0]);
  }, []);

  useEffect(() => {
    peer.addEventListener("track", handleTrackEvent);

    return () => {
      peer.removeEventListener("track", handleTrackEvent);
    };
  }, [handleTrackEvent, peer]);
  return (
    <PeerContext.Provider
      value={{
        peer,
        createOffer,
        createAnswer,
        setRemoteAns,
        sendStream,
        remoteStream,
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};
