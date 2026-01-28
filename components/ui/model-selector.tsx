"use client";

import * as React from "react";
import { CaretDown, Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface Model {
  id: string;
  name: string;
}

interface ModelSelectorProps {
  models: Model[];
  selectedModelId: string;
  onSelect: (modelId: string) => void;
  className?: string;
}

export function ModelSelector({
  models,
  selectedModelId,
  onSelect,
  className,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedModel = models.find((m) => m.id === selectedModelId);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors text-xs font-medium text-foreground bg-background border border-border"
      >
        <span>{selectedModel?.name || "Select Model"}</span>
        <CaretDown
          size={12}
          className={cn("transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-popover border border-border rounded-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 p-1">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onSelect(model.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-xs rounded-md flex items-center justify-between transition-colors",
                model.id === selectedModelId
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <span>{model.name}</span>
              {model.id === selectedModelId && <Check size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
