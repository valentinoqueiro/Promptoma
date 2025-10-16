"use client";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

type Step = { n: number; title: string; desc: string };
const STEPS: Step[] = [
  {
    n: 1,
    title: "Diagnóstico gratuito",
    desc: "Relevamos procesos, objetivos y oportunidades en una llamada de 30–45 min.",
  },
  {
    n: 2,
    title: "Propuesta de automatización",
    desc: "Convertimos tu necesidad en un plan técnico con alcance y cerramos presupuesto.",
  },
  {
    n: 3,
    title: "Implementación",
    desc: "Configuramos, probamos y optimizamos hasta el despliegue final.",
  },
  {
    n: 4,
    title: "Soporte y seguimiento",
    desc: "Seguimiento activo, ajustes y mantenimiento según tu crecimiento.",
  },
];

export default function HowWeWork() {
  return (
    <motion.section
      id="proceso"
      className="relative overflow-hidden bg-gradient-to-b from-[#0b0f14] to-[#101625] text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      {/* Glow + grid de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(520px 320px at 50% 45%, rgba(114,56,227,0.65) 0%, rgba(114,56,227,0.30) 58%, transparent 100%)",
        }}
      />

      <motion.div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 z-20" variants={container}>
        {/* Contenedor “glass” */}
        <div className="relative rounded-[28px] p-[1px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,.22),rgba(255,255,255,.04),rgba(255,255,255,.22))]">
          <div className="relative overflow-hidden rounded-[27px] bg-black/70 backdrop-blur-xl ring-1 ring-white/15 px-6 py-12 md:px-10 shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
            {/* borde iluminado */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[27px] opacity-[.14]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.45), rgba(255,255,255,.12), rgba(255,255,255,.04), rgba(255,255,255,.12), rgba(255,255,255,.45))",
              }}
            />
            {/* patrón de puntos sutil */}
            <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]">
              <defs>
                <pattern id="hw-dots" width="22" height="22" patternUnits="userSpaceOnUse">
                  <circle cx="1.4" cy="1.4" r="1.4" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hw-dots)" />
            </svg>
            {/* brillo diagonal */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 rotate-[-8deg] opacity-20"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,.08) 50%, transparent 100%)",
              }}
            />

          <motion.header className="text-center" variants={fadeUp}>
            <p className="text-sm text-gray-400">Cómo trabajamos</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              De la idea al resultado, paso a paso
            </h2>
            <p className="mt-4 text-gray-300">
              Procesos claros, entregas rápidas y mejoras continuas.
            </p>
          </motion.header>

          {/* Línea conectora en desktop */}
          <div className="relative mt-12 hidden lg:block">
            <svg className="absolute left-0 right-0 top-12 mx-auto h-2 w-[82%]" viewBox="0 0 100 2">
              <defs>
                <linearGradient id="line" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="white" stopOpacity="0.12" />
                  <stop offset="50%" stopColor="white" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="white" stopOpacity="0.12" />
                </linearGradient>
              </defs>
              <path d="M0 1 H100" stroke="url(#line)" strokeWidth="0.45" strokeLinecap="round" />
            </svg>
          </div>

          {/* Steps */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <motion.article
                key={s.n}
                variants={fadeUp}
                className="group relative rounded-2xl bg-black/70 p-6 ring-1 ring-white/15 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-black/75"
              >
                {/* barra superior de realce */}
                <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-80" />
                {/* Número */}
                <div className="mb-4 inline-flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/12 ring-1 ring-white/25 text-white text-sm font-semibold">
                    {s.n}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-white/60">Paso {s.n}</span>
                </div>

                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-300">{s.desc}</p>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ boxShadow: "inset 0 0 80px rgba(255,255,255,0.06)" }}
                />
              </motion.article>
            ))}
          </div>

          {/* CTA opcional */}
          <motion.div className="mt-10 flex justify-center" variants={fadeUp}>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold ring-1 ring-white/20 transition hover:bg-white/15"
            >
              Agendar diagnóstico gratuito
            </a>
          </motion.div>
        </div></div>
      </motion.div>
    </motion.section>
  );
}
