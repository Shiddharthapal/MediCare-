"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSocket } from "@/components/provider/socket";
import { useNavigate } from "react-router-dom";

interface RoomCreationFormProps {
  onSuccess?: () => void;
  emailId: string; // must be provided so server join validation passes
  mode?: "video" | "audio";
}

export const RoomCreationForm = ({
  onSuccess,
  emailId,
  mode = "video",
}: RoomCreationFormProps) => {
  const [roomNumber, setRoomNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const handleRoomJoined = useCallback(
    ({ roomId }: { roomId: string }) => {
      setIsLoading(false);
      console.log("Room joined successfully:", roomId, "mode:", mode);
      const modeQuery = mode === "audio" ? "?mode=audio" : "";
      navigate(`/room/${roomId}${modeQuery}`);
      onSuccess?.();
    },
    [mode, navigate, onSuccess]
  );

  const handleRoomJoinError = useCallback((error: { message: string }) => {
    setIsLoading(false);
    console.error("Error joining room:", error);
    alert(error.message || "Failed to join room. Please try again.");
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("joined-room", handleRoomJoined);
    socket.on("join-room-error", handleRoomJoinError);

    return () => {
      socket.off("joined-room", handleRoomJoined);
      socket.off("join-room-error", handleRoomJoinError);
    };
  }, [socket, handleRoomJoined, handleRoomJoinError]);

  const handleJoinRoom = () => {
    if (!roomNumber.trim()) {
      alert("Please enter a room number");
      return;
    }

    if (!emailId) {
      alert("Unable to join: missing email. Please re-login and try again.");
      return;
    }

    if (!socket) {
      alert("Socket connection not available. Please refresh the page.");
      return;
    }

    if (!socket.connected) {
      alert("Not connected to server. Please check your connection and retry.");
      return;
    }

    setIsLoading(true);
    console.log("Joining room:", roomNumber);
    socket.emit("join-room", { roomId: roomNumber, emailId: emailId });

    // Optional: Add a timeout in case the server doesn't respond
    const id = window.setTimeout(() => {
      setIsLoading(false);
      alert("Request timed out. Please try again.");
    }, 300000); //  5 min timeout
    setTimeoutId(id);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="room-number">Enter a room number</Label>
        <Input
          id="room-number"
          type="text"
          placeholder="e.g., 101, A-1, Video-Room-1"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) {
              handleJoinRoom();
            }
          }}
          className="w-full"
          disabled={isLoading}
          autoFocus
        />
      </div>
      <Button onClick={handleJoinRoom} className="w-full" disabled={isLoading}>
        {isLoading ? "Joining..." : "Enter"}
      </Button>
    </div>
  );
};
