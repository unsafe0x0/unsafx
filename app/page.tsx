"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  ClockCounterClockwise,
  PaperPlaneRight,
  X,
  Trash,
} from "@phosphor-icons/react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ModelSelector } from "@/components/ui/model-selector";
import { models } from "@/models/models";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type HistoryItem = {
  id: string;
  timestamp: number;
  messages: Message[];
  preview: string;
};

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

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

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
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
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground relative overflow-hidden font-sans">
      <header className="fixed top-4 left-0 right-0 z-10 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3 bg-background border border-border rounded-xl shadow-xs">
          <h1 className="text-lg font-medium tracking-tight">Unsafx</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              title="History"
            >
              <ClockCounterClockwise size={20} />
            </button>
            <button
              onClick={handleNewChat}
              className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              title="New Chat"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pt-24 pb-32 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground animate-in fade-in duration-500">
              <p className="text-sm">
                Start a conversation using a model below.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex flex-col max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-relaxed border",
                  msg.role === "user"
                    ? "self-end bg-secondary text-secondary-foreground ml-auto border-transparent"
                    : "self-start bg-card text-foreground border-border",
                )}
              >
                <span className="whitespace-pre-wrap">{msg.content}</span>
              </div>
            ))
          )}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="self-start text-muted-foreground text-sm animate-pulse">
              Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-linear-to-t from-background via-background to-transparent z-20">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex flex-col bg-background border border-border rounded-xl focus-within:ring-1 focus-within:ring-border transition-all shadow-sm">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full bg-transparent border-none resize-none p-4 pb-12 focus:outline-none text-sm max-h-48 overflow-y-auto"
              rows={1}
            />

            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
              <ModelSelector
                models={models}
                selectedModelId={selectedModel}
                onSelect={setSelectedModel}
              />

              <button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isLoading}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  input.trim() && !isLoading
                    ? "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
                    : "text-muted-foreground cursor-not-allowed opacity-50",
                )}
              >
                <PaperPlaneRight size={16} weight="fill" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsHistoryOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-background border border-border rounded-xl shadow-lg flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-sm font-medium">History</h2>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="p-1 hover:bg-secondary rounded text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {history.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No history yet
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => loadHistory(item)}
                      className="group flex flex-col gap-1 p-3 rounded-lg hover:bg-secondary cursor-pointer transition-colors border border-transparent hover:border-border relative"
                    >
                      <div className="text-xs font-medium truncate pr-6 text-foreground/90">
                        {item.preview || "New Conversation"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                      <button
                        onClick={(e) => deleteHistoryItem(e, item.id)}
                        className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                        title="Delete"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
