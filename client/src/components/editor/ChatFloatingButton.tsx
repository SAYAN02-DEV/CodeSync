import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatFloatingButton() {
  return (
    <div className="absolute bottom-6 right-6 flex flex-col gap-3">
      <div className="relative group">
        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with team
        </div>
        <Button size="icon" className="h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90">
          <MessageSquare className="w-5 h-5" />
        </Button>
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </div>
    </div>
  );
}
