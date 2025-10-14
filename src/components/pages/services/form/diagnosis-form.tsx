"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot, User, Stethoscope } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIChatInterfaceProps {
  onClose: () => void;
}

export default function AIChatInterface({ onClose }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI Medical Assistant. I can help you understand symptoms and provide general health information. Please describe your symptoms or health concerns, and I'll do my best to assist you. Remember, this is for informational purposes only and doesn't replace professional medical advice.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Simple keyword-based responses for demonstration
    if (
      lowerMessage.includes("headache") ||
      lowerMessage.includes("head pain")
    ) {
      return "Headaches can have various causes including stress, dehydration, lack of sleep, or tension. For frequent or severe headaches, I recommend: 1) Stay hydrated, 2) Get adequate rest, 3) Manage stress, 4) Consider over-the-counter pain relievers if appropriate. If headaches persist or worsen, please consult a healthcare professional.";
    }

    if (
      lowerMessage.includes("fever") ||
      lowerMessage.includes("temperature")
    ) {
      return "Fever is often a sign that your body is fighting an infection. For mild fever: 1) Rest and stay hydrated, 2) Use fever-reducing medications if needed, 3) Monitor your temperature regularly. Seek immediate medical attention if fever exceeds 103°F (39.4°C) or is accompanied by severe symptoms.";
    }

    if (lowerMessage.includes("cough") || lowerMessage.includes("throat")) {
      return "Coughs can be caused by various factors including viral infections, allergies, or irritants. For symptom relief: 1) Stay hydrated, 2) Use throat lozenges, 3) Consider honey for soothing, 4) Avoid irritants like smoke. If cough persists for more than 2 weeks or is accompanied by blood, seek medical attention.";
    }

    if (
      lowerMessage.includes("stomach") ||
      lowerMessage.includes("nausea") ||
      lowerMessage.includes("digestive")
    ) {
      return "Digestive issues can result from various causes including diet, stress, or infections. General recommendations: 1) Eat bland foods (BRAT diet), 2) Stay hydrated, 3) Avoid dairy and fatty foods temporarily, 4) Rest. If symptoms persist or worsen, especially with severe pain or blood, consult a healthcare provider.";
    }

    // Default response
    return "Thank you for sharing your symptoms. Based on what you've described, I recommend monitoring your condition closely. General wellness tips include: staying hydrated, getting adequate rest, maintaining good hygiene, and eating nutritious foods. However, for a proper diagnosis and treatment plan, it's important to consult with a qualified healthcare professional who can examine you in person and consider your full medical history.";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gray-100">
      <Card className="w-full max-w-2xl mx-auto h-auto flex flex-col bg-white shadow-xl my-2">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-[hsl(201,96%,32%)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-[hsl(201,96%,32%)]" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Medical Assistant</h3>
              <p className="text-sm text-white">Online • Ready to help</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "ai" && (
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-[hsl(201,96%,32%)]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-[hsl(201,96%,32%)] text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${message.sender === "user" ? "text-cyan-100" : "text-gray-500"}`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {message.sender === "user" && (
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-[hsl(201,96%,32%)]0" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-[hsl(201,96%,32%)]" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms or ask a health question..."
                className="flex-1 "
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-[hsl(201,96%,32%)] hover:text-black text-white px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              This AI assistant provides general information only. Always
              consult healthcare professionals for medical advice.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
