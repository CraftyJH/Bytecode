import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "highlight.js/styles/github-dark.css";
import "./globals.css";
import { BinaryBackground } from "@/components/layout/BinaryBackground";

const inter = Inter({
  variable: "--font-body-loaded",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-display-loaded",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-loaded",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bytecode — Java and Kotlin, mastered.",
  description:
    "The only JVM path you'll need. From your first Hello World to deploying production Spring Boot — one focused path, no shortcuts, no fluff.",
  openGraph: {
    title: "Bytecode — Java and Kotlin, mastered.",
    description:
      "The only JVM path you'll need. From your first Hello World to deploying production Spring Boot.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
      style={
        {
          "--font-body": "var(--font-body-loaded)",
          "--font-display": "var(--font-display-loaded)",
          "--font-mono": "var(--font-mono-loaded)",
        } as React.CSSProperties
      }
    >
      <body className="min-h-screen flex flex-col bg-canvas text-prose antialiased">
        <BinaryBackground />
        {children}
      </body>
    </html>
  );
}
