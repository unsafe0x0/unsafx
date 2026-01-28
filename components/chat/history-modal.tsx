import { X, Trash } from "@phosphor-icons/react";
import { HistoryItem } from "@/lib/types";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onLoadHistory: (item: HistoryItem) => void;
  onDeleteHistory: (e: React.MouseEvent, id: string) => void;
}

export function HistoryModal({
  isOpen,
  onClose,
  history,
  onLoadHistory,
  onDeleteHistory,
}: HistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24 bg-background/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-background border border-border rounded-xl flex flex-col max-h-[70vh] animate-in slide-in-from-top-10 fade-in duration-200 ring-1 ring-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-sm font-medium">History</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded-md text-muted-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
          {history.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground select-none">
              No history yet
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onLoadHistory(item)}
                  className="group relative flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-border/50"
                >
                  <div className="flex flex-col gap-1 min-w-0 pr-8">
                    <span className="text-sm font-medium truncate text-foreground/90 group-hover:text-foreground transition-colors">
                      {item.preview || "New Conversation"}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      {new Date(item.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <button
                    onClick={(e) => onDeleteHistory(e, item.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all duration-200"
                    title="Delete"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
