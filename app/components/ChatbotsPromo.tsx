"use client";
import { useEffect, useRef, useState } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* --- Animaciones --- */
const aparecer: Variants = {
    oculto: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
};
const contenedorAnim: Variants = {
    oculto: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

/* --- Mini chat demo animado --- */
const MENSAJES_DEMO = [
    { tipo: "usuario" as const, texto: "Hola, quiero info sobre sus planes" },
    { tipo: "bot" as const, texto: "¡Hola! 👋 Soy tu asistente virtual. Tenemos 3 planes perfectos para tu negocio. ¿Cuántos empleados son?" },
    { tipo: "usuario" as const, texto: "Somos 25 personas" },
    { tipo: "bot" as const, texto: "¡Genial! Te recomiendo el Plan Pro. ¿Te agendo una demo gratuita?" },
    { tipo: "usuario" as const, texto: "Sí, dale" },
    { tipo: "bot" as const, texto: "✅ Listo, te agendé para mañana a las 10:00 AM. ¡Te envié la confirmación por email!" },
];

function MiniChat() {
    const [fase, setFase] = useState(0);
    const [mostrandoEscritura, setMostrandoEscritura] = useState(false);
    const contenedorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (fase >= MENSAJES_DEMO.length) {
            // Reiniciar después de una pausa
            const reinicio = setTimeout(() => {
                setFase(0);
            }, 4000);
            return () => clearTimeout(reinicio);
        }

        const esMensajeBot = MENSAJES_DEMO[fase]?.tipo === "bot";
        const demora = fase === 0 ? 1200 : esMensajeBot ? 2000 : 1500;

        if (esMensajeBot && fase > 0) {
            // Mostrar indicador de escritura antes del mensaje del bot
            const tiempoEscritura = setTimeout(() => {
                setMostrandoEscritura(true);
            }, demora - 1200);

            const tiempoMensaje = setTimeout(() => {
                setMostrandoEscritura(false);
                setFase((p) => p + 1);
            }, demora);

            return () => {
                clearTimeout(tiempoEscritura);
                clearTimeout(tiempoMensaje);
            };
        }

        const timer = setTimeout(() => setFase((p) => p + 1), demora);
        return () => clearTimeout(timer);
    }, [fase]);

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (contenedorRef.current) {
            contenedorRef.current.scrollTop = contenedorRef.current.scrollHeight;
        }
    }, [fase, mostrandoEscritura]);

    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1117]/90 backdrop-blur-md">
            {/* Reflejo superior */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />

            {/* Barra del chat */}
            <div className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-violet-500">
                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>
                <div>
                    <div className="text-sm font-semibold text-white">Asistente IA</div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                        </span>
                        En línea
                    </div>
                </div>
            </div>

            {/* Mensajes */}
            <div ref={contenedorRef} className="flex flex-col gap-2.5 p-4 min-h-[220px] max-h-[280px] overflow-y-auto">
                <AnimatePresence>
                    {MENSAJES_DEMO.slice(0, fase).map((msg, idx) => (
                        <motion.div
                            key={`msg-${idx}`}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className={`flex ${msg.tipo === "usuario" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${msg.tipo === "usuario"
                                    ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-br-md"
                                    : "bg-white/[0.05] text-gray-300 ring-1 ring-white/[0.06] rounded-bl-md"
                                    }`}
                            >
                                {msg.texto}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Indicador de escritura */}
                <AnimatePresence>
                    {mostrandoEscritura && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-start"
                        >
                            <div className="rounded-2xl rounded-bl-md bg-white/[0.05] px-4 py-3 ring-1 ring-white/[0.06]">
                                <div className="flex gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input falso */}
            <div className="border-t border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-4 py-2 ring-1 ring-white/[0.08]">
                    <span className="flex-1 text-sm text-gray-500">Escribe un mensaje...</span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-violet-500">
                        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* --- Contador animado --- */
function ContadorAnimado({ valor, sufijo = "" }: { valor: number; sufijo?: string }) {
    const [cuenta, setCuenta] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const yaAnimo = useRef(false);

    useEffect(() => {
        const observador = new IntersectionObserver(
            ([entrada]) => {
                if (entrada.isIntersecting && !yaAnimo.current) {
                    yaAnimo.current = true;
                    const duracion = 1500;
                    const inicio = performance.now();

                    const animar = (ahora: number) => {
                        const progreso = Math.min((ahora - inicio) / duracion, 1);
                        // Easing para que desacelere al final
                        const eased = 1 - Math.pow(1 - progreso, 3);
                        setCuenta(Math.round(eased * valor));
                        if (progreso < 1) requestAnimationFrame(animar);
                    };
                    requestAnimationFrame(animar);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observador.observe(ref.current);
        return () => observador.disconnect();
    }, [valor]);

    return (
        <span ref={ref}>
            {cuenta}{sufijo}
        </span>
    );
}

/* --- Estadísticas --- */
const ESTADISTICAS = [
    { valor: 95, sufijo: "%", etiqueta: "Satisfacción del cliente" },
    { valor: 24, sufijo: "/7", etiqueta: "Disponibilidad total" },
    { valor: 10, sufijo: "s", etiqueta: "Tiempo de respuesta" },
    { valor: 70, sufijo: "%", etiqueta: "Reducción de costos" },
];

/* --- Beneficios --- */
const BENEFICIOS = [
    {
        icono: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        titulo: "Respuestas instantáneas",
        descripcion: "Atendé a cada cliente al instante, sin esperas ni demoras.",
    },
    {
        icono: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        titulo: "Entrenado con tus datos",
        descripcion: "Habla como tu equipo, con tu estilo y tu base de conocimiento.",
    },
    {
        icono: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        titulo: "Escalá sin contratar",
        descripcion: "Miles de conversaciones simultáneas, sin límites.",
    },
];

/* --- Componente principal --- */
export default function ChatbotsPromo() {
    return (
        <motion.section
            id="chatbots-promo"
            className="relative overflow-hidden bg-gradient-to-b from-[#0b0f14] to-[#0f141b] text-white"
            initial="oculto"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
        >
            {/* Glows decorativos */}
            <div
                aria-hidden
                className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-violet-700/8 blur-[120px]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-violet-900/10 blur-[100px]"
            />

            {/* Patrón de puntos sutil */}
            <svg aria-hidden className="absolute inset-0 h-full w-full opacity-[0.04]">
                <defs>
                    <pattern id="puntos-chatbot" width="28" height="28" patternUnits="userSpaceOnUse">
                        <circle cx="1.2" cy="1.2" r="1.2" fill="white" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#puntos-chatbot)" />
            </svg>

            <motion.div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28" variants={contenedorAnim}>
                {/* Encabezado */}
                <motion.div className="text-center max-w-3xl mx-auto" variants={aparecer}>
                    <span className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300 ring-1 ring-violet-500/20">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Chatbots con IA
                    </span>

                    <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                        Tu próximo empleado{" "}
                        <span className="bg-gradient-to-r from-violet-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">
                            nunca duerme
                        </span>
                    </h2>

                    <p className="mt-5 text-lg text-gray-400 leading-relaxed">
                        Chatbots inteligentes que entienden, responden y venden por vos.
                        Conectados a WhatsApp, Instagram, tu web y más.
                    </p>
                </motion.div>

                {/* Grid principal: Demo + Beneficios */}
                <div className="mt-14 sm:mt-18 grid gap-8 lg:grid-cols-5 items-start">
                    {/* Demo del chat (ocupa más espacio) */}
                    <motion.div className="lg:col-span-3" variants={aparecer}>
                        {/* Sombra volumétrica del chat */}
                        <div className="relative">
                            <div
                                aria-hidden
                                className="pointer-events-none absolute -bottom-8 left-[8%] right-[8%] h-[60%] rounded-[50%] opacity-60"
                                style={{
                                    background: "radial-gradient(ellipse at center, rgba(114,56,227,0.3) 0%, transparent 70%)",
                                    filter: "blur(40px)",
                                }}
                            />
                            <MiniChat />
                        </div>
                    </motion.div>

                    {/* Beneficios (derecha) */}
                    <motion.div className="lg:col-span-2 flex flex-col gap-4" variants={contenedorAnim}>
                        {BENEFICIOS.map((b, i) => (
                            <motion.div
                                key={i}
                                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/20 hover:bg-white/[0.06]"
                                variants={aparecer}
                            >
                                {/* Glow al hacer hover */}
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/0 via-violet-500/0 to-violet-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:from-violet-500/5 group-hover:to-transparent"
                                />
                                <div className="relative flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
                                        {b.icono}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-white">{b.titulo}</h3>
                                        <p className="mt-1 text-sm text-gray-400 leading-relaxed">{b.descripcion}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Estadísticas */}
                <motion.div
                    className="mt-14 sm:mt-18 grid grid-cols-2 gap-4 sm:grid-cols-4"
                    variants={contenedorAnim}
                >
                    {ESTADISTICAS.map((est, i) => (
                        <motion.div
                            key={i}
                            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 text-center backdrop-blur-sm"
                            variants={aparecer}
                        >
                            <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                <ContadorAnimado valor={est.valor} sufijo={est.sufijo} />
                            </div>
                            <p className="mt-2 text-sm text-gray-400">{est.etiqueta}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div className="mt-12 sm:mt-16 flex justify-center" variants={aparecer}>
                    <Link
                        href="/chatbots"
                        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(114,56,227,0.3)]"
                    >
                        {/* Fondo con gradiente animable */}
                        <span
                            aria-hidden
                            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500 transition-all duration-300"
                        />
                        {/* Brillo al hover */}
                        <span
                            aria-hidden
                            className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500"
                        />
                        {/* Reflejo */}
                        <span
                            aria-hidden
                            className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        />

                        <span className="relative flex items-center gap-3">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Conocer nuestros chatbots
                            <svg
                                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    </Link>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
