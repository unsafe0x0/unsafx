import { X } from "@phosphor-icons/react";
import { CustomSelect } from "@/components/ui/custom-select";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customInstructions: string;
  setCustomInstructions: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  customInstructions,
  setCustomInstructions,
  tone,
  setTone,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24 bg-background/50 backdrop-blur-sm animate-in fade-in duration-200">
      <button
        type="button"
        className="fixed inset-0 w-full h-full cursor-default focus:outline-none"
        onClick={onClose}
        aria-label="Close modal"
        tabIndex={-1}
      />
      <div className="relative w-full max-w-lg bg-background border border-border rounded-xl flex flex-col shadow-lg animate-in slide-in-from-top-10 fade-in duration-200 ring-1 ring-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-sm font-medium">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded-md text-muted-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="tone-select"
              className="text-sm font-medium text-muted-foreground"
            >
              Response Tone
            </label>
            <CustomSelect
              options={[
                { value: "Standard", label: "Standard" },
                { value: "Professional", label: "Professional" },
                { value: "Casual", label: "Casual" },
                { value: "Concise", label: "Concise" },
                { value: "Creative", label: "Creative" },
                { value: "Explain Like I'm 5", label: "Explain Like I'm 5" },
              ]}
              value={tone}
              onChange={setTone}
              placeholder="Select Tone"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="custom-instructions"
              className="text-sm font-medium text-muted-foreground"
            >
              Custom Instructions
            </label>
            <textarea
              id="custom-instructions"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Always answer in French, or Always format code with comments..."
              className="w-full h-32 px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-border transition-all placeholder:text-muted-foreground/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
