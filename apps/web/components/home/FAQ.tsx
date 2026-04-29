"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

const items: FAQItem[] = [
  {
    q: "Why Java AND Kotlin?",
    a: "Because they're sister languages. Kotlin compiles to the same bytecode Java does, runs on the same JVM, and 95% of what you learn about Java applies directly to Kotlin. Mastering both takes barely longer than mastering one — and makes you twice as hireable.",
  },
  {
    q: "I only care about Android. Should I learn Java first?",
    a: "You can skip ahead with our placement quiz and start in the Kotlin Bridge track if you have any prior coding experience. Total beginners: yes, learn Java basics first. The fundamentals translate directly.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. Every lesson runs Java in your browser via a secure sandbox. When you graduate to projects, we walk you through installing the JDK locally.",
  },
  {
    q: "How long does it take to finish?",
    a: "About 60–80 hours of focused study to complete Beginner + Intermediate. Another 40–60 hours for Advanced + projects. Most learners take 3–6 months at 30 minutes a day.",
  },
  {
    q: "Will this prepare me for a Java job?",
    a: "The Advanced track + projects are built around the questions and skills that show up in junior Java interviews — Spring Boot, testing, concurrency, design patterns, system design fundamentals.",
  },
  {
    q: "What's a 'capstone challenge'?",
    a: "At the end of each module and track, there's a coding challenge that tests everything you just learned. Free users see the challenge brief; Premium users can submit and earn the certificate.",
  },
  {
    q: "Can I get a refund?",
    a: "Annual subscriptions: 14-day no-questions refund. Monthly: cancel anytime, no refund needed.",
  },
];

function FAQRow({ q, a }: FAQItem) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-prose">{q}</span>
        <ChevronDown
          className={`shrink-0 text-prose-faint transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          size={16}
          aria-hidden="true"
        />
      </button>
      {open && (
        <p className="pb-5 text-sm text-prose-muted leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export function FAQ() {
  return (
    <section
      className="border-y py-20 lg:py-28"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">
          <SectionHeader
            label="frequently asked"
            heading="Questions we get a lot."
          />
          <div>
            {items.map((item) => (
              <FAQRow key={item.q} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
