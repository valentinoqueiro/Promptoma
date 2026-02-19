"use client";
import { motion, type Variants } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { ChartCard } from "./Hero";

type Benefit = { title: string; desc: string; icon: React.ReactNode };
type WhyProps = {
  benefits?: Benefit[];
};

const BENEFIT_ICONS = {
  clock: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  rocket: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
};

const DEFAULT_BENEFITS: Benefit[] = [
  { title: "Ahorra tiempo", desc: "Automatiza lo repetitivo y gana horas.", icon: BENEFIT_ICONS.clock },
  { title: "Sube productividad", desc: "Ejecuta más con el mismo equipo.", icon: BENEFIT_ICONS.rocket },
  { title: "Evita errores", desc: "Menos fallas y datos consistentes.", icon: BENEFIT_ICONS.shield },
  { title: "Libera al equipo", desc: "Deja que los bots hagan lo tedioso.", icon: BENEFIT_ICONS.users },
  { title: "Mejor servicio", desc: "Respuestas 24/7 y seguimiento automático.", icon: BENEFIT_ICONS.sparkles },
  { title: "Escala con IA", desc: "Decisiones y clasificación inteligente.", icon: BENEFIT_ICONS.zap },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function useIsMdUp() {
  const [isMd, setIsMd] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsMd(m.matches);
    onChange();
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);
  return isMd;
}

function StarField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let raf = 0 as number;
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    let w = 0, h = 0, prevW = 0, prevH = 0;

    type Star = { x: number; y: number; r: number; base: number; speed: number; phase: number };
    let stars: Star[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const applySize = (nw: number, nh: number, reflow = true) => {
      prevW = w; prevH = h; w = Math.max(1, nw); h = Math.max(1, nh);
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      if (reflow && stars.length && prevW > 0 && prevH > 0) {
        const sx = w / prevW;
        const sy = h / prevH;
        if (isFinite(sx) && isFinite(sy)) {
          for (const s of stars) { s.x *= sx; s.y *= sy; }
        }
      }
    };

    const init = () => {
      const parent = canvas.parentElement as HTMLElement;
      const nw = parent?.clientWidth || 800;
      const nh = parent?.clientHeight || 400;
      applySize(nw, nh, false);
      const density = 0.0002;
      const count = Math.max(50, Math.min(150, Math.floor(w * h * density)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rand(0.3, 1.5),
        base: rand(0.2, 0.5),
        speed: rand(0.5, 1.5),
        phase: rand(0, Math.PI * 2),
      }));
    };

    function frame(t: number) {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const s of stars) {
        const twinkle = s.base + 0.4 * Math.sin(s.phase + t * 0.001 * s.speed);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, twinkle))})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    }

    init();
    raf = requestAnimationFrame(frame);

    const parent = canvas.parentElement as HTMLElement;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      const nw = Math.round(rect.width);
      const nh = Math.round(rect.height);
      const dw = Math.abs(nw - w);
      const dh = Math.abs(nh - h);
      if (dw < 1 && dh < 24) return;
      applySize(nw, nh, true);
    });
    if (parent) ro.observe(parent);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    />
  );
}

// Tarjeta Minimalista y Compacta
function CompactCard({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-xl 
        bg-white/[0.03] hover:bg-white/[0.06] 
        p-4 transition-all duration-300 
        hover:ring-1 hover:ring-white/20
        ${align === "right" ? "lg:text-right lg:items-end" : "lg:text-left lg:items-start"}
        flex flex-col gap-3 justify-center
      `}
    >
      {/* Simple Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function Why({ benefits = DEFAULT_BENEFITS }: WhyProps) {
  const isMd = useIsMdUp();

  // Dividir beneficios para layout simétrico
  const leftBenefits = benefits.slice(0, 3);
  const rightBenefits = benefits.slice(3, 6);

  return (
    <motion.section
      id="why-section"
      className="relative overflow-hidden bg-[#06090f] text-white py-20 sm:py-24"
      initial={isMd ? "hidden" : "visible"}
      whileInView="visible"
      viewport={isMd ? { once: true, amount: 0.2 } : undefined}
    >
      {/* Background Ambience */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08), transparent 60%)",
        }}
      />

      <StarField className="z-[5] opacity-40" />

      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Compact Header */}
        <motion.div className="max-w-2xl mx-auto text-center mb-16" variants={fadeUp}>
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-violet-400/50"></span>
            <span className="text-xs font-medium text-violet-300 uppercase tracking-widest">
              Impacto Real
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-violet-400/50"></span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Automatización que <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-violet-200">
              transforma tu negocio
            </span>
          </h2>

          <p className="text-base text-gray-400 max-w-xl mx-auto">
            Eficiencia operativa y escalabilidad sin fricción. La nueva ventaja competitiva.
          </p>
        </motion.div>

        {/* Symmetrical Layout */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-4 items-center">

          {/* Left Column */}
          <motion.div className="flex flex-col gap-4 order-2 lg:order-1" variants={staggerContainer}>
            {leftBenefits.map((b, i) => (
              <motion.div key={i} variants={fadeUp}>
                <CompactCard align="right">
                  {/* Para móvil alinea izquierda, desktop derecha */}
                  <div className="flex flex-row lg:flex-row-reverse items-center gap-4 w-full">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-violet-300 group-hover:text-white group-hover:bg-violet-500/20 transition-colors">
                      {b.icon}
                    </div>
                    <div className="flex-1 lg:text-right text-left">
                      <h3 className="text-base font-semibold text-gray-100">{b.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                </CompactCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Center Column (Chart) */}
          <motion.div
            className="relative flex justify-center order-1 lg:order-2 py-8 lg:py-0"
            variants={fadeUp}
          >
            {/* Glow behind chart */}
            <div className="absolute inset-0 bg-violet-500/10 blur-[60px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-[340px] lg:max-w-full">
              <ChartCard />
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div className="flex flex-col gap-4 order-3" variants={staggerContainer}>
            {rightBenefits.map((b, i) => (
              <motion.div key={i} variants={fadeUp}>
                <CompactCard align="left">
                  <div className="flex flex-row items-center gap-4 w-full">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-fuchsia-300 group-hover:text-white group-hover:bg-fuchsia-500/20 transition-colors">
                      {b.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-base font-semibold text-gray-100">{b.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                </CompactCard>
              </motion.div>
            ))}
          </motion.div>

        </div>

      </div>
    </motion.section>
  );
}