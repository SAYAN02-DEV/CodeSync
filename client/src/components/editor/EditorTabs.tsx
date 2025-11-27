import { FileCode2, X } from "lucide-react";

interface EditorTab {
  name: string;
  isActive: boolean;
}

interface EditorTabsProps {
  tabs: EditorTab[];
  activeFile: string;
  onTabSelect: (filename: string) => void;
  onTabClose?: (filename: string) => void;
}

export function EditorTabs({ tabs, activeFile, onTabSelect, onTabClose }: EditorTabsProps) {
  const getFileColor = (filename: string) => {
    if (filename.endsWith('.tsx') || filename.endsWith('.ts')) return 'text-blue-400';
    if (filename.endsWith('.css')) return 'text-yellow-400';
    if (filename.endsWith('.json')) return 'text-green-400';
    return 'text-gray-400';
  };

  return (
    <div className="flex items-center bg-card border-b border-border/50">
      <div className="flex">
        {tabs.map((tab) => (
          <div 
            key={tab.name}
            className={`flex items-center gap-2 px-4 py-2 cursor-pointer text-sm font-medium min-w-[120px] border-r border-border/50 ${
              activeFile === tab.name 
                ? "bg-background border-t-2 border-t-primary" 
                : "hover:bg-secondary/20 text-muted-foreground"
            }`}
            onClick={() => onTabSelect(tab.name)}
          >
            <FileCode2 className={`w-4 h-4 ${getFileColor(tab.name)}`} />
            {tab.name}
            {onTabClose && (
              <X 
                className="w-3 h-3 ml-auto text-muted-foreground hover:text-foreground" 
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.name);
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
