import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { CodeEditor } from "@/components/CodeEditor";
import { AppHeader } from "@/components/layout/AppHeader";
import { EditorTopBar } from "@/components/editor/EditorTopBar";
import { FileSidebar } from "@/components/editor/FileSidebar";
import { EditorTabs } from "@/components/editor/EditorTabs";
import { TerminalPanel } from "@/components/editor/TerminalPanel";
import { StatusBar } from "@/components/editor/StatusBar";
import { ChatFloatingButton } from "@/components/editor/ChatFloatingButton";
import { type FileTreeItem } from "@/components/editor/FileTreeItem";
import { SaveToIPFSDialog } from "@/components/web3/SaveToIPFSDialog";
import { type ProjectFile } from "@/lib/ipfs";

const FILES: FileTreeItem[] = [
  { id: "1", name: "src", type: "folder", isOpen: true, children: [
    { id: "2", name: "App.tsx", type: "file", lang: "typescript" },
    { id: "3", name: "index.css", type: "file", lang: "css" },
    { id: "4", name: "main.tsx", type: "file", lang: "typescript" },
    { id: "5", name: "components", type: "folder", isOpen: false, children: [
      { id: "6", name: "Header.tsx", type: "file", lang: "typescript" },
      { id: "7", name: "Footer.tsx", type: "file", lang: "typescript" },
    ]},
  ]},
  { id: "8", name: "package.json", type: "file", lang: "json" },
  { id: "9", name: "vite.config.ts", type: "file", lang: "typescript" },
  { id: "10", name: "README.md", type: "file", lang: "markdown" },
];

const INITIAL_CODE = `import React from 'react';
import { useState } from 'react';

// This is a collaborative snippet
// Changes are synced in real-time via WebSockets

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 rounded-lg bg-card border border-border">
      <h2 className="text-xl font-bold mb-4">Counter: {count}</h2>
      <div className="flex gap-2">
        <button 
          onClick={() => setCount(c => c - 1)}
          className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80"
        >
          Decrement
        </button>
        <button 
          onClick={() => setCount(c => c + 1)}
          className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Increment
        </button>
      </div>
    </div>
  );
}
`;

export default function Editor() {
  const [activeFile, setActiveFile] = useState("App.tsx");
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [isSaveToIPFSOpen, setIsSaveToIPFSOpen] = useState(false);

  const collaborators = [
    { src: "https://github.com/shadcn.png", fallback: "CN" },
    { fallback: "JD", bgColor: "bg-purple-600 text-xs text-white" },
    { fallback: "AK", bgColor: "bg-green-600 text-xs text-white" },
  ];

  const tabs = [
    { name: "App.tsx", isActive: true },
    { name: "index.css", isActive: false },
  ];

  // Prepare files for IPFS upload
  const projectFiles: ProjectFile[] = [
    { path: "src/App.tsx", content: INITIAL_CODE },
    { path: "src/index.css", content: "/* styles here */" },
    { path: "src/main.tsx", content: "// entry point" },
    { path: "package.json", content: JSON.stringify({ name: "my-project" }, null, 2) },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      <AppHeader variant="editor">
        <EditorTopBar 
          projectName="my-awesome-project" 
          activeFile={activeFile}
          collaborators={collaborators}
          onSaveToIPFS={() => setIsSaveToIPFSOpen(true)}
        />
      </AppHeader>

      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <FileSidebar 
              files={FILES} 
              activeFile={activeFile} 
              onFileSelect={setActiveFile}
            />
          </ResizablePanel>
          
          <ResizableHandle />

          <ResizablePanel defaultSize={80}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70}>
                <div className="h-full flex flex-col">
                  <EditorTabs 
                    tabs={tabs} 
                    activeFile={activeFile} 
                    onTabSelect={setActiveFile}
                  />
                  
                  <div className="flex-1 bg-[#0f172a] relative">
                    <CodeEditor initialCode={INITIAL_CODE} language="javascript" />
                    <ChatFloatingButton />
                  </div>
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel 
                defaultSize={30} 
                minSize={10} 
                collapsible={true} 
                collapsedSize={4} 
                onCollapse={() => setIsTerminalOpen(false)} 
                onExpand={() => setIsTerminalOpen(true)}
              >
                <TerminalPanel 
                  isOpen={isTerminalOpen} 
                  onClose={() => setIsTerminalOpen(false)}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      <StatusBar />

      <SaveToIPFSDialog 
        open={isSaveToIPFSOpen}
        onOpenChange={setIsSaveToIPFSOpen}
        projectName="my-awesome-project"
        files={projectFiles}
      />
    </div>
  );
}
