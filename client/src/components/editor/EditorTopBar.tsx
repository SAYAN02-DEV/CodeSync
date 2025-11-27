import { Play, Share2, Settings, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserAvatar } from "@/components/layout/UserAvatar";

interface EditorTopBarProps {
  projectName: string;
  activeFile: string;
  collaborators?: Array<{ src?: string; fallback: string; bgColor?: string }>;
  onSaveToIPFS?: () => void;
}

export function EditorTopBar({ projectName, activeFile, collaborators = [], onSaveToIPFS }: EditorTopBarProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-4 w-[1px] bg-border" />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{projectName}</span>
        <span className="text-border">/</span>
        <span className="text-foreground">{activeFile}</span>
      </div>
      
      <div className="ml-auto flex items-center gap-3">
        {collaborators.length > 0 && (
          <div className="flex -space-x-2 mr-2">
            {collaborators.slice(0, 2).map((collab, idx) => (
              <Avatar key={idx} className="h-7 w-7 border-2 border-background">
                {collab.src ? (
                  <AvatarImage src={collab.src} />
                ) : null}
                <AvatarFallback className={collab.bgColor || "bg-purple-600"}>
                  {collab.fallback}
                </AvatarFallback>
              </Avatar>
            ))}
            {collaborators.length > 2 && (
              <div className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] text-muted-foreground font-bold">
                +{collaborators.length - 2}
              </div>
            )}
          </div>
        )}
        
        <Button size="sm" variant="outline" className="h-8 gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary">
          <Play className="w-3 h-3" />
          Run
        </Button>
        {onSaveToIPFS && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onSaveToIPFS}
            className="h-8 gap-2 border-green-500/20 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/50"
          >
            <Upload className="w-3 h-3" />
            Save to IPFS
          </Button>
        )}
        <Button size="sm" className="h-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
          <Share2 className="w-3 h-3" />
          Share
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <Settings className="w-4 h-4" />
        </Button>
        <UserAvatar className="h-8 w-8 ml-2 cursor-pointer" />
      </div>
    </div>
  );
}
