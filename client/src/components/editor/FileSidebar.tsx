import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Search, GitBranch, MoreVertical } from "lucide-react";
import { FileTreeItemComponent, type FileTreeItem } from "./FileTreeItem";

interface FileSidebarProps {
  files: FileTreeItem[];
  activeFile: string;
  onFileSelect: (filename: string) => void;
}

export function FileSidebar({ files, activeFile, onFileSelect }: FileSidebarProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar border-r border-border">
      <div className="flex items-center justify-between p-3 border-b border-border/50">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Explorer</span>
        <MoreVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      
      <ScrollArea className="flex-1 py-2">
        {files.map(file => (
          <FileTreeItemComponent 
            key={file.id} 
            item={file}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
          />
        ))}
      </ScrollArea>
      
      {/* Sidebar Footer */}
      <div className="p-2 border-t border-border/50">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="justify-start gap-2 h-8 text-muted-foreground">
            <Search className="w-4 h-4" />
            Search
          </Button>
          <Button variant="ghost" size="sm" className="justify-start gap-2 h-8 text-muted-foreground">
            <GitBranch className="w-4 h-4" />
            Source Control
          </Button>
        </div>
      </div>
    </div>
  );
}
