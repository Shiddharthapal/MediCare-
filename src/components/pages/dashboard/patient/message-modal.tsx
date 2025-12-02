"use client";

import { useState } from "react";
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

interface Message {
  id: string;
  sender: "doctor" | "patient";
  text: string;
  timestamp: Date;
}

interface MessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorName: string;
  patientName: string;
  onSendMessage: (message: string) => void;
}

export const MessageModal = ({
  open,
  onOpenChange,
  doctorName,
  patientName,
  onSendMessage,
}: MessageModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "doctor",
      text: "Hello! How are you feeling today?",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "2",
      sender: "patient",
      text: "I am doing well, thank you for asking!",
      timestamp: new Date(Date.now() - 240000),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add message to the list
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "patient",
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    setIsSending(true);

    // Simulate sending
    setTimeout(() => {
      onSendMessage(inputValue);
      setIsSending(false);

      // Simulate doctor response
      setTimeout(() => {
        const doctorResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: "doctor",
          text: "Thank you for the update. Take care!",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, doctorResponse]);
      }, 1000);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chat with {doctorName}</DialogTitle>
        </DialogHeader>

        {/* Messages Area */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === "patient"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span
                    className={`text-xs ${message.sender === "patient" ? "text-blue-100" : "text-gray-600"}`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
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
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isSending}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={isSending || !inputValue.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
