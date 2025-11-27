import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TerminalPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TerminalPanel({ isOpen: _isOpen, onClose }: TerminalPanelProps) {
  return (
    <div className="h-full flex flex-col bg-card border-t border-border">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-card/50">
        <div className="flex items-center gap-6">
          <button className="text-xs font-medium border-b-2 border-primary pb-[10px] -mb-[11px] text-foreground">
            TERMINAL
          </button>
          <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            OUTPUT
          </button>
          <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            PROBLEMS
          </button>
          <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            DEBUG CONSOLE
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 p-4 font-mono text-xs text-muted-foreground overflow-auto bg-[#0c0a09]">
        <div className="flex gap-2">
          <span className="text-green-500">➜</span>
          <span className="text-blue-400">~/project</span>
          <span className="text-foreground">npm run dev</span>
        </div>
        <div className="mt-2">
          <span className="text-gray-500">  VITE v5.0.0</span>
          <span className="text-green-500">  ready in 345 ms</span>
        </div>
        <div className="mt-2">
          <span className="text-foreground">  ➜  </span>
          <span className="text-foreground font-bold">Local:</span>
          <span className="text-blue-400">   http://localhost:5173/</span>
        </div>
        <div className="mt-1">
          <span className="text-foreground">  ➜  </span>
          <span className="text-foreground font-bold">Network:</span>
          <span className="text-muted-foreground"> use --host to expose</span>
        </div>
        <div className="mt-4 flex gap-2 items-center animate-pulse">
          <span className="text-green-500">➜</span>
          <span className="text-blue-400">~/project</span>
          <div className="w-2 h-4 bg-gray-500"></div>
        </div>
      </div>
    </div>
  );
}
