import { GitBranch, X } from "lucide-react";

export function StatusBar() {
  return (
    <footer className="h-6 bg-primary text-primary-foreground flex items-center justify-between px-3 text-[10px] select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </div>
        <div className="flex items-center gap-1">
          <X className="w-3 h-3 rounded-full bg-red-500/20 p-[1px]" />
          <span>0 errors</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-200">!</span>
          <span>0 warnings</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span>Ln 12, Col 34</span>
        <span>UTF-8</span>
        <span>TypeScript React</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>Online</span>
        </div>
      </div>
    </footer>
  );
}
