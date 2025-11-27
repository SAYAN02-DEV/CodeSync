import { useState } from "react";
import { ChevronDown, ChevronRight, FolderOpen, FileCode2 } from "lucide-react";

export interface FileTreeItem {
  id: string;
  name: string;
  type: "file" | "folder";
  lang?: string;
  isOpen?: boolean;
  children?: FileTreeItem[];
}

interface FileTreeItemProps {
  item: FileTreeItem;
  depth?: number;
  activeFile: string;
  onFileSelect: (filename: string) => void;
}

export function FileTreeItemComponent({ item, depth = 0, activeFile, onFileSelect }: FileTreeItemProps) {
  const [isOpen, setIsOpen] = useState(item.isOpen || false);
  
  if (item.type === "folder") {
    return (
      <div>
        <div 
          className={`flex items-center gap-1 px-2 py-1 hover:bg-secondary/50 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <FolderOpen className="w-4 h-4 text-blue-400" />
          <span>{item.name}</span>
        </div>
        {isOpen && item.children?.map((child) => (
          <FileTreeItemComponent 
            key={child.id} 
            item={child} 
            depth={depth + 1}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center gap-2 px-2 py-1 cursor-pointer text-sm transition-colors ${
        activeFile === item.name 
          ? "bg-primary/10 text-primary border-l-2 border-primary" 
          : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground border-l-2 border-transparent"
      }`}
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
      onClick={() => onFileSelect(item.name)}
    >
      <FileCode2 className="w-4 h-4 opacity-70" />
      <span>{item.name}</span>
    </div>
  );
}
