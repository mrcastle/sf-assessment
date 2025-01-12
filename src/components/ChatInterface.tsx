"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";

interface ChatInterfaceProps {
  documentId: string;
  onUpdatePDF?: (page: number, highlights: any[]) => void;
}

export default function ChatInterface({
  documentId,
  onUpdatePDF = () => {},
}: ChatInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognition = useRef<SpeechRecognition | null>(null);
  const synthesis = useRef<SpeechSynthesis | null>(null);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    body: { documentId },
    onResponse: (response) => {
      // Parse AI response for PDF controls
      try {
        const metadata = JSON.parse(response.headers.get("x-metadata") || "{}");
        if (metadata.page || metadata.highlights) {
          onUpdatePDF(metadata.page || 1, metadata.highlights || []);
        }
      } catch (e) {
        console.error("Failed to parse metadata:", e);
      }
    },
  });

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition.current = new SpeechRecognition();
        if (recognition.current) {
          recognition.current.continuous = true;
          recognition.current.interimResults = true;
          recognition.current.onresult = (event) => {
            const transcript = Array.from(
              event.results as unknown as ArrayLike<SpeechRecognitionResult>
            )
              .map((result) => result[0].transcript)
              .join("");
            setTranscript(transcript);
          };
        }
      }
      synthesis.current = window.speechSynthesis;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition.current) return;

    if (isRecording) {
      recognition.current.stop();
    } else {
      recognition.current.start();
    }
    setIsRecording(!isRecording);
  };

  const speakResponse = (text: string) => {
    if (synthesis.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      synthesis.current.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === "user"
                ? "bg-blue-100 ml-12"
                : "bg-gray-100 mr-12"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t p-4 flex items-center space-x-2"
      >
        <button
          type="button"
          onClick={toggleRecording}
          className={`p-2 rounded-full ${
            isRecording ? "bg-red-500" : "bg-gray-200"
          }`}
        >
          🎤
        </button>
        <input
          value={isRecording ? transcript : input}
          onChange={handleInputChange}
          placeholder="Ask a question about the document..."
          className="flex-1 p-2 border rounded-md"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Send
        </button>
      </form>
    </div>
  );
}
