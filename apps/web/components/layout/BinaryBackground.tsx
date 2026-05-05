"use client";

import { useEffect, useRef } from "react";

const BYTE_PATTERNS = [
  "01001010", "10110011", "00110101", "11001000",
  "01110100", "10001011", "11010010", "00101101",
  "01000001", "01100101", "10110100", "00011011",
  "11111000", "00000001", "01010101", "10101010",
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  char: string;
  size: number;
  opacity: number;
  speed: number;
  accent: boolean;
}

interface ByteGroup {
  x: number;
  y: number;
  bits: string;
  opacity: number;
  cellSize: number;
  speed: number;
  style: "text" | "boxes";
}

export function BinaryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0;
    let H = 0;
    const particles: Particle[] = [];
    const byteGroups: ByteGroup[] = [];

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = W;
      canvas!.height = H;
    }

    function init() {
      particles.length = 0;
      byteGroups.length = 0;

      const base = Math.floor((W * H) / 18000);

      // Three depth layers — far more differentiated in size, speed, and drift
      for (let layer = 0; layer < 3; layer++) {
        const count = layer === 0 ? base * 2 : layer === 1 ? base : Math.floor(base * 0.5);
        for (let i = 0; i < count; i++) {
          // Size range: far (tiny) → near (large) for parallax depth illusion
          const size =
            layer === 0 ? 6  + Math.random() * 3 :   // Far:  6–9 px
            layer === 1 ? 12 + Math.random() * 6 :   // Mid: 12–18 px
                          20 + Math.random() * 10;   // Near: 20–30 px

          const opacity =
            layer === 0 ? 0.018 + Math.random() * 0.024 :  // Far: very faint
            layer === 1 ? 0.034 + Math.random() * 0.030 :  // Mid: medium
                          0.058 + Math.random() * 0.042;   // Near: visible

          const speed =
            layer === 0 ? 0.05 + Math.random() * 0.08 :   // Far:  slow
            layer === 1 ? 0.14 + Math.random() * 0.14 :   // Mid:  medium
                          0.32 + Math.random() * 0.24;    // Near: fast

          // Horizontal drift increases with nearness
          const vx =
            layer === 0 ? 0 :
            layer === 1 ? (Math.random() - 0.5) * 0.05 :
                          (Math.random() - 0.5) * 0.14;

          particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            vx,
            char: Math.random() > 0.5 ? "0" : "1",
            size,
            opacity,
            speed,
            accent: Math.random() > 0.80,
          });
        }
      }

      const byteCount = Math.max(5, Math.floor(base / 4));
      for (let i = 0; i < byteCount; i++) {
        const style: "text" | "boxes" = Math.random() > 0.5 ? "boxes" : "text";
        const cellSize = style === "boxes" ? 10 + Math.random() * 6 : 9 + Math.random() * 4;
        byteGroups.push({
          x: Math.random() * (W - cellSize * 10),
          y: Math.random() * H,
          bits: BYTE_PATTERNS[Math.floor(Math.random() * BYTE_PATTERNS.length)],
          opacity: 0.022 + Math.random() * 0.028,
          cellSize,
          speed: 0.04 + Math.random() * 0.07,
          style,
        });
      }
    }

    function drawBoxedByte(b: ByteGroup) {
      const { x, y, bits, opacity, cellSize } = b;
      ctx!.globalAlpha = opacity;
      ctx!.strokeStyle = "#FAFAF7";
      ctx!.fillStyle = "#FAFAF7";
      ctx!.lineWidth = 0.4;
      ctx!.font = `${Math.round(cellSize * 0.58)}px "JetBrains Mono", monospace`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      for (let i = 0; i < 8; i++) {
        const cx = x + i * cellSize;
        ctx!.strokeRect(cx, y, cellSize, cellSize);
        ctx!.fillText(bits[i], cx + cellSize / 2, y + cellSize / 2);
      }
    }

    function drawTextByte(b: ByteGroup) {
      const { x, y, bits, opacity, cellSize } = b;
      ctx!.globalAlpha = opacity * 0.9;
      ctx!.fillStyle = "#FAFAF7";
      ctx!.font = `${Math.round(cellSize)}px "JetBrains Mono", monospace`;
      ctx!.textAlign = "left";
      ctx!.textBaseline = "top";
      const spaced = bits.slice(0, 4) + " " + bits.slice(4);
      ctx!.fillText(spaced, x, y);
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      ctx!.textAlign = "left";
      ctx!.textBaseline = "top";

      for (const p of particles) {
        ctx!.font = `${p.size}px "JetBrains Mono", monospace`;
        ctx!.fillStyle = p.accent ? "#C77B3A" : "#FAFAF7";
        ctx!.globalAlpha = p.opacity;
        ctx!.fillText(p.char, p.x, p.y);

        p.y -= p.speed;
        p.x += p.vx;

        // Reset when particle floats off top
        if (p.y < -p.size * 2) {
          p.y = H + p.size;
          p.x = Math.random() * W;
          if (Math.random() > 0.7) p.char = p.char === "0" ? "1" : "0";
        }
        // Horizontal wrap
        if (p.x < -p.size * 2) p.x = W + p.size;
        if (p.x > W + p.size * 2) p.x = -p.size;
      }

      for (const b of byteGroups) {
        if (b.style === "boxes") drawBoxedByte(b);
        else drawTextByte(b);
        b.y -= b.speed;
        if (b.y < -b.cellSize * 2) {
          b.y = H + b.cellSize * 2;
          b.x = Math.random() * (W - b.cellSize * 10);
          b.bits = BYTE_PATTERNS[Math.floor(Math.random() * BYTE_PATTERNS.length)];
        }
      }

      ctx!.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    const handleResize = () => { resize(); init(); };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
}
