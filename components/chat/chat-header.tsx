import { ClockCounterClockwise, Gear, Plus } from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface ChatHeaderProps {
  onNewChat: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

export function ChatHeader({
  onNewChat,
  onOpenHistory,
  onOpenSettings,
}: ChatHeaderProps) {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-10">
      <div className="flex items-center justify-center gap-2 px-3 py-2 bg-background/10 backdrop-blur-sm border border-border rounded-xl transition-all shadow-sm">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground active:scale-95"
            title="Settings"
          >
            <Gear size={20} />
          </button>
          <button
            type="button"
            onClick={onOpenHistory}
            className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground active:scale-95"
            title="History"
          >
            <ClockCounterClockwise size={20} />
          </button>
          <button
            type="button"
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
