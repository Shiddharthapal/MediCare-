"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSocket } from "@/components/provider/socket";

type SenderRole = "doctor" | "patient";

interface Message {
  id: string;
  senderEmail: string;
  senderRole: SenderRole;
  text: string;
  timestamp: number;
  roomId: string;
}

interface MessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorName: string;
  patientName: string;
  doctorEmail: string;
  patientEmail: string;
  senderRole: SenderRole; // who is using this modal
}

const buildChatRoomId = (doctorEmail: string, patientEmail: string) => {
  const d = doctorEmail?.trim().toLowerCase();
  const p = patientEmail?.trim().toLowerCase();
  if (!d || !p) return null;
  return `chat:${[d, p].sort().join(":")}`;
};

export const MessageModal = ({
  open,
  onOpenChange,
  doctorName,
  patientName,
  doctorEmail,
  patientEmail,
  senderRole,
}: MessageModalProps) => {
  const { socket } = useSocket();
  const senderEmail = senderRole === "doctor" ? doctorEmail : patientEmail;

  const roomId = useMemo(
    () => buildChatRoomId(doctorEmail, patientEmail),
    [doctorEmail, patientEmail]
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  //for receive the message
  useEffect(() => {
    if (!open || !socket || !roomId || !senderEmail) return;

    const handleHistory = (payload: {
      roomId: string;
      messages: Message[];
    }) => {
      if (payload.roomId !== roomId) return;
      setMessages(payload.messages || []);
    };

    const handleIncomingMessage = (message: Message) => {
      if (message.roomId !== roomId) return;
      setMessages((prev) => [...prev, message]);
    };

    socket.on("chat:history", handleHistory);
    socket.on("chat:message", handleIncomingMessage);
    socket.emit("chat:join", {
      roomId,
      userEmail: senderEmail,
      userRole: senderRole,
    });

    return () => {
      socket.off("chat:history", handleHistory);
      socket.off("chat:message", handleIncomingMessage);
    };
  }, [open, roomId, senderEmail, senderRole, socket]);

  //handler function to send message
  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || !socket || !roomId || !senderEmail) return;
    if (!socket.connected) {
      alert("Socket not connected. Please try again.");
      return;
    }

    setIsSending(true);
    socket.emit("chat:message", {
      roomId,
      text: inputValue.trim(),
      senderEmail,
      senderRole,
    });
    setInputValue("");
    setIsSending(false);
  }, [inputValue, roomId, senderEmail, senderRole, socket]);

  const canSend =
    !!inputValue.trim() && !!roomId && !!senderEmail && socket?.connected;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Chat with {senderRole === "patient" ? doctorName : patientName}
          </DialogTitle>
        </DialogHeader>

        {/* Messages Area */}
        <ScrollArea className="flex-1 pr-4 custom-scrollbar scrollbar-track-white">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderEmail === senderEmail ? "justify-end" : "justify-start"}`}
              >
                {/* Right-align my messages, left-align the other user */}
                <div
                  className={`max-w-xs px-4 pt-2 pb-1 rounded-lg break-words overflow-wrap ${
                    message.senderEmail === senderEmail
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span
                    className={`text-xs ${
                      message.senderEmail === senderEmail
                        ? "text-blue-100"
                        : "text-gray-600"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="px-2 py-1  bg-white">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isSending}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isSending || !canSend}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
