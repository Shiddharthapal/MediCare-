import React, { useMemo, useState, useEffect } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket;
}

const SocketContext = React.createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used inside <SocketProvider>");
  }
  return context;
};

export const SocketProvider = (props: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);

  // Prefer an env-configured URL so it stays in sync with the server port/origin
  const envSocketUrl = import.meta.env.PUBLIC_SOCKET_URL?.trim();
  const socketUrl = envSocketUrl || window.location.origin;
  console.log("🧞‍♂️  socketUrl --->", socketUrl);
  console.log(
    "Socket connecting to",
    socketUrl,
    "from",
    window.location.origin
  );
  const socket = useMemo(
    () =>
      io(socketUrl, {
        transports: ["websocket", "polling"], // try websocket first, fall back if needed
        withCredentials: true,
      }),
    [socketUrl]
  );

  useEffect(() => {
    const onConnect = () => {
      console.log(" Socket connected:", socket.id);
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onConnectError = (err: any) => {
      setIsConnected(false);
    };

    const onError = (err: any) => {
      console.error(" Socket error:", err);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.io.on("error", onError);
    socket.io.on("reconnect_error", onError);

    // Check initial connection state
    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.io.off("error", onError);
      socket.io.off("reconnect_error", onError);
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};
