import Editor, { type OnMount } from "@monaco-editor/react";

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  initialCode = "// Start coding...",
  language = "javascript",
  readOnly = false,
}: CodeEditorProps) {
  const handleEditorDidMount: OnMount = (_editor, monaco) => {
    // Define custom theme to match our cyberpunk aesthetic
    monaco.editor.defineTheme("cyberpunk", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6272a4" },
        { token: "keyword", foreground: "06b6d4" }, // cyan-500
        { token: "identifier", foreground: "f8f8f2" },
        { token: "string", foreground: "f1fa8c" },
        { token: "number", foreground: "bd93f9" }, // purple-500
      ],
      colors: {
        "editor.background": "#0f172a", // slate-950 (approx)
        "editor.foreground": "#f8f8f2",
        "editor.lineHighlightBackground": "#1e293b",
        "editorCursor.foreground": "#06b6d4",
        "editor.selectionBackground": "#06b6d433",
        "editorIndentGuide.background": "#1e293b",
        "editorIndentGuide.activeBackground": "#06b6d4",
      },
    });

    monaco.editor.setTheme("cyberpunk");
  };

  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-border bg-card shadow-sm">
      <Editor
        height="100%"
        defaultLanguage={language}
        defaultValue={initialCode}
        theme="cyberpunk"
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 24,
          padding: { top: 16 },
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          readOnly,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
