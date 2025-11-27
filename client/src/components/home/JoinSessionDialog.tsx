import { useState } from "react";
import { Users, Link2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JoinSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinSessionDialog({ open, onOpenChange }: JoinSessionDialogProps) {
  const [roomId, setRoomId] = useState("");

  const handleJoin = () => {
    // Here you would handle the room joining logic
    console.log({ roomId });
    
    // Reset form
    setRoomId("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Users className="w-5 h-5" />
            </div>
            Join Session
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter the Room ID to join an existing collaborative session and start coding together.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="room-id" className="text-sm font-medium">
              Room ID
            </Label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="room-id"
                placeholder="e.g., abc-123-xyz"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="bg-background/50 border-primary/20 focus-visible:ring-primary/50 focus-visible:border-primary/50 pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Ask your team member for the Room ID or check your invitation link.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border hover:bg-secondary/50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleJoin}
            disabled={!roomId.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:shadow-none"
          >
            <Users className="w-4 h-4 mr-2" />
            Join Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
