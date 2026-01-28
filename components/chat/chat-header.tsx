import { Plus, ClockCounterClockwise } from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface ChatHeaderProps {
  onNewChat: () => void;
  onOpenHistory: () => void;
}

export function ChatHeader({ onNewChat, onOpenHistory }: ChatHeaderProps) {
  return (
    <header className="fixed top-4 left-0 right-0 z-10 px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3 bg-background border border-border rounded-xl transition-all">
        <h1 className="text-lg font-medium tracking-tight select-none">
          Unsafx
        </h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={onOpenHistory}
            className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground active:scale-95"
            title="History"
          >
            <ClockCounterClockwise size={20} />
          </button>
          <button
            onClick={onNewChat}
            className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground active:scale-95"
            title="New Chat"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
