"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const Spinner = (
  <div className="flex-1 flex items-center justify-center h-full">
    <Loader2 size={16} className="text-prose-faint animate-spin" />
  </div>
);

const MonacoEditor = dynamic(
  () => import("./CodeEditorMonaco").then((m) => m.CodeEditor),
  { ssr: false, loading: () => Spinner },
);

const CmEditor = dynamic(
  () => import("./CodeEditorCM").then((m) => m.CodeEditor),
  { ssr: false, loading: () => Spinner },
);

const DESKTOP_QUERY = "(min-width: 1024px)";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function CodeEditor(props: CodeEditorProps) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isDesktop === null) return Spinner;
  return isDesktop ? <MonacoEditor {...props} /> : <CmEditor {...props} />;
}
