// app/components/CaseStudiesV2.tsx
"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

type KPI = { label: string; value: string };
type Case = {
  id: string;
  story: string;         // texto izquierda
  avatar: string;        // /imagenes/claudio.jpg
  person: string;        // "Claudio Torres"
  role: string;          // "Dueño del Jockey GYM"
  kpis: KPI[];           // [{label:"Leads",value:"+38%"}, ...]
};

// --- Reveal local (evita dependencias) ---
function Reveal({
  children, delay = 0, y = 12, className = "", as: Tag = "div",
}: { children: ReactNode; delay?: number; y?: number; className?: string; as?: keyof JSX.IntrinsicElements; }) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el || shown) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, [shown]);
  return (
    <Tag
      ref={ref as any}
      className={`transition-all duration-700 ease-out will-change-transform ${shown ? "opacity-100" : "opacity-0"} ${className}`}
      style={{ transform: shown ? "none" : `translateY(${y}px)`, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

// --- Datos demo (cámbialos luego) ---
const CASES: Case[] = [
  {
    id: "gym",
    story:
      "Claudio vino queriendo sumar leads para una campaña del Jockey GYM. Integramos un generador de rutinas personalizadas por formulario, tambien creamos un sistema de gamificación y seguimiento sumado a una Landing VSL. El flujo captó y calificó automáticamente cada contacto. Resultado: más leads y mayor fidelización.",
    avatar: "/imagenes/Foto-claudio.jpg",
    person: "Claudio Torres",
    role: "Dueño del Jockey GYM",
    kpis: [
      { label: "Leads", value: "+38%" },
      { label: "Fidelización", value: "+24%" },
      { label: "Tiempo de respuesta", value: "-61%" },
      { label: "Automatización tickets", value: "82% auto" },
    ],
  },
  {
    id: "real-estate",
    story:
      "Una inmobiliaria buscaba acelerar el seguimiento de consultas. Implementamos clasificación por intención, ruteo a agentes y reportes diarios. Todo auditado con logs y reintentos.",
    avatar: "/imagenes/Mujer-ejemplo.jpg",
    person: "María Gómez",
    role: "CMO de Nova Real Estate",
    kpis: [
      { label: "Reuniones agendadas", value: "+29%" },
      { label: "Errores operativos", value: "-70%" },
      { label: "Leads calificados", value: "+31%" },
      { label: "Ahorro semanal", value: "8 h" },
    ],
  },
];

export default function CaseStudiesV2({ items = CASES }: { items?: Case[] }) {
  return (
    <section
      id="casos-exito"
      className="relative overflow-hidden bg-gradient-to-b from-[#0b0f14] to-[#111827] text-white"
    >
      {/* scanlines suaves */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 8px)",
        }}
      />
      {/* línea vertical detrás */}
      <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/15 to-transparent md:block" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 space-y-20">
        {items.map((c, i) => (
          <div key={c.id} className="grid items-center gap-10 md:grid-cols-2">
            {/* Izquierda: historia */}
            <Reveal>
              <div className="max-w-xl">
                <p className="text-sm text-gray-400">Caso de éxito</p>
                <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                  Qué hicimos y por qué funcionó
                </h3>
                <p className="mt-4 text-gray-300">{c.story}</p>
              </div>
            </Reveal>

            {/* Derecha: tarjeta con avatar y KPIs */}
            <Reveal delay={80} y={18} className="relative">
              {/* conector sobre la línea */}
              <div className="absolute -left-6 top-4 hidden h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-[#0e1218] ring-1 ring-white/15 md:flex">
                <span className="block h-2 w-2 rounded-full bg-[#7238E3]" />
              </div>

              <article className="group relative rounded-[28px] p-[1px] bg-gradient-to-br from-white/15 via-white/5 to-transparent">
                <div className="relative rounded-[28px] bg-[#0e1218]/80 p-6 ring-1 ring-white/10 backdrop-blur">
                  {/* puntos internos */}
                  <svg aria-hidden className="absolute inset-0 h-full w-full opacity-[0.08]">
                    <defs>
                      <pattern id={`dots-${c.id}`} width="22" height="22" patternUnits="userSpaceOnUse">
                        <circle cx="1.4" cy="1.4" r="1.4" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#dots-${c.id})`} />
                  </svg>

                  {/* header con avatar */}
                  <div className="relative flex items-center gap-4">
                    <div className="h-11 w-11 overflow-hidden rounded-full ring-2 ring-white/10">
                      <img
                        src={c.avatar}
                        alt={c.person}
                        className="h-full w-full object-cover"
                        onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{c.person}</div>
                      <div className="text-xs text-gray-400">{c.role}</div>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 ring-1 ring-emerald-400/20">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      En producción
                    </span>
                  </div>

                  {/* KPIs */}
                  <ul className="relative mt-5 space-y-2">
                    {c.kpis.map((k) => (
                      <li
                        key={k.label}
                        className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 transition group-hover:translate-y-[-1px]"
                      >
                        <span className="text-sm">{k.label}</span>
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300 ring-1 ring-emerald-400/20">
                          {k.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}