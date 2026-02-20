"use client";
import { useEffect, useRef, useState } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";

type Tag = "ai" | "auto" | "data";
type UseCase = { title: string; desc: string; tag: Tag; href?: string };

const DEFAULT_ITEMS: UseCase[] = [
  // IA (4)
  { title: "Chatbots inteligentes", desc: "Asistentes en WhatsApp, Instagram o web que entienden intención, tono y contexto. Responden, califican y derivan conversaciones automáticamente.", tag: "ai" },
  { title: "Clasificación automática de mensajes", desc: "IA que analiza urgencia, idioma o tipo de consulta y los dirige al área correcta. Reduce tiempos de respuesta y mejora la atención.", tag: "ai" },
  { title: "Análisis y resúmenes de reuniones", desc: "Genera resúmenes automáticos de reuniones en Zoom, Meet o Teams. Extrae decisiones, tareas y temas clave para tu equipo.", tag: "ai" },
  { title: "Detección de oportunidades con IA", desc: "Analiza conversaciones, correos y formularios para identificar clientes potenciales. Prioriza leads con mayor probabilidad de conversión.", tag: "ai" },

  // Automatización (4)
  { title: "Conexión con CRM", desc: "Sincronizá automáticamente datos de clientes, ventas y formularios con tu CRM. Eliminá carga manual y mantené la información siempre actualizada.", tag: "auto" },
  { title: "Automatización de ventas", desc: "Desde el primer contacto hasta el cierre: seguimiento, recordatorios y tareas automáticas. Aumentá la conversión y reducí el tiempo de gestión comercial.", tag: "auto" },
  { title: "Automatización de reportes", desc: "KPIs diarios o semanales en Sheets o bases de datos. Obtén métricas actualizadas sin intervención manual.", tag: "auto" },
  { title: "Sincronización entre plataformas", desc: "Conectá CRM, planillas, correos y herramientas de marketing para mantener todo alineado. Datos actualizados en tiempo real, sin duplicaciones.", tag: "auto" },

  // Datos (4)
  { title: "Información centralizada", desc: "Toda la información de tu empresa disponible en un solo lugar. Los equipos acceden a datos actualizados sin depender de otros auentando la eficiencia en el flujo de trabajo.", tag: "data" },
  { title: "Dashboards en tiempo real", desc: "Indicadores, ventas y rendimiento siempre visibles. Decisiones rápidas con datos automáticos y confiables.", tag: "data" },
  { title: "Integración de fuentes de datos", desc: "Unificá CRM, hojas de cálculo, formularios y sistemas externos. Todo sincronizado y limpio para análisis precisos.", tag: "data" },
  { title: "Reportes automáticos y compartidos", desc: "KPIs y métricas enviados a cada área según su necesidad. Sin planillas manuales ni pérdida de tiempo.", tag: "data" },
];

const TAGS: { key: Tag; label: string }[] = [
  { key: "ai", label: "IA" },
  { key: "auto", label: "Automatización" },
  { key: "data", label: "Datos" },
];

const ORDER: Tag[] = ["ai", "auto", "data"];
const DURATION_MS = 5000;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

export default function UseCases({ items = DEFAULT_ITEMS }: { items?: UseCase[] }) {
  const [active, setActive] = useState<Tag>("ai");
  const timerRef = useRef<number | null>(null);
  const isInteracting = useRef(false); // Para pausar el timer si el usuario toca

  useEffect(() => {
    // Función para avanzar
    const nextSlide = () => {
      if (isInteracting.current) return; // Si el usuario está tocando, no cambiamos
      setActive((prev) => {
        const idx = ORDER.indexOf(prev);
        return ORDER[(idx + 1) % ORDER.length];
      });
    };

    // Iniciar intervalo
    timerRef.current = window.setInterval(nextSlide, DURATION_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const changeTo = (next: Tag) => {
    isInteracting.current = true; // El usuario tomó el control
    setActive(next);
    // Reiniciar el auto-play después de un rato si quisieras, o dejarlo pausado.
    // Aquí reseteamos el intervalo para que espere 5 segundos desde el click
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      isInteracting.current = false;
      setActive((prev) => {
        const idx = ORDER.indexOf(prev);
        return ORDER[(idx + 1) % ORDER.length];
      });
    }, DURATION_MS);
  };

  return (
    <motion.section
      id="casos-uso"
      className="relative overflow-hidden bg-[#0d1219] text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(1200px 600px at 10% 90%, rgba(114,56,227,0.12), transparent 60%)",
        }}
      />

      <motion.div className="relative mx-auto max-w-7xl px-6 pt-24 pb-8" variants={container}>
        <motion.header className="max-w-3xl" variants={fadeUp}>
          <p className="text-sm text-gray-400">Casos de uso</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Así aplicamos <span className="text-[#7238E3]">IA</span>,{" "}
            <span className="text-[#7238E3]">automatización</span> y{" "}
            <span className="text-[#7238E3]">datos</span> en tu negocio
          </h2>
          <p className="mt-4 text-gray-300">
            Algunos ejemplos de flujos reales y modelos de IA para ahorrar tiempo y reducir errores.
          </p>
        </motion.header>

        {/* Filtros Desktop */}
        <motion.div className="mt-8 hidden flex-wrap gap-2 md:flex" variants={fadeUp}>
          {TAGS.map((t) => (
            <button
              key={t.key}
              onClick={() => changeTo(t.key)}
              className={`relative overflow-hidden rounded-full px-4 py-2 text-sm font-medium ring-1 transition
                ${active === t.key ? "text-white ring-[#7238E3]/40" : "text-gray-300 ring-white/10 hover:bg-white/10"}`}
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <AnimatePresence initial={false} mode="wait">
                {active === t.key && (
                  <motion.span
                    key={`glow-${t.key}`}
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.22 }}
                  >
                    <span className="absolute -inset-3 rounded-full bg-[#7238E3] opacity-35 blur-2xl" />
                    <span className="absolute inset-0 rounded-full bg-gradient-to-b from-[#bfa3ff]/25 to-transparent" />
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {/* Tarjeta destacada (Fija) */}
          <motion.div className="md:col-span-1" variants={fadeUp}>
            <div className="relative h-full rounded-3xl p-[1px] bg-gradient-to-br from-[#6c2bd9]/60 via-[#7238E3]/30 to-transparent">
              <div className="h-full rounded-3xl bg-black/30 px-6 py-8 ring-1 ring-white/10 backdrop-blur-sm">
                <h3 className="text-xl font-semibold">Equipos más enfocados, operaciones más ágiles</h3>
                <p className="mt-3 text-sm text-gray-300">
                  Delegá las tareas repetitivas a la IA y concentrá tu tiempo en lo importante.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-gray-300">
                  <li>• Coordinación entre áreas</li>
                  <li>• Ejecución automática de tareas rutinarias</li>
                  <li>• Información actualizada en cada paso</li>
                </ul>
                <a
                  href="#cta"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold ring-1 ring-white/20 transition hover:bg-white/15"
                >
                  Explorar implementación →
                </a>
              </div>
            </div>
          </motion.div>

          {/* Filtros Móvil */}
          <motion.div className="mt-4 md:hidden" variants={fadeUp}>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <button
                  key={`m-${t.key}`}
                  onClick={() => changeTo(t.key)}
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-sm font-medium ring-1 transition
                    ${active === t.key ? "text-white ring-[#7238E3]/40" : "text-gray-300 ring-white/10 hover:bg-white/10"}`}
                  style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                >
                  <AnimatePresence initial={false} mode="wait">
                    {active === t.key && (
                      <motion.span
                        key={`glow-m-${t.key}`}
                        className="pointer-events-none absolute inset-0 rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span className="absolute -inset-3 rounded-full bg-[#7238E3] opacity-35 blur-2xl" />
                        <span className="absolute inset-0 rounded-full bg-gradient-to-b from-[#bfa3ff]/25 to-transparent" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="relative z-10">{t.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* SECCIÓN DE TARJETAS (SOLUCIÓN DEL SALTO) */}
          <motion.div className="md:col-span-2 relative" variants={fadeUp}>

            {/* TRUCO: Creamos un grid de 1 columna y 1 fila.
               Todos los grupos de tarjetas se colocan en la misma celda (row-start-1 col-start-1).
               El contenedor tomará la altura del grupo MÁS ALTO automáticamente y no variará.
            */}
            <div className="grid grid-cols-1">
              {TAGS.map((tag) => {
                const isActive = active === tag.key;
                const categoryItems = items.filter(i => i.tag === tag.key);

                return (
                  <div
                    key={tag.key}
                    // 'col-start-1 row-start-1' apila todo en el mismo sitio
                    className={`col-start-1 row-start-1 grid gap-6 sm:grid-cols-2 transition-all duration-500 ease-in-out
                      ${isActive
                        ? "opacity-100 translate-y-0 z-10" // Visible
                        : "opacity-0 translate-y-4 z-0 pointer-events-none" // Invisible pero ocupa espacio si fuera el más alto
                      }
                    `}
                  >
                    {categoryItems.map((c, i) => (
                      <article
                        key={`${tag.key}-${i}`}
                        className="group rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/10"
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7238E3]/20 ring-1 ring-[#7238E3]/30">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#7238E3]" fill="currentColor">
                              <path d="M12 2a3 3 0 013 3v2h2a3 3 0 013 3v2h-2v2h2v2a3 3 0 01-3 3h-2v2a3 3 0 01-3 3h0a3 3 0 01-3-3v-2H7a3 3 0 01-3-3v-2h2v-2H4V10a3 3 0 013-3h2V5a3 3 0 013-3z" />
                            </svg>
                          </span>
                          <div>
                            <h3 className="text-base font-semibold">{c.title}</h3>
                            <p className="mt-1 text-sm text-gray-300">{c.desc}</p>
                            <div className="mt-3">
                              <span className="inline-flex rounded-full bg-white/5 px-2.5 py-1 text-xs text-gray-300 ring-1 ring-white/10">
                                {tag.label}
                              </span>
                              {c.href && (
                                <a href={c.href} className="ml-3 inline-flex text-xs font-medium text-[#bfa3ff] hover:underline">
                                  Ver ejemplo
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}