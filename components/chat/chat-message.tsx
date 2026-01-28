import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex flex-col max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-relaxed border transition-all duration-200",
        role === "user"
          ? "self-end bg-accent text-accent-foreground ml-auto border-transparent"
          : "self-start bg-card text-card-foreground border-border",
      )}
    >
      <div className="whitespace-pre-wrap font-normal">{content}</div>
    </div>
  );
}
