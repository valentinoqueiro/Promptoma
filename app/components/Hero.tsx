"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* -----------------------------
   Animations & helpers
------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fromRight = {
  hidden: { opacity: 0, x: 140 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

/* --- Typewriter para palabras del título --- */
function Typewriter({
  words = ["Inteligente.", "Promptomatica.", "Predictiva.", "Escalable.", "Eficiente."],
  typing = 150,
  deleting = 60,
  pause = 1500,
}: {
  words?: string[];
  typing?: number;
  deleting?: number;
  pause?: number;
}) {
  const [i, setI] = useState(0); // índice de palabra
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  const holderRef = useRef<HTMLSpanElement | null>(null);
  const [maxW, setMaxW] = useState<number | null>(null);

  useEffect(() => {
    const full = words[i];
    if (!del && txt === full) {
      const t = setTimeout(() => setDel(true), pause);
      return () => clearTimeout(t);
    }
    if (del && txt === "") {
      setDel(false);
      setI((i + 1) % words.length);
      return;
    }
    const step = setTimeout(() => {
      const nextLen = txt.length + (del ? -1 : 1);
      setTxt(full.slice(0, Math.max(0, nextLen)));
    }, del ? deleting : typing);
    return () => clearTimeout(step);
  }, [txt, del, i, words, typing, deleting, pause]);

  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    const font = cs.font || `${cs.fontStyle} ${cs.fontVariant} ${cs.fontWeight} ${cs.fontSize} / ${cs.lineHeight} ${cs.fontFamily}`;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.font = font;
    const max = Math.max(...words.map((w) => ctx!.measureText(w).width));
    // +6px para alojar el cursor sin reflow
    setMaxW(Math.ceil(max) + 6);
  }, [words]);

  // resetea texto al cambiar de palabra
  useEffect(() => { setTxt(""); setDel(false); }, [i]);

  return (
    <span
      ref={holderRef}
      className="relative inline-block whitespace-nowrap align-baseline text-[#7238E3]"
      style={maxW ? { width: `${maxW}px` } : undefined}
      aria-live="polite"
      aria-atomic
    >
      {txt}
      <span
        className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-[#7238E3] align-[-0.1em] animate-pulse"
        aria-hidden
      />
    </span>
  );
}

/* --- Tarjeta de estadísticas (única animación que queda) --- */
function ChartCard() {
  const barBase =
    "w-12 rounded-t-md bg-gradient-to-t from-[#7238E3] to-[#ff7ad9]";
  return (
    <motion.div
      className="w-full max-w-[32rem] rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      role="img"
      aria-label="Gráfico de impacto de integraciones"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xs text-white/70">Top feedback en</div>
        <div className="flex gap-2">
          <span className="rounded-md bg-white/10 px-2 py-1 text-xs text-white/90">
            Integraciones
          </span>
          <span className="rounded-md bg-white/10 px-2 py-1 text-xs text-white/70">
            Último trimestre
          </span>
        </div>
      </div>

      <div className="mt-2 grid h-52 grid-cols-4 items-end gap-6">
        {[0.55, 0.95, 0.45, 0.75].map((start, i) => (
          <motion.div
            key={i}
            className="flex h-full w-full items-end justify-center"
            initial={{ height: `${start * 100}%` }}
            animate={{ height: ["48%", "92%", "58%", "84%", "52%"] }}
            transition={{
              duration: 4.4 + i * 0.6,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            <div className={barBase} style={{ height: "100%" }} />
          </motion.div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-4 text-center text-[11px] text-white/60">
        <span>Dashboardsㅤㅤ</span>
        <span>Resúmenes</span>
        <span>ㅤCerrar loop</span>
        <span>ㅤㅤImpacto</span>

      </div>
    </motion.div>
  );
}

/* --- Líneas animadas simples (canvas) --- */
function NetworkLines({ height = 140, count = 12, full = false }: { height?: number; count?: number; full?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, prevW = 0, prevH = 0;
    let raf = 0 as number;
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    type Node = { x: number; y: number; vx: number; vy: number };
    let nodes: Node[] = [];

    const createNodes = (n: number) =>
      Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() * 2 - 1) * 0.35,
        vy: (Math.random() * 2 - 1) * 0.35,
      }));

    const applySize = (nw: number, nh: number, reflow = true) => {
      prevW = w; prevH = h; w = Math.max(1, nw); h = Math.max(1, nh);
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      if (reflow && nodes.length) {
        const sx = w / prevW;
        const sy = h / prevH;
        if (isFinite(sx) && isFinite(sy) && prevW > 0 && prevH > 0) {
          for (const n of nodes) { n.x *= sx; n.y *= sy; }
        }
      }
    };

    // Inicializa tamaño y nodos una sola vez
    const parent = canvas.parentElement as HTMLElement;
    const init = () => {
      const nw = parent?.clientWidth || 800;
      const nh = full ? (parent?.clientHeight || height) : height;
      applySize(nw, nh, false);
      nodes = createNodes(count);
    };

    function step() {
      ctx.clearRect(0, 0, w, h);

      // mover nodos
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      const MAX = Math.min(200, w / 5);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "rgba(255,255,255,0.22)";

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < MAX) {
            ctx.globalAlpha = 1 - d / MAX;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      for (const n of nodes) {
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    }

    init();

    // Observa SOLO cambios reales del contenedor. No re-crear nodos al hacer scroll móvil.
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      const nw = Math.round(rect.width);
      const nh = Math.round(full ? rect.height : height);
      const dw = Math.abs(nw - w);
      const dh = Math.abs(nh - h);
      // Ignora micro cambios de altura típicos del UI chrome móvil
      if (dw < 1 && dh < 24) return;
      applySize(nw, nh, true);
    });
    if (parent) ro.observe(parent);

    raf = requestAnimationFrame(step);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [height, count, full]);

  return (
    <canvas
      ref={canvasRef}
      className={
        full
          ? "pointer-events-none absolute inset-0 z-10 w-full opacity-80 [filter:drop-shadow(0_0_8px_rgba(255,255,255,0.05))]"
          : "mt-6 w-full opacity-80 [filter:drop-shadow(0_0_8px_rgba(255,255,255,0.05))]"
      }
      style={{ height: full ? "100%" : `${height}px` }}
    />
  );
}

/* -----------------------------
   HERO
------------------------------ */
type HeroProps = {
  companyLogoUrl?: string; // reservado por si luego se usa
};

export default function Hero({ companyLogoUrl }: HeroProps) {
  return (
    <motion.section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-b from-[#0b0f14] to-[#111827] text-white"
      initial="hidden"
      animate="visible"
    >
      {/* Glow decorativo (lado derecho) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10rem] h-[36rem] w-[36rem] rounded-full bg-violet-700/25 blur-3xl"
      />

      <motion.div className="mx-auto max-w-7xl px-6 py-28 md:py-40" variants={container}>
        {/* Dos columnas: texto a la izquierda y estadísticas a la derecha */}
        <div className="grid items-start gap-12 md:grid-cols-2">
          {/* Copy */}
          <motion.div className="max-w-3xl" variants={fadeUp}>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              El futuro de tu negocio comienza con la Automatización <Typewriter />
            </h1>

            <motion.p className="mt-6 text-lg text-gray-300 sm:text-xl" variants={fadeUp}>
              Implementamos IA y automatizaciones que ahorran tiempo, reducen
              errores y multiplican resultados.
            </motion.p>

            <motion.div className="mt-10 flex flex-col gap-4 sm:flex-row" variants={fadeUp}>
              <a
                href="#demo"
                className="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-base font-semibold ring-1 ring-white/20 transition hover:bg-white/15"
              >
                Conocer más
              </a>
              <a
                href="#contacto"
                className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-base font-semibold transition hover:bg-violet-500"
              >
                Agendar entrevista
              </a>
            </motion.div>

            <motion.div className="mt-6 text-sm text-gray-400" variants={fadeUp}>
              Sin costo de diagnóstico · Integración con Make y n8n · Soporte continuo
            </motion.div>
          </motion.div>

          {/* Estadísticas + líneas debajo */}
          <motion.div variants={fromRight} className="flex w-full flex-col items-center self-center md:items-center">
            <ChartCard />
          </motion.div>
        </div>
      </motion.div>
      <NetworkLines full height={220} count={28} />

      {/* Grid sutil */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </motion.section>
  );
}
