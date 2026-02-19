"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingCalendar from "../components/FloatingCalendar";

/* --- Animaciones --- */
const aparecerArriba: Variants = {
    oculto: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const contenedor: Variants = {
    oculto: {},
    visible: { transition: { staggerChildren: 0.14 } },
};

/* --- Líneas de red animadas (canvas) --- */
function LineasRed({ altura = 140, cantidad = 14 }: { altura?: number; cantidad?: number }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = 0, h = 0;
        let raf = 0 as number;
        const DPR = Math.min(2, window.devicePixelRatio || 1);

        type Nodo = { x: number; y: number; vx: number; vy: number };
        let nodos: Nodo[] = [];

        const crearNodos = (n: number) =>
            Array.from({ length: n }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() * 2 - 1) * 0.3,
                vy: (Math.random() * 2 - 1) * 0.3,
            }));

        const aplicarTamanio = (nw: number, nh: number) => {
            w = Math.max(1, nw);
            h = Math.max(1, nh);
            canvas.width = Math.floor(w * DPR);
            canvas.height = Math.floor(h * DPR);
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        };

        const padre = canvas.parentElement as HTMLElement;
        const nw = padre?.clientWidth || 800;
        const nh = padre?.clientHeight || altura;
        aplicarTamanio(nw, nh);
        nodos = crearNodos(cantidad);

        function paso() {
            if (!ctx) return;
            ctx.clearRect(0, 0, w, h);
            for (const n of nodos) {
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > w) n.vx *= -1;
                if (n.y < 0 || n.y > h) n.vy *= -1;
            }
            const MAX = Math.min(200, w / 5);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(255,255,255,0.18)";
            for (let i = 0; i < nodos.length; i++) {
                for (let j = i + 1; j < nodos.length; j++) {
                    const a = nodos[i], b = nodos[j];
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
            for (const n of nodos) {
                ctx.fillStyle = "rgba(255,255,255,0.35)";
                ctx.beginPath();
                ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
                ctx.fill();
            }
            raf = requestAnimationFrame(paso);
        }

        raf = requestAnimationFrame(paso);
        const ro = new ResizeObserver((entries) => {
            const rect = entries[0]?.contentRect;
            if (!rect) return;
            aplicarTamanio(Math.round(rect.width), Math.round(rect.height));
        });
        if (padre) ro.observe(padre);

        return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    }, [altura, cantidad]);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-10 w-full opacity-70"
            style={{ height: "100%" }}
        />
    );
}

/* --- Efecto de escritura para el título --- */
function EfectoEscritura({ texto, velocidad = 40 }: { texto: string; velocidad?: number }) {
    const [mostrado, setMostrado] = useState("");
    const [terminado, setTerminado] = useState(false);

    useEffect(() => {
        let i = 0;
        const intervalo = setInterval(() => {
            i++;
            setMostrado(texto.slice(0, i));
            if (i >= texto.length) {
                clearInterval(intervalo);
                setTerminado(true);
            }
        }, velocidad);
        return () => clearInterval(intervalo);
    }, [texto, velocidad]);

    return (
        <span>
            {mostrado}
            {!terminado && (
                <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-[#7238E3] align-[-0.1em] animate-pulse" />
            )}
        </span>
    );
}

/* --- Simulación de chat interactivo en el hero --- */
function ChatDemo() {
    // fase 0-3: mensajes automáticos, 4: esperando input, 5: msg usuario enviado,
    // 6: bot escribiendo, 7: bot responde
    const [fase, setFase] = useState(0);

    const mensajesAuto = [
        { tipo: "usuario" as const, texto: "Hola, necesito información sobre sus servicios" },
        { tipo: "bot" as const, texto: "¡Hola! 👋 Soy el asistente virtual de tu empresa. ¿En qué puedo ayudarte hoy?" },
        { tipo: "usuario" as const, texto: "¿Qué planes tienen disponibles?" },
        { tipo: "bot" as const, texto: "Tenemos 3 planes adaptados a tu negocio. Te puedo agendar una llamada con un asesor para encontrar el ideal. ¿Te parece bien?" },
    ];

    const mensajeInteractivo = {
        usuario: "Sí, quiero agendar una llamada",
        bot: "¡Perfecto! Acabo de agendar una llamada con un asesor para mañana a las 10:00 AM. Te envié un correo de confirmación. 📧",
    };

    // Animación automática de los primeros 4 mensajes
    useEffect(() => {
        if (fase >= 4) return;
        const delay = fase === 0 ? 800 : 1400;
        const timer = setTimeout(() => setFase((prev) => prev + 1), delay);
        return () => clearTimeout(timer);
    }, [fase]);

    // Cuando el usuario envía el tercer mensaje (fase 5), iniciar secuencia bot
    useEffect(() => {
        if (fase === 5) {
            const t1 = setTimeout(() => setFase(6), 600); // bot escribiendo
            return () => clearTimeout(t1);
        }
        if (fase === 6) {
            const t2 = setTimeout(() => setFase(7), 1800); // bot responde
            return () => clearTimeout(t2);
        }
    }, [fase]);

    const enviarMensaje = () => {
        if (fase === 4) setFase(5);
    };

    // Todos los mensajes visibles en el chat
    const mensajesAMostrar: { tipo: "usuario" | "bot"; texto: string }[] = [
        ...mensajesAuto.slice(0, Math.min(fase, 4)),
        ...(fase >= 5 ? [{ tipo: "usuario" as const, texto: mensajeInteractivo.usuario }] : []),
        ...(fase >= 7 ? [{ tipo: "bot" as const, texto: mensajeInteractivo.bot }] : []),
    ];

    const botEscribiendo = (fase < 4 && fase > 0 && mensajesAuto[fase].tipo === "bot") || fase === 6;

    return (
        /* Contenedor con perspectiva 3D y efecto de carta física */
        <div
            className="relative mx-auto w-full max-w-[52rem]"
            style={{ perspective: "1200px" }}
        >
            {/* Sombra volumétrica debajo de la carta */}
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-8 left-[8%] right-[8%] h-[60%] rounded-[50%] opacity-80"
                style={{
                    background: "radial-gradient(ellipse at center, rgba(114,56,227,0.35) 0%, rgba(114,56,227,0.12) 40%, transparent 70%)",
                    filter: "blur(40px)",
                }}
            />
            {/* Sombra difusa extra para profundidad */}
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-12 left-[15%] right-[15%] h-[40%] rounded-[50%] opacity-60"
                style={{
                    background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 70%)",
                    filter: "blur(50px)",
                }}
            />

            <motion.div
                className="relative rounded-2xl border border-white/[0.08] bg-[#0d1117]/95 overflow-hidden"
                style={{
                    transformStyle: "preserve-3d",
                    boxShadow: [
                        "0 2px 4px rgba(0,0,0,0.2)",
                        "0 8px 16px rgba(0,0,0,0.25)",
                        "0 24px 48px rgba(0,0,0,0.3)",
                        "0 48px 80px rgba(0,0,0,0.35)",
                        "0 0 0 1px rgba(255,255,255,0.04)",
                        "inset 0 1px 0 rgba(255,255,255,0.06)",
                    ].join(", "),
                }}
                animate={{
                    rotateX: [1, -0.5, 1],
                    y: [0, -6, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Reflejo luminoso superior para simular material físico */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />

                {/* Barra superior del chat */}
                <div className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.02] px-5 py-3.5">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-violet-500">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-white">Asistente IA - Tu Empresa</div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                            </span>
                            En línea · Responde al instante
                        </div>
                    </div>
                    <div className="ml-auto flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                        <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                        <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    </div>
                </div>

                {/* Área de mensajes */}
                <div className="flex flex-col gap-3 p-5 min-h-[260px] md:min-h-[300px]">
                    {mensajesAMostrar.map((msg, idx) => (
                        <motion.div
                            key={`msg-${idx}`}
                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className={`flex ${msg.tipo === "usuario" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.tipo === "usuario"
                                    ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-br-md"
                                    : "bg-white/[0.06] text-gray-200 ring-1 ring-white/[0.06] rounded-bl-md"
                                    }`}
                            >
                                {msg.texto}
                            </div>
                        </motion.div>
                    ))}

                    {/* Indicador de escritura del bot */}
                    {botEscribiendo && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/[0.06] rounded-bl-md">
                                <div className="flex gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Barra de input - interactiva cuando fase === 4 */}
                <div className="border-t border-white/[0.06] bg-white/[0.02] px-5 py-3.5">
                    {fase === 4 ? (
                        <button
                            onClick={enviarMensaje}
                            className="group flex w-full items-center gap-3 rounded-xl bg-white/[0.04] px-4 py-2.5 ring-1 ring-white/[0.08] transition-all hover:bg-white/[0.06] hover:ring-violet-500/30 cursor-pointer"
                        >
                            <span className="flex-1 text-left text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                {mensajeInteractivo.usuario}
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 shadow-lg shadow-violet-500/20 transition-transform group-hover:scale-110">
                                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-4 py-2.5 ring-1 ring-white/[0.08]">
                            <span className="text-sm text-gray-500 flex-1">Escribe un mensaje...</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 transition hover:from-violet-500 hover:to-violet-400">
                                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>

                {/* Reflejo inferior */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
                />
            </motion.div>
        </div>
    );
}

/* --- Tarjetas de características --- */
const caracteristicas = [
    {
        icono: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        titulo: "Respuestas instantáneas",
        descripcion: "Tu chatbot responde en segundos, 24/7, sin tiempos de espera. Atención inmediata para cada cliente.",
    },
    {
        icono: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        titulo: "Entrenado con tus datos",
        descripcion: "Lo alimentamos con tu base de conocimiento, precios, FAQs y procesos para que hable como tu equipo.",
    },
    {
        icono: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        titulo: "Escala sin contratar",
        descripcion: "Un chatbot atiende miles de conversaciones simultáneas. Sin salarios, sin rotación, sin límites.",
    },
    {
        icono: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
        ),
        titulo: "Métricas en tiempo real",
        descripcion: "Visualiza conversaciones, satisfacción, temas frecuentes y oportunidades de mejora desde tu panel.",
    },
];

/* --- Marquee de integraciones (2 filas, dirección basada en scroll) --- */
const integFilaSuperior = [
    { nombre: "WhatsApp", icono: "/imagenes/whatsapp-8.svg" },
    { nombre: "Instagram", icono: "/imagenes/instagram-2016-5.svg" },
    { nombre: "Facebook", icono: "/imagenes/LogosFacebook.svg" },
    { nombre: "Telegram", icono: "/imagenes/LogosTelegram.svg" },
    { nombre: "Slack", icono: "/imagenes/DeviconSlack.svg" },
    { nombre: "ChatGPT", icono: "/imagenes/chatgpt.svg" },
    { nombre: "Gmail", icono: "/imagenes/official-gmail-icon-2020-.svg" },
    { nombre: "Notion", icono: "/imagenes/notion.svg" },
    { nombre: "Excel", icono: "/imagenes/excel-4.svg" },
];

const integFilaInferior = [
    { nombre: "Airtable", icono: "/imagenes/LogosAirtable.svg" },
    { nombre: "Asana", icono: "/imagenes/LogosAsanaIcon.svg" },
    { nombre: "Discord", icono: "/imagenes/LogosDiscordIcon.svg" },
    { nombre: "Dropbox", icono: "/imagenes/LogosDropbox.svg" },
    { nombre: "Google Calendar", icono: "/imagenes/google-calendar-icon-2020-.svg" },
    { nombre: "Google Drive", icono: "/imagenes/new-logo-drive-google.svg" },
    { nombre: "Outlook", icono: "/imagenes/ZmdiOutlook.svg" },
    { nombre: "WhatsApp", icono: "/imagenes/whatsapp-8.svg" },
    { nombre: "Slack", icono: "/imagenes/DeviconSlack.svg" },
];

function MarqueeIntegraciones() {
    const [scrollAbajo, setScrollAbajo] = useState(true);
    const ultimoScroll = useRef(0);

    useEffect(() => {
        const manejarScroll = () => {
            const actual = window.scrollY;
            setScrollAbajo(actual >= ultimoScroll.current);
            ultimoScroll.current = actual;
        };
        window.addEventListener("scroll", manejarScroll, { passive: true });
        return () => window.removeEventListener("scroll", manejarScroll);
    }, []);

    const renderFila = (items: typeof integFilaSuperior, invertir: boolean) => {
        // Duplicamos los items para crear el efecto infinito
        const duplicados = [...items, ...items, ...items];
        const direccion = invertir
            ? (scrollAbajo ? "reverse" : "normal")
            : (scrollAbajo ? "normal" : "reverse");

        return (
            <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
                <div
                    className="flex gap-4 w-max"
                    style={{
                        animation: `marquee-scroll 60s linear infinite`,
                        animationDirection: direccion,
                    }}
                >
                    {duplicados.map((item, idx) => (
                        <div
                            key={`${item.nombre}-${idx}`}
                            className="flex items-center gap-2.5 rounded-xl bg-white/[0.04] px-4 py-2.5 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.08] hover:ring-white/[0.12] shrink-0"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.icono}
                                alt={item.nombre}
                                className="h-5 w-5 object-contain"
                            />
                            <span className="text-sm font-medium text-gray-300 whitespace-nowrap">
                                {item.nombre}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {renderFila(integFilaSuperior, false)}
            {renderFila(integFilaInferior, true)}
        </div>
    );
}
/* --- Demo interactiva: Calificación de leads --- */
function DemoCalificacion() {
    const [fase, setFase] = useState(0);
    // fases: 0=listo msg1, 1=msg1 enviado, 2=bot escribiendo, 3=bot responde, 4=card lead
    //         5=listo msg2, 6=msg2 enviado, 7=bot escribiendo, 8=bot responde msg2
    //         9=listo msg3, 10=msg3 enviado, 11=bot escribiendo, 12=bot responde msg3 + notif reunión

    const mensajesIniciales = [
        { tipo: "usuario" as const, texto: "Hola, me interesa el plan premium para mi empresa" },
        { tipo: "bot" as const, texto: "¡Genial! Para recomendarte el mejor plan, ¿podrías decirme cuántos empleados tiene tu empresa?" },
        { tipo: "usuario" as const, texto: "Somos unos 50 empleados, usamos Salesforce" },
    ];

    const pasos = [
        {
            mensajeUsuario: "Nuestro presupuesto mensual es de $5.000 USD",
            respuestaBot: "Perfecto. Tu perfil coincide con nuestro Plan Enterprise. ¿Te gustaría saber sobre las integraciones disponibles?",
            fasesEnvio: [1, 2, 3, 4] as const,
        },
        {
            mensajeUsuario: "Sí, ¿se integra con nuestro CRM actual?",
            respuestaBot: "¡Por supuesto! Nos integramos nativamente con Salesforce, HubSpot y más de 40 herramientas. La configuración toma menos de 24 horas.",
            fasesEnvio: [6, 7, 8, 5] as const,
        },
        {
            mensajeUsuario: "Excelente, quiero agendar una demo",
            respuestaBot: "¡Listo! Te agendé una reunión con nuestro equipo para mañana a las 10:00 AM. Te llegará la confirmación por email. ¡Nos vemos!",
            fasesEnvio: [10, 11, 12, 9] as const,
        },
    ];

    // Determinar qué paso está activo y qué mensaje mostrar en el input
    const pasoActual = fase <= 4 ? 0 : fase <= 8 ? 1 : 2;
    const esperandoInput = fase === 0 || fase === 5 || fase === 9;
    const mensajeInput = pasos[pasoActual]?.mensajeUsuario ?? "";

    const enviarMensaje = () => {
        if (!esperandoInput) return;

        if (fase === 0) {
            setFase(1);
            setTimeout(() => setFase(2), 600);
            setTimeout(() => setFase(3), 2200);
            setTimeout(() => setFase(4), 3000);
            setTimeout(() => setFase(5), 4000);
        } else if (fase === 5) {
            setFase(6);
            setTimeout(() => setFase(7), 600);
            setTimeout(() => setFase(8), 2000);
            setTimeout(() => setFase(9), 3000);
        } else if (fase === 9) {
            setFase(10);
            setTimeout(() => setFase(11), 600);
            setTimeout(() => setFase(12), 2200);
        }
    };

    const reiniciar = () => setFase(0);

    // Mensajes dinámicos que se agregan progresivamente
    const mensajesDinamicos: { tipo: "usuario" | "bot"; texto: string; visibleDesde: number }[] = [
        { tipo: "usuario", texto: pasos[0].mensajeUsuario, visibleDesde: 1 },
        { tipo: "bot", texto: pasos[0].respuestaBot, visibleDesde: 3 },
        { tipo: "usuario", texto: pasos[1].mensajeUsuario, visibleDesde: 6 },
        { tipo: "bot", texto: pasos[1].respuestaBot, visibleDesde: 8 },
        { tipo: "usuario", texto: pasos[2].mensajeUsuario, visibleDesde: 10 },
        { tipo: "bot", texto: pasos[2].respuestaBot, visibleDesde: 12 },
    ];

    const botEscribiendo = fase === 2 || fase === 7 || fase === 11;

    return (
        <section className="relative bg-gradient-to-b from-[#111827] via-[#0f1520] to-[#111827] py-20 md:py-28 overflow-hidden">
            {/* Glow de fondo */}
            <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[40rem] w-[40rem] rounded-full bg-violet-700/10 blur-[120px]"
            />

            <div className="mx-auto max-w-6xl px-4 md:px-8">
                <motion.div
                    className="text-center mb-14"
                    initial="oculto"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={contenedor}
                >
                    <motion.h2
                        className="text-3xl font-bold tracking-tight sm:text-4xl"
                        variants={aparecerArriba}
                    >
                        Calificación automática de leads
                    </motion.h2>
                    <motion.p
                        className="mx-auto mt-4 max-w-2xl text-gray-400 text-lg"
                        variants={aparecerArriba}
                    >
                        Tu chatbot recopila la información, califica al prospecto y genera un lead listo para tu equipo de ventas.
                    </motion.p>
                </motion.div>

                {/* Layout: Chat + Card */}
                <motion.div
                    className="relative flex flex-col lg:flex-row gap-6 items-start"
                    initial="oculto"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={contenedor}
                >
                    {/* === CHAT (izquierda) === */}
                    <motion.div
                        className="relative flex-1 w-full lg:max-w-[55%]"
                        style={{ perspective: "1000px" }}
                        variants={aparecerArriba}
                    >
                        {/* Sombra volumétrica */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -bottom-6 left-[10%] right-[10%] h-[50%] rounded-[50%] opacity-70"
                            style={{
                                background: "radial-gradient(ellipse at center, rgba(114,56,227,0.25) 0%, transparent 70%)",
                                filter: "blur(35px)",
                            }}
                        />

                        <div
                            className="relative rounded-2xl border border-white/[0.08] bg-[#0d1117]/95 overflow-hidden"
                            style={{
                                boxShadow: [
                                    "0 2px 4px rgba(0,0,0,0.2)",
                                    "0 8px 16px rgba(0,0,0,0.2)",
                                    "0 24px 48px rgba(0,0,0,0.25)",
                                    "0 0 0 1px rgba(255,255,255,0.03)",
                                    "inset 0 1px 0 rgba(255,255,255,0.05)",
                                ].join(", "),
                            }}
                        >
                            {/* Reflejo superior */}
                            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                            {/* Header del chat */}
                            <div className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.02] px-5 py-3">
                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-violet-500">
                                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <div className="text-xs">
                                    <div className="font-semibold text-white/90">Chat en vivo</div>
                                    <div className="text-gray-500">Conversación #1847</div>
                                </div>
                                <div className="ml-auto flex items-center gap-1.5">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                                    </span>
                                    <span className="text-[11px] text-gray-500">Activo</span>
                                </div>
                            </div>

                            {/* Mensajes */}
                            <div className="flex flex-col gap-2.5 p-4 min-h-[280px] md:min-h-[320px] max-h-[420px] overflow-y-auto">
                                {mensajesIniciales.map((msg, idx) => (
                                    <div
                                        key={`ini-${idx}`}
                                        className={`flex ${msg.tipo === "usuario" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${msg.tipo === "usuario"
                                                ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-br-md"
                                                : "bg-white/[0.05] text-gray-300 ring-1 ring-white/[0.06] rounded-bl-md"
                                                }`}
                                        >
                                            {msg.texto}
                                        </div>
                                    </div>
                                ))}

                                {/* Mensajes dinámicos */}
                                {mensajesDinamicos.map((msg, idx) => (
                                    <AnimatePresence key={`din-${idx}`}>
                                        {fase >= msg.visibleDesde && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                                className={`flex ${msg.tipo === "usuario" ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${msg.tipo === "usuario"
                                                        ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-br-md"
                                                        : "bg-white/[0.05] text-gray-300 ring-1 ring-white/[0.06] rounded-bl-md"
                                                        }`}
                                                >
                                                    {msg.texto}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                ))}

                                {/* Bot escribiendo */}
                                <AnimatePresence>
                                    {botEscribiendo && (
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

                            {/* Input */}
                            <div className="border-t border-white/[0.06] bg-white/[0.015] px-4 py-3">
                                {esperandoInput && fase < 12 ? (
                                    <button
                                        onClick={enviarMensaje}
                                        className="group flex w-full items-center gap-3 rounded-xl bg-white/[0.04] px-4 py-2.5 ring-1 ring-white/[0.08] transition-all hover:bg-white/[0.06] hover:ring-violet-500/30 cursor-pointer"
                                    >
                                        <span className="flex-1 text-left text-[13px] text-gray-400 group-hover:text-gray-300 transition-colors">
                                            {mensajeInput}
                                        </span>
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 shadow-lg shadow-violet-500/20 transition-transform group-hover:scale-110">
                                            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-2.5 ring-1 ring-white/[0.06]">
                                        <span className="flex-1 text-[13px] text-gray-600">Escribe un mensaje...</span>
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06]">
                                            <svg className="h-3.5 w-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                {/* Herramientas del input */}
                                <div className="mt-2 flex items-center gap-3 px-1">
                                    {[
                                        "M12 4v16m8-8H4",
                                        "M3 5h18M3 12h18M3 19h12",
                                        "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01",
                                        "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13",
                                    ].map((d, i) => (
                                        <div key={i} className="flex h-6 w-6 items-center justify-center rounded text-gray-600 hover:text-gray-400 transition-colors cursor-pointer">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={d} />
                                            </svg>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* === PANEL DE LEADS (derecha) === */}
                    <motion.div
                        className="relative flex-1 w-full lg:max-w-[45%]"
                        style={{ perspective: "1000px" }}
                        variants={aparecerArriba}
                    >
                        {/* Sombra volumétrica */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -bottom-6 left-[10%] right-[10%] h-[50%] rounded-[50%] opacity-60"
                            style={{
                                background: "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)",
                                filter: "blur(30px)",
                            }}
                        />

                        <div
                            className="relative rounded-2xl border border-white/[0.08] bg-[#0d1117]/95 overflow-hidden"
                            style={{
                                boxShadow: [
                                    "0 2px 4px rgba(0,0,0,0.2)",
                                    "0 8px 16px rgba(0,0,0,0.2)",
                                    "0 24px 48px rgba(0,0,0,0.25)",
                                    "0 0 0 1px rgba(255,255,255,0.03)",
                                    "inset 0 1px 0 rgba(255,255,255,0.05)",
                                ].join(", "),
                            }}
                        >
                            {/* Reflejo superior */}
                            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                            {/* Header del panel */}
                            <div className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.02] px-5 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 text-emerald-400">
                                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-semibold text-white/90">Leads calificados</span>
                                </div>
                                <span className="ml-auto rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium text-gray-400">
                                    {fase >= 4 ? "24" : "23"}
                                </span>
                            </div>

                            {/* Leads existentes */}
                            <div className="p-3 space-y-2">
                                {[
                                    { nombre: "María López", empresa: "TechFlow", score: "92", tiempo: "Hace 12 min" },
                                    { nombre: "Carlos Ruiz", empresa: "DataSync", score: "87", tiempo: "Hace 34 min" },
                                    { nombre: "Ana Torres", empresa: "CloudBase", score: "78", tiempo: "Hace 1 h" },
                                ].map((lead, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-3.5 py-2.5 ring-1 ring-white/[0.04]"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-[11px] font-bold text-gray-400">
                                            {lead.nombre.split(" ").map(n => n[0]).join("")}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[12px] font-medium text-white/70 truncate">{lead.nombre}</div>
                                            <div className="text-[11px] text-gray-500">{lead.empresa} · {lead.tiempo}</div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-1.5 w-8 rounded-full bg-white/[0.06] overflow-hidden">
                                                <div className="h-full rounded-full bg-emerald-500/60" style={{ width: `${lead.score}%` }} />
                                            </div>
                                            <span className="text-[10px] font-mono text-gray-500">{lead.score}</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Nuevo lead animado */}
                                <AnimatePresence>
                                    {fase >= 4 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20, scale: 0.9, height: 0 }}
                                            animate={{ opacity: 1, y: 0, scale: 1, height: "auto" }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 24,
                                                height: { duration: 0.3 },
                                            }}
                                        >
                                            <div className="relative rounded-xl bg-violet-500/[0.08] px-3.5 py-3 ring-1 ring-violet-500/20 overflow-hidden">
                                                <div
                                                    aria-hidden
                                                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-violet-500/[0.05] to-transparent"
                                                />

                                                {/* Badge "Nuevo" */}
                                                <motion.div
                                                    className="absolute top-2 right-2"
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
                                                >
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-300 ring-1 ring-violet-500/30">
                                                        <span className="relative flex h-1.5 w-1.5">
                                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                                                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
                                                        </span>
                                                        Nuevo
                                                    </span>
                                                </motion.div>

                                                <div className="relative flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-violet-500 text-[12px] font-bold text-white shadow-lg shadow-violet-500/20">
                                                        JM
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[13px] font-semibold text-white">Juan Martínez</div>
                                                        <div className="text-[11px] text-gray-400">50 empleados · Salesforce · $5K/mes</div>
                                                    </div>
                                                </div>

                                                {/* Tags */}
                                                <motion.div
                                                    className="mt-3 flex flex-wrap gap-1.5"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    <span className="inline-flex items-center rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                                                        Plan Enterprise
                                                    </span>
                                                    <span className="inline-flex items-center rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-400 ring-1 ring-amber-500/20">
                                                        Alta prioridad
                                                    </span>
                                                    <span className="inline-flex items-center rounded-md bg-blue-500/15 px-2 py-0.5 text-[10px] font-medium text-blue-400 ring-1 ring-blue-500/20">
                                                        CRM integrado
                                                    </span>
                                                    {/* Tag de integración CRM verificada (aparece en fase 8) */}
                                                    <AnimatePresence>
                                                        {fase >= 8 && (
                                                            <motion.span
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                className="inline-flex items-center rounded-md bg-violet-500/15 px-2 py-0.5 text-[10px] font-medium text-violet-400 ring-1 ring-violet-500/20"
                                                            >
                                                                Salesforce ✓
                                                            </motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>

                                                {/* Score */}
                                                <motion.div
                                                    className="mt-2.5 flex items-center gap-2"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.6 }}
                                                >
                                                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                                        <motion.div
                                                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-400"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: fase >= 12 ? "99%" : fase >= 8 ? "98%" : "96%" }}
                                                            transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                                                        />
                                                    </div>
                                                    <span className="text-[11px] font-mono font-semibold text-emerald-400">
                                                        {fase >= 12 ? "99" : fase >= 8 ? "98" : "96"}
                                                    </span>
                                                </motion.div>

                                                <motion.div
                                                    className="mt-2 text-[10px] text-gray-500"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.8 }}
                                                >
                                                    Ahora mismo · Calificado automáticamente
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Notificación de reunión agendada (fase 12) */}
                                <AnimatePresence>
                                    {fase >= 12 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -15, scale: 0.9, height: 0 }}
                                            animate={{ opacity: 1, y: 0, scale: 1, height: "auto" }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 24,
                                                delay: 0.5,
                                                height: { duration: 0.3, delay: 0.5 },
                                            }}
                                        >
                                            <div className="relative rounded-xl bg-emerald-500/[0.08] px-3.5 py-3 ring-1 ring-emerald-500/20 overflow-hidden">
                                                <div
                                                    aria-hidden
                                                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/[0.03] to-transparent"
                                                />
                                                <div className="relative flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[12px] font-semibold text-emerald-300">Reunión agendada</div>
                                                        <div className="text-[11px] text-gray-400">Mañana 10:00 AM · Juan Martínez</div>
                                                    </div>
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.8, type: "spring" }}
                                                    >
                                                        <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Botón reiniciar */}
                        <AnimatePresence>
                            {fase >= 12 && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: 1.5 }}
                                    onClick={reiniciar}
                                    className="mt-4 mx-auto flex items-center gap-2 rounded-full bg-white/[0.04] px-4 py-2 text-[12px] font-medium text-gray-400 ring-1 ring-white/[0.06] transition hover:bg-white/[0.08] hover:text-gray-300 cursor-pointer"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Repetir demo
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}


/* --- Enlaces del navbar para la subpágina --- */
const enlacesChatbots = [
    { etiqueta: "Inicio", href: "/" },
    { etiqueta: "Chatbots", href: "#inicio-chatbots" },
    { etiqueta: "Características", href: "#caracteristicas" },
    { etiqueta: "Integraciones", href: "#integraciones" },
];

/* =================================
   PÁGINA DE CHATBOTS
================================= */
export default function PaginaChatbots() {
    const [isMd, setIsMd] = useState(false);
    useEffect(() => {
        const m = window.matchMedia("(min-width: 768px)");
        const onChange = () => setIsMd(m.matches);
        onChange();
        m.addEventListener("change", onChange);
        return () => m.removeEventListener("change", onChange);
    }, []);

    return (
        <main className="bg-[#0b0f14] text-white">
            {/* ======== HERO ======== */}
            <motion.section
                id="inicio-chatbots"
                className="relative overflow-hidden bg-gradient-to-b from-[#0b0f14] via-[#0f1520] to-[#111827]"
                initial="oculto"
                animate="visible"
            >
                {/* Navbar */}
                <Navbar
                    enlaces={enlacesChatbots}
                />

                {/* Glows decorativos */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-[50rem] w-[50rem] rounded-full bg-violet-700/15 blur-[120px]"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-20 -right-40 h-[30rem] w-[30rem] rounded-full bg-pink-600/10 blur-[100px]"
                />

                {/* Contenido del Hero */}
                <motion.div
                    className="relative z-20 mx-auto max-w-6xl px-4 pt-24 pb-12 md:px-8 md:pt-32 md:pb-20"
                    variants={contenedor}
                >
                    {/* Badge */}
                    <motion.div className="text-center" variants={aparecerArriba}>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 ring-1 ring-white/20">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
                            </span>
                            <span className="text-sm font-medium text-gray-300">Chatbots con IA</span>
                        </div>
                    </motion.div>

                    {/* Título principal - Estilo Linear */}
                    <motion.h1
                        className="mx-auto max-w-4xl text-center text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-[3.5rem] lg:text-[4rem]"
                        variants={aparecerArriba}
                    >
                        Tu asistente virtual{" "}
                        <span className="bg-gradient-to-r from-[#7238E3] via-[#9b6bff] to-[#ff7ad9] bg-clip-text text-transparent">
                            que nunca duerme
                        </span>
                    </motion.h1>

                    {/* Subtítulo */}
                    <motion.p
                        className="mx-auto mt-5 max-w-2xl text-center text-lg text-gray-400 md:text-xl"
                        variants={aparecerArriba}
                    >
                        Chatbots inteligentes entrenados con la información de tu negocio.
                        Atienden, venden y agendan por ti, en cualquier plataforma, las 24 horas.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        className="mx-auto mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:gap-4"
                        variants={aparecerArriba}
                    >
                        <a
                            href="#caracteristicas"
                            className="inline-flex w-full items-center justify-center rounded-xl bg-white/10 px-8 py-3 text-base font-semibold ring-1 ring-white/20 transition hover:bg-white/15 hover:ring-white/30 sm:w-auto md:px-10 md:py-4 md:text-lg"
                        >
                            Ver características
                        </a>
                        <a
                            href="#cta-chatbots"
                            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-8 py-3 text-base font-semibold shadow-lg shadow-violet-500/25 transition hover:from-violet-500 hover:to-violet-400 sm:w-auto md:px-10 md:py-4 md:text-lg"
                        >
                            Quiero mi chatbot
                        </a>
                    </motion.div>

                    {/* Etiqueta antes del demo */}
                    <motion.div
                        className="mx-auto mt-6 flex items-center justify-center gap-2 text-xs text-gray-500"
                        variants={aparecerArriba}
                    >
                        <span className="text-violet-400">New</span>
                        <span>Chatbots con IA conversacional avanzada →</span>
                    </motion.div>

                    {/* Demo del chatbot - Elemento central */}
                    <motion.div
                        className="mx-auto mt-8 max-w-[52rem] md:mt-10"
                        variants={aparecerArriba}
                    >
                        <ChatDemo />
                    </motion.div>
                </motion.div>

                {/* Partículas de red - Solo Desktop */}
                {isMd && <LineasRed altura={220} cantidad={22} />}

                {/* Grid sutil */}
                <svg
                    aria-hidden
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern id="grid-chatbots" width="32" height="32" patternUnits="userSpaceOnUse">
                            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.8" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-chatbots)" />
                </svg>
            </motion.section>

            {/* ======== DEMO CALIFICACIÓN DE LEADS ======== */}
            <DemoCalificacion />

            {/* ======== CARACTERÍSTICAS ======== */}
            <section id="caracteristicas" className="relative bg-[#111827] py-20 md:py-28">
                <div className="mx-auto max-w-6xl px-4 md:px-8">
                    <motion.div
                        className="text-center"
                        initial="oculto"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={contenedor}
                    >
                        <motion.h2
                            className="text-3xl font-bold tracking-tight sm:text-4xl"
                            variants={aparecerArriba}
                        >
                            Todo lo que tu chatbot puede hacer
                        </motion.h2>
                        <motion.p
                            className="mx-auto mt-4 max-w-2xl text-gray-400 text-lg"
                            variants={aparecerArriba}
                        >
                            No es un bot genérico. Es un asistente entrenado específicamente para tu negocio.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                        initial="oculto"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={contenedor}
                    >
                        {caracteristicas.map((car, idx) => (
                            <motion.div
                                key={idx}
                                className="group rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition-all hover:border-violet-500/30 hover:bg-white/[0.05]"
                                variants={aparecerArriba}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-violet-500/10 text-violet-400 ring-1 ring-violet-500/20 transition-colors group-hover:from-violet-600/30 group-hover:to-violet-500/20 group-hover:text-violet-300">
                                    {car.icono}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{car.titulo}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{car.descripcion}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ======== INTEGRACIONES ======== */}
            <section id="integraciones" className="relative bg-gradient-to-b from-[#111827] to-[#0b0f14] py-20 md:py-28 overflow-hidden">
                {/* CSS keyframe para el marquee */}
                <style>{`
                    @keyframes marquee-scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-33.333%); }
                    }
                `}</style>

                <div className="mx-auto max-w-6xl px-4 md:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial="oculto"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={contenedor}
                    >
                        <motion.h2
                            className="text-3xl font-bold tracking-tight sm:text-4xl"
                            variants={aparecerArriba}
                        >
                            +40 integraciones nativas
                        </motion.h2>
                        <motion.p
                            className="mx-auto mt-4 max-w-2xl text-gray-400 text-lg"
                            variants={aparecerArriba}
                        >
                            Conecta tu chatbot con las herramientas que ya usás para centralizar la gestión de tus operaciones comerciales.
                        </motion.p>
                    </motion.div>
                </div>

                {/* Marquee a ancho completo */}
                <MarqueeIntegraciones />
            </section>

            {/* ======== CTA FINAL ======== */}
            <section id="cta-chatbots" className="relative bg-[#0b0f14] py-20 md:py-28">
                {/* Glow */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[30rem] w-[30rem] rounded-full bg-violet-700/20 blur-[100px]"
                />
                <motion.div
                    className="relative z-10 mx-auto max-w-3xl px-4 text-center md:px-8"
                    initial="oculto"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={contenedor}
                >
                    <motion.h2
                        className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
                        variants={aparecerArriba}
                    >
                        ¿Listo para automatizar tu atención al cliente?
                    </motion.h2>
                    <motion.p
                        className="mx-auto mt-5 max-w-xl text-lg text-gray-400"
                        variants={aparecerArriba}
                    >
                        Agendá una entrevista gratuita y te mostramos cómo un chatbot con IA
                        puede transformar tu negocio en semanas.
                    </motion.p>
                    <motion.div
                        className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
                        variants={aparecerArriba}
                    >
                        <a
                            href="/"
                            className="inline-flex w-full items-center justify-center rounded-xl bg-white/10 px-8 py-3 text-base font-semibold ring-1 ring-white/20 transition hover:bg-white/15 hover:ring-white/30 sm:w-auto md:px-10 md:py-4 md:text-lg"
                        >
                            Volver al inicio
                        </a>
                        <a
                            href="/#cta"
                            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-8 py-3 text-base font-semibold shadow-lg shadow-violet-500/25 transition hover:from-violet-500 hover:to-violet-400 sm:w-auto md:px-10 md:py-4 md:text-lg"
                        >
                            Agendar entrevista gratis
                        </a>
                    </motion.div>

                    {/* Trust badges */}
                    <motion.div
                        className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400"
                        variants={aparecerArriba}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Sin costo de diagnóstico
                        </span>
                        <span className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Implementación en 2 semanas
                        </span>
                        <span className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Soporte continuo
                        </span>
                    </motion.div>
                </motion.div>
            </section>

            {/* Footer y botón flotante */}
            <FloatingCalendar />
            <Footer />
        </main>
    );
}
