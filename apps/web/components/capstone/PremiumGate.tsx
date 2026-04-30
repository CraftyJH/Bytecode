"use client";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  nextPath: string;
}

export function PremiumGate({ nextPath }: Props) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: "rgba(14, 14, 22, 0.88)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="mx-4 w-full max-w-sm rounded-xl border p-7 text-center"
        style={{
          backgroundColor: "var(--color-elevated)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div
          className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--color-subtle)" }}
        >
          <Lock size={18} className="text-prose-muted" />
        </div>

        <h3 className="text-base font-semibold text-prose mb-2 tracking-tight">
          Capstones are Premium
        </h3>
        <p className="text-sm text-prose-muted leading-relaxed mb-6">
          Capstone challenges are how you prove what you learned. Unlock all capstones, full Kotlin tracks, and certificates with Premium.
        </p>

        <div className="space-y-2.5">
          <p className="text-xs text-prose-faint mb-3">
            $9.99/mo · $59/yr · Cancel anytime in 2 clicks.
          </p>
          <Button as="a" href="/pricing" variant="primary" size="sm" className="w-full justify-center">
            Start Premium trial
          </Button>
          <Button as="a" href={nextPath} variant="ghost" size="sm" className="w-full justify-center text-prose-faint">
            Skip for now, continue to Module 2 →
          </Button>
        </div>
      </div>
    </div>
  );
}
