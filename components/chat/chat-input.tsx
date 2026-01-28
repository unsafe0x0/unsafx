import { useRef, useEffect } from "react";
import { PaperPlaneRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ModelSelector } from "@/components/ui/model-selector";
import { models } from "@/models/models";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  selectedModelId: string;
  onModelSelect: (id: string) => void;
}

export function ChatInput({
  input,
  setInput,
  isLoading,
  onSubmit,
  selectedModelId,
  onModelSelect,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-linear-to-t from-background via-background to-transparent z-20">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex flex-col bg-background border border-border rounded-xl focus-within:ring-1 focus-within:ring-border transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full bg-transparent border-none resize-none p-4 pb-12 focus:outline-none text-sm max-h-48 overflow-y-auto placeholder:text-muted-foreground/50"
            rows={1}
            disabled={isLoading}
          />

          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-background rounded-b-lg">
            <ModelSelector
              models={models}
              selectedModelId={selectedModelId}
              onSelect={onModelSelect}
            />

            <button
              onClick={onSubmit}
              disabled={!input.trim() || isLoading}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-xs",
                input.trim() && !isLoading
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-secondary text-muted-foreground cursor-not-allowed",
              )}
            >
              <span>Send</span>
              <PaperPlaneRight size={14} weight="fill" />
            </button>
          </div>
        </div>
        <div className="text-center mt-2">
          {/* Disclaimer removed as per request */}
        </div>
      </div>
    </div>
  );
}
