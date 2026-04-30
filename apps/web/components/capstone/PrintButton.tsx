"use client";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

export function PrintButton() {
  return (
    <Button variant="primary" size="sm" className="gap-1.5" onClick={() => window.print()}>
      <Download size={14} /> Save / Print
    </Button>
  );
}
