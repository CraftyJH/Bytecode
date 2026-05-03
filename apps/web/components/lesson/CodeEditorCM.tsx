"use client";

import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { java } from "@codemirror/lang-java";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const bytecodeTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#14141A",
      color: "#FAFAF7",
      height: "100%",
      fontSize: "13px",
      fontFamily: '"JetBrains Mono", "Geist Mono", ui-monospace, monospace',
    },
    ".cm-content": { caretColor: "#C77B3A", padding: "12px 0" },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#C77B3A" },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#C77B3A33 !important",
    },
    ".cm-selectionBackground": { backgroundColor: "#C77B3A33" },
    ".cm-activeLine": { backgroundColor: "#1C1C24" },
    ".cm-gutters": {
      backgroundColor: "#14141A",
      borderRight: "none",
      color: "#6E6E76",
    },
    ".cm-activeLineGutter": { backgroundColor: "#1C1C24", color: "#A8A8A8" },
    ".cm-lineNumbers .cm-gutterElement": {
      paddingLeft: "16px",
      paddingRight: "8px",
    },
    ".cm-scroller": {
      fontFamily:
        '"JetBrains Mono", "Geist Mono", ui-monospace, monospace',
    },
    ".cm-tooltip": {
      backgroundColor: "#14141A",
      border: "1px solid rgba(255,255,255,0.06)",
    },
    ".cm-tooltip-autocomplete ul li[aria-selected]": {
      backgroundColor: "#1C1C24",
    },
  },
  { dark: true },
);

const bytecodeHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: "#C77B3A", fontWeight: "bold" },
  { tag: tags.string, color: "#A8C77B" },
  { tag: tags.number, color: "#C77BA8" },
  { tag: tags.bool, color: "#C77BA8" },
  { tag: tags.null, color: "#C77BA8" },
  { tag: tags.comment, color: "#6E6E76", fontStyle: "italic" },
  { tag: tags.lineComment, color: "#6E6E76", fontStyle: "italic" },
  { tag: tags.blockComment, color: "#6E6E76", fontStyle: "italic" },
  { tag: tags.typeName, color: "#7BA8C7" },
  { tag: tags.className, color: "#7BA8C7" },
  { tag: tags.annotation, color: "#C77BA8" },
  { tag: tags.operator, color: "#A8A8A8" },
  { tag: tags.punctuation, color: "#A8A8A8" },
  { tag: tags.bracket, color: "#A8A8A8" },
  { tag: tags.name, color: "#FAFAF7" },
  { tag: tags.definition(tags.name), color: "#FAFAF7" },
  { tag: tags.variableName, color: "#FAFAF7" },
]);

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({ value, onChange, readOnly = false }: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);

  // Keep latest onChange without re-creating the view
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current) return;

    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          java(),
          bytecodeTheme,
          syntaxHighlighting(bytecodeHighlight),
          EditorView.lineWrapping,
          EditorState.readOnly.of(readOnly),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString());
            }
          }),
        ],
      }),
      parent: containerRef.current,
    });

    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes (e.g. reset button)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return <div ref={containerRef} className="h-full overflow-auto" />;
}
