"use client";

import Editor, { type Monaco } from "@monaco-editor/react";

const BYTECODE_THEME = "bytecode-dark";

function defineTheme(monaco: Monaco) {
  monaco.editor.defineTheme(BYTECODE_THEME, {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword",          foreground: "C77B3A", fontStyle: "bold" },
      { token: "string",           foreground: "A8C77B" },
      { token: "string.escape",    foreground: "A8C77B" },
      { token: "number",           foreground: "C77BA8" },
      { token: "comment",          foreground: "6E6E76", fontStyle: "italic" },
      { token: "type.identifier",  foreground: "7BA8C7" },
      { token: "identifier",       foreground: "FAFAF7" },
      { token: "delimiter",        foreground: "A8A8A8" },
      { token: "operator",         foreground: "A8A8A8" },
      { token: "annotation",       foreground: "C77BA8" },
    ],
    colors: {
      "editor.background":              "#14141A",
      "editor.foreground":              "#FAFAF7",
      "editor.lineHighlightBackground": "#1C1C24",
      "editor.selectionBackground":     "#C77B3A33",
      "editorCursor.foreground":        "#C77B3A",
      "editorLineNumber.foreground":    "#6E6E76",
      "editorLineNumber.activeForeground": "#A8A8A8",
      "editorIndentGuide.background":   "#1C1C24",
      "editorIndentGuide.activeBackground": "#2A2A36",
      "scrollbarSlider.background":     "#FFFFFF1E",
      "scrollbarSlider.hoverBackground":"#FFFFFF30",
      "editorWidget.background":        "#14141A",
      "editorWidget.border":            "#FFFFFF0F",
      "input.background":               "#1C1C24",
      "input.foreground":               "#FAFAF7",
    },
  });
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({ value, onChange, readOnly = false }: CodeEditorProps) {
  return (
    <Editor
      language="java"
      value={value}
      theme={BYTECODE_THEME}
      onChange={(v) => onChange(v ?? "")}
      beforeMount={defineTheme}
      options={{
        fontSize: 13,
        fontFamily: '"JetBrains Mono", "Geist Mono", ui-monospace, monospace',
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: "on",
        renderLineHighlight: "line",
        tabSize: 4,
        wordWrap: "on",
        padding: { top: 12, bottom: 12 },
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
        readOnly,
      }}
    />
  );
}
