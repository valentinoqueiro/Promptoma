"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";


type Props = { href?: string };

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

/** Partículas tipo "red de nodos" para el CTA */
function CtaParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;
    if (!ctx) return;

    let raf = 0 as number;
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    let width = 0,
      height = 0,
      prevW = 0,
      prevH = 0;

    type Node = { x: number; y: number; vx: number; vy: number };
    let nodes: Node[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const applySize = (nw: number, nh: number, reflow = true) => {
      prevW = width;
      prevH = height;
      width = Math.max(1, Math.floor(nw));
      height = Math.max(1, Math.floor(nh));

      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      // Reubica nodos proporcionalmente, no los recrea
      if (reflow && nodes.length && prevW > 0 && prevH > 0) {
        const sx = width / prevW;
        const sy = height / prevH;
        if (isFinite(sx) && isFinite(sy)) {
          for (const n of nodes) {
            n.x *= sx;
            n.y *= sy;
          }
        }
      }
    };

    const init = () => {
      const parent = canvas.parentElement as HTMLElement;
      const nw = parent?.clientWidth || 800;
      const nh = parent?.clientHeight || 300;
      applySize(nw, nh, false);

      // Densidad fija basada en área inicial; luego se conservan
      const area = width * height;
      const base = Math.floor(area / 20000);
      const count = Math.max(40, Math.min(110, base));
      nodes = Array.from({ length: count }, () => ({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-0.18, 0.18),
        vy: rand(-0.18, 0.18),
      }));
    };

    function step() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const MAX_D = Math.min(240, Math.max(140, Math.hypot(width, height) / 9));

      // pasada suave ancha
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = "rgba(160,180,255,0.05)";
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < MAX_D) {
            const alpha = 1 - d / MAX_D;
            ctx.globalAlpha = 0.6 * alpha;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // pasada fina brillante
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = "rgba(220,235,255,0.11)";
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < MAX_D) {
            const alpha = 1 - d / MAX_D;
            ctx.globalAlpha = 0.9 * alpha;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // nodos con halo + movimiento
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -12) n.x = width + 12;
        else if (n.x > width + 12) n.x = -12;
        if (n.y < -12) n.y = height + 12;
        else if (n.y > height + 12) n.y = -12;

        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    }

    init();
    raf = requestAnimationFrame(step);

    // Observa tamaño real del contenedor; ignora micro-resizes por barra del navegador móvil
    const parent = canvas.parentElement as HTMLElement;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      const nw = Math.round(rect.width);
      const nh = Math.round(rect.height);
      const dw = Math.abs(nw - width);
      const dh = Math.abs(nh - height);
      if (dw < 1 && dh < 24) return; // evita saltos por UI chrome móvil
      applySize(nw, nh, true);
    });
    if (parent) ro.observe(parent);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 opacity-[0.8]"
      aria-hidden
    />
  );
}

export default function CTA({ href = "#contacto" }: Props) {
  return (
    <motion.section
      id="cta"
      className="relative overflow-hidden bg-[#0b0f14] text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      {/* Glow + grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(560px 360px at 50% 50%, rgba(114,56,227,0.55) 0%, rgba(114,56,227,0.22) 50%, transparent 70%)",
        }}
      />
      <svg aria-hidden className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-[0.06]">
        <defs>
          <pattern id="grid-cta" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-cta)" />
      </svg>
      <CtaParticles />

      <motion.div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32 z-20" variants={container}>
        <div className="relative rounded-[28px] p-[1px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,.22),rgba(255,255,255,.04),rgba(255,255,255,.22))]">
          <div className="relative overflow-hidden rounded-[27px] bg-black/70 backdrop-blur-xl ring-1 ring-white/15 px-6 py-16 md:px-12 text-center shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
            {/* borde iluminado mejorado */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[27px] opacity-[.14]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.45), rgba(255,255,255,.12), rgba(255,255,255,.04), rgba(255,255,255,.12), rgba(255,255,255,.45))",
              }}
            />
            {/* Viñeta interior para profundidad */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[27px]"
              style={{ boxShadow: "inset 0 0 140px rgba(0,0,0,.48), inset 0 0 60px rgba(0,0,0,.30)" }}
            />
            <motion.h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl" variants={fadeUp}>
              Tu negocio no puede seguir haciendo tareas manuales.
            </motion.h2>
            <motion.p className="mt-4 text-base text-gray-300" variants={fadeUp}>
              Demos el primer paso ahora.
            </motion.p>
            <motion.div className="mt-10" variants={fadeUp}>
              <a
                href={href}
                className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-base font-semibold ring-1 ring-white/10 transition hover:bg-violet-500"
              >
                Agendar reunión
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
