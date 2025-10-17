"use client";
import { motion, type Variants } from "framer-motion";

import { useEffect, useRef, useState } from "react";

type Benefit = { title: string; desc: string };
type WhyProps = {
  embedUrl: string;
  benefits?: Benefit[];
};

const DEFAULT_BENEFITS: Benefit[] = [
  { title: "Ahorra tiempo", desc: "Automatiza tareas repetitivas y gana horas por semana." },
  { title: "Aumenta productividad", desc: "Estandariza procesos y ejecuta más con el mismo equipo." },
  { title: "Evita errores", desc: "Menos carga manual, menos fallas y datos consistentes." },
  { title: "Libera al equipo", desc: "Deja lo mecánico a los bots y enfoca al equipo en valor." },
  { title: "Mejora la experiencia", desc: "Respuestas rápidas, follow-ups automáticos y mejor servicio." },
  { title: "Escala con IA", desc: "Flujos inteligentes: clasificación, resumen, decisiones y más." },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* --- StarField: fondo con estrellas titilando (sin saltos en mobile) --- */
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
      // reubicar estrellas proporcionalmente sin recrearlas
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
      const density = 0.00028; // estrellas por px^2 aprox
      const count = Math.max(60, Math.min(180, Math.floor(w * h * density)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rand(0.4, 1.6),
        base: rand(0.25, 0.6),
        speed: rand(0.8, 1.6),
        phase: rand(0, Math.PI * 2),
      }));
    };

    function frame(t: number) {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const s of stars) {
        const twinkle = s.base + 0.35 * Math.sin(s.phase + t * 0.0012 * s.speed);
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

    // Observa tamaño real del contenedor; evita recrear estrellas en micro-resizes
    const parent = canvas.parentElement as HTMLElement;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      const nw = Math.round(rect.width);
      const nh = Math.round(rect.height);
      const dw = Math.abs(nw - w);
      const dh = Math.abs(nh - h);
      // Ignora cambios pequeños de altura típicos al mostrar/ocultar la barra del navegador móvil
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

/* --- Card con glow que sigue el mouse --- */
function GlowCard({ children, variants }: { children: React.ReactNode; variants?: any }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number; o: number }>({ x: 0, y: 0, o: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, o: 1 });
  };

  return (
    <motion.article
      ref={ref as any}
      variants={variants}
      onMouseMove={onMove}
      onMouseLeave={() => setPos((p) => ({ ...p, o: 0 }))}
      className="group relative overflow-hidden rounded-2xl bg-black/60 p-5 ring-1 ring-white/12 backdrop-blur-sm transition-colors duration-300 hover:bg-black/70 hover:ring-white/25"
    >
      {/* glow que sigue el cursor */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            pos.o === 0
              ? "transparent"
              : `radial-gradient(220px 220px at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.16), transparent 60%)`,
        }}
      />
      {/* borde reactivo */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ boxShadow: `inset 0 0 0 1px rgba(255,255,255,${pos.o ? 0.22 : 0.12})` }}
      />

      {/* contenido */}
      <div className="relative z-10">{children}</div>
    </motion.article>
  );
}

export default function Why({ embedUrl, benefits = DEFAULT_BENEFITS }: WhyProps) {
  return (
    <motion.section
      id="demo"
      className="relative overflow-hidden bg-[#080c13] text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Degradados adicionales estilo sección anterior */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(560px 360px at 50% 50%, rgba(114,56,227,0.65) 0%, rgba(114,56,227,0.32) 46%, transparent 68%), radial-gradient(900px 520px at 85% 15%, rgba(191,76,65,0.22) 0%, transparent 60%)",
        }}
      />
      {/* Estrellas sutiles */}
      <StarField className="z-[5] opacity-[0.5]" />
      {/* Fondo cuadriculado sutil */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-[0.08]"
      >
        <defs>
          <pattern id="grid2-why" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid2-why)" />
      </svg>

      <motion.div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28" variants={container}>
        {/* Contenedor de la sección */}
        <div className="relative overflow-hidden rounded-[28px] ring-1 ring-white/15 backdrop-blur-xl bg-black/60 px-6 py-12 md:px-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          {/* Capa de glow interior (radial) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "radial-gradient(900px 520px at 50% 35%, rgba(114,56,227,0.42) 0%, rgba(191,76,65,0.28) 30%, rgba(0,0,0,0) 58%)",
            }}
          />
          {/* Trazo suave alrededor (simula borde iluminado) */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-[28px] opacity-[0.12]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,.38), rgba(255,255,255,.16), rgba(255,255,255,.06), rgba(255,255,255,.16), rgba(255,255,255,.38))",
            }}
          />
          {/* Viñeta en bordes para profundidad */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[28px]"
            style={{ boxShadow: "inset 0 0 120px rgba(0,0,0,.45), inset 0 0 48px rgba(0,0,0,.32)" }}
          />

        <motion.header className="max-w-3xl" variants={fadeUp}>
          <p className="text-sm text-gray-400">Por qué elegirnos</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Por qué la automatización y la IA son una necesidad hoy
          </h2>
          <p className="mt-4 text-gray-300">
            Reduce trabajo manual, mejora la experiencia del cliente y escala sin fricción.
          </p>
        </motion.header>

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start">
          {/* Video */}
          <motion.div className="relative" variants={fadeUp}>
            <div className="aspect-video overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl">
              <iframe
                src={embedUrl}
                title="Demostración"
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </motion.div>

          {/* Cards */}
          <motion.div className="grid gap-4 sm:grid-cols-2" variants={container}>
            {benefits.map((b, i) => (
              <GlowCard key={i} variants={fadeUp}>
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor">
                      <path d="M10 17l-4-4 1.4-1.4L10 14.2l6.6-6.6L19 9l-9 8z" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-base font-semibold">{b.title}</h3>
                    <p className="mt-1 text-sm text-gray-300">{b.desc}</p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </motion.div>
        </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
