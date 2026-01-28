"use client";

import Image from "next/image";

import { useState, useRef, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { models } from "@/models/models";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage } from "@/components/chat/chat-message";
import { HistoryModal } from "@/components/chat/history-modal";
import { Message, HistoryItem } from "@/lib/types";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(models[0].id);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [history, setHistory] = useLocalStorage<HistoryItem[]>(
    "chat-history",
    [],
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    if (messages.length > 0) {
      const historyItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        messages: messages,
        preview:
          messages[0].content.substring(0, 50) +
          (messages[0].content.length > 50 ? "..." : ""),
      };
      setHistory((prev) => [historyItem, ...prev]);
    }
    setMessages([]);
    setInput("");
    setIsHistoryOpen(false);
  };

  const loadHistory = (item: HistoryItem) => {
    setMessages(item.messages);
    setIsHistoryOpen(false);
  };

  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantMessage += chunk;

        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === "assistant") {
            lastMsg.content = assistantMessage;
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Failed to generate response." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground relative overflow-hidden font-sans">
      <ChatHeader
        onNewChat={handleNewChat}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <main className="flex-1 overflow-y-auto pt-24 pb-32 px-4 sm:px-6 scrollbar-hide">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground animate-in fade-in duration-500 select-none gap-4">
              <Image
                src="/empty-state.svg"
                alt="Start a conversation"
                width={200}
                height={200}
                className="opacity-50 dark:invert"
              />
              <p className="text-sm">
                Start a conversation using a model below.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <ChatMessage key={idx} role={msg.role} content={msg.content} />
            ))
          )}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="self-start text-muted-foreground text-sm animate-pulse ml-1">
              Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        selectedModelId={selectedModel}
        onModelSelect={setSelectedModel}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadHistory={loadHistory}
        onDeleteHistory={deleteHistoryItem}
      />
    </div>
  );
}
