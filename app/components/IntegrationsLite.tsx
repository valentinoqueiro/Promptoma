// app/components/IntegrationsPanel.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Integration = { name: string; logo: string; href?: string };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const ICONS_A: Integration[] = [
  { name: "Notion", logo: "/imagenes/notion.svg" },
  { name: "Instagram", logo: "/imagenes/instagram-2016-5.svg" },
  { name: "Excel", logo: "/imagenes/excel-4.svg" },
  { name: "ChatGPT", logo: "/imagenes/chatgpt.svg" },
  { name: "Gmail", logo: "/imagenes/official-gmail-icon-2020-.svg" },
  { name: "Google Drive", logo: "/imagenes/new-logo-drive-google.svg" },
  { name: "Google Calendar", logo: "/imagenes/google-calendar-icon-2020-.svg" },
  { name: "WhatsApp", logo: "/imagenes/whatsapp-8.svg" },
];

const ICONS_B: Integration[] = [
  { name: "Slack", logo: "/imagenes/DeviconSlack.svg" },
  { name: "Discord", logo: "/imagenes/LogosDiscordIcon.svg" },
  { name: "Airtable", logo: "/imagenes/LogosAirtable.svg" },
  { name: "Asana", logo: "/imagenes/LogosAsanaIcon.svg" },
  { name: "Facebook", logo: "/imagenes/LogosFacebook.svg" },
  { name: "Dropbox", logo: "/imagenes/LogosDropbox.svg" },
  { name: "Outlook", logo: "/imagenes/ZmdiOutlook.svg" },
  { name: "Telegram", logo: "/imagenes/LogosTelegram.svg" },
];

const INTERVAL_MS = 5000; // ciclo
const ANIM_MS = 600;      // duración roll
const STAGGER_MS = 120;   // escalado

function RollingIcon({
  top,
  bottom,
  delay,
  rolling,
  step,
}: {
  top: Integration;
  bottom: Integration;
  delay: number;
  rolling: boolean;
  step: 0 | 1 | 2;
}) {
  return (
    <motion.div variants={fadeUp} className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/8 ring-1 ring-white/10">
      {/* Pista absoluta: 3 alturas de celda */}
      <div
        className="absolute left-0 top-0 h-[300%] w-full"
        style={{
          transform: step === 1 ? "translateY(-33.3333%)" : "translateY(0)",
          transition: rolling ? `transform ${ANIM_MS}ms cubic-bezier(.22,1,.36,1) ${delay}ms` : "none",
          willChange: "transform",
        }}
      >
        {/* slot superior = 1/3 */}
        <div className="grid h-1/3 w-full place-items-center">
          <img
            src={top.logo}
            alt={top.name}
            className="h-7 w-7 object-contain"
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
          />
        </div>
        {/* slot intermedio = 1/3 */}
        <div className="grid h-1/3 w-full place-items-center">
          <img
            src={bottom.logo}
            alt={bottom.name}
            className="h-7 w-7 object-contain"
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
          />
        </div>
        {/* slot inferior = 1/3 (duplicado del top para wrap perfecto) */}
        <div className="grid h-1/3 w-full place-items-center">
          <img
            src={top.logo}
            alt={top.name}
            className="h-7 w-7 object-contain"
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
          />
        </div>
      </div>
    </motion.div>
  );
}


export default function IntegrationsPanel({
  iconsA = ICONS_A,
  iconsB = ICONS_B,
  moreCount = 500,
}: {
  iconsA?: Integration[];
  iconsB?: Integration[];
  moreCount?: number;
}) {
  const n = Math.min(iconsA.length, iconsB.length); // pares 1:1
  const [phase, setPhase] = useState<0 | 1>(0);     // 0=mostrar A, 1=mostrar B
  const [rolling, setRolling] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2>(0);   // 0=idle, 1=sube, 2=baja

  useEffect(() => {
    const id = setInterval(() => {
      // Leg 1: subir a icono 2
      setStep(1);
      setRolling(true);
      const total = ANIM_MS + STAGGER_MS * (n - 1);

      setTimeout(() => {
        // Leg 2: bajar a icono 1
        setStep(2);

        setTimeout(() => {
          // Reset sin animación; mantenemos el mismo par (no alternar)
          setRolling(false);
          setTimeout(() => {
            setStep(0);
          }, 16);
        }, total);
      }, total);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [n]);

  return (
    <motion.section
      id="integraciones"
      className="relative overflow-hidden bg-gradient-to-b from-[#0b0f14] to-[#111827] text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div className="relative mx-auto max-w-7xl px-6 py-24" variants={container}>
        {/* Título fuera del contenedor */}
        <motion.header className="max-w-3xl" variants={fadeUp}>
          <p className="text-sm text-gray-400">Integraciones</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Conecta la IA con tus datos y procesos
          </h2>
          <p className="mt-3 text-gray-300">
            Compatibilidad con <span className="font-semibold text-[#bfa3ff]">{moreCount}+</span> herramientas.
          </p>
        </motion.header>

        {/* Contenedor con puntos al estilo n8n */}
        <motion.div className="mt-10 relative rounded-3xl p-[1px] bg-gradient-to-br from-white/15 via-white/5 to-transparent" variants={fadeUp}>
          <div className="relative rounded-3xl bg-[#0e1218]/80 px-6 py-10 ring-1 ring-white/10 backdrop-blur-sm">
            <svg aria-hidden className="absolute inset-0 h-full w-full opacity-[0.08]">
              <defs>
                <pattern id="dots-int" width="22" height="22" patternUnits="userSpaceOnUse">
                  <circle cx="1.4" cy="1.4" r="1.4" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots-int)" />
            </svg>

            {/* Logos animados: 8 celdas, cada una alterna A[i] ↔ B[i] */}
            <motion.div className="relative flex flex-wrap justify-center gap-3" variants={container}>
              {Array.from({ length: n }).map((_, i) => {
                const top = phase === 0 ? iconsA[i] : iconsB[i];
                const bottom = phase === 0 ? iconsB[i] : iconsA[i];
                return (
                  <RollingIcon
                    key={i}
                    top={top}
                    bottom={bottom}
                    delay={i * STAGGER_MS}
                    rolling={rolling}
                    step={step}
                  />
                );
              })}
            </motion.div>

            {/* Bullets */}
            <motion.div className="relative mt-10 grid gap-4 sm:grid-cols-3" variants={fadeUp}>
              <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <h3 className="text-base font-semibold">Fuentes y destinos</h3>
                <p className="mt-2 text-sm text-gray-300">CRM, hojas, bases, mensajería y archivos.</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <h3 className="text-base font-semibold">Disparadores y acciones</h3>
                <p className="mt-2 text-sm text-gray-300">Webhooks, eventos y programaciones.</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <h3 className="text-base font-semibold">IA en el flujo</h3>
                <p className="mt-2 text-sm text-gray-300">Clasificar, resumir, redactar y decidir.</p>
              </div>
            </motion.div>

            <motion.div className="relative mt-8 flex justify-center" variants={fadeUp}>
              <a href="#contacto" className="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold ring-1 ring-white/20 transition hover:bg-white/15">
                Consultar integraciones
              </a>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
