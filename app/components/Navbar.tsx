"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

/* --- Tipos --- */
interface NavbarProps {
    enlaces?: { etiqueta: string; href: string }[];
}

/* --- Enlaces por defecto --- */
const enlacesPorDefecto = [
    { etiqueta: "Inicio", href: "#inicio" },
    { etiqueta: "Chatbots", href: "#chatbots-promo" },
    { etiqueta: "Casos de uso", href: "#casos-uso" },
    { etiqueta: "Casos de éxito", href: "#casos-exito" },
];

export default function Navbar({
    enlaces = enlacesPorDefecto,
}: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [enlaceActivo, setEnlaceActivo] = useState("");

    useEffect(() => {
        const alScroll = () => setScrolled(window.scrollY > 20);
        alScroll();
        window.addEventListener("scroll", alScroll, { passive: true });
        return () => window.removeEventListener("scroll", alScroll);
    }, []);

    // Detectar sección activa al hacer scroll
    useEffect(() => {
        const ids = enlaces
            .map((e) => e.href)
            .filter((h) => h.startsWith("#"))
            .map((h) => h.slice(1));

        if (ids.length === 0) return;

        const observar = () => {
            let activo = "";
            for (const id of ids) {
                const el = document.getElementById(id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 120) activo = `#${id}`;
                }
            }
            setEnlaceActivo(activo);
        };

        window.addEventListener("scroll", observar, { passive: true });
        observar();
        return () => window.removeEventListener("scroll", observar);
    }, [enlaces]);

    /* Enlace para mobile: en subpáginas mostrar "Inicio", en principal mostrar "Chatbots" */
    const enlaceInicio = enlaces.find((e) => e.href === "/");
    const enlaceMobile = enlaceInicio
        || enlaces.find((e) => e.etiqueta.toLowerCase().includes("chatbot"));

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-50"
            initial={false}
            animate={scrolled ? "visible" : "oculto"}
        >
            {/* Fondo con animación glassmorphism */}
            <motion.div
                className="absolute inset-0 bg-[#0b0f14]/80 backdrop-blur-2xl"
                variants={{
                    oculto: { opacity: 0 },
                    visible: { opacity: 1 },
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            />

            {/* Línea inferior con gradiente animado */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[1px]"
                style={{
                    background:
                        "linear-gradient(90deg, transparent, rgba(114,56,227,0.4) 30%, rgba(155,107,255,0.5) 50%, rgba(114,56,227,0.4) 70%, transparent)",
                }}
                variants={{
                    oculto: { opacity: 0, scaleX: 0.3 },
                    visible: { opacity: 1, scaleX: 1 },
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />

            <div className="relative mx-auto max-w-6xl flex items-center justify-between px-4 py-3 md:px-8 md:py-3.5 overflow-hidden">
                {/* Logo - solo imagen, más grande */}
                <a href="/" className="group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/imagenes/Logo-Promptoma.png"
                        alt="Promptoma"
                        className="h-12 w-12 md:h-[3.25rem] md:w-[3.25rem] rounded-xl object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                </a>

                {/* Enlaces - Desktop: pastilla glassmorphism */}
                <div className="hidden md:flex items-center gap-0.5 rounded-full bg-white/[0.04] px-1.5 py-1 ring-1 ring-white/[0.06]">
                    {enlaces.map((enlace) => {
                        const esActivo = enlaceActivo === enlace.href;
                        return (
                            <a
                                key={enlace.href}
                                href={enlace.href}
                                className={`relative px-4 py-1.5 text-[13px] font-medium rounded-full transition-all duration-300 ${esActivo
                                    ? "text-white"
                                    : "text-gray-400 hover:text-gray-200"
                                    }`}
                            >
                                {/* Indicador activo animado */}
                                {esActivo && (
                                    <motion.div
                                        layoutId="indicador-nav"
                                        className="absolute inset-0 rounded-full bg-white/[0.08] ring-1 ring-white/[0.1]"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{enlace.etiqueta}</span>
                            </a>
                        );
                    })}
                </div>

                {/* Indicador de estado tech - Desktop */}
                <div className="hidden md:flex items-center gap-3">
                    <div className="flex items-center gap-2 text-[12px] text-gray-500">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        <span className="font-mono tracking-wide">Sistemas activos</span>
                    </div>
                </div>

                {/* Mobile: enlace contextual */}
                {enlaceMobile && (
                    <a
                        href={enlaceMobile.href}
                        className="md:hidden flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-[13px] font-medium text-gray-300 ring-1 ring-white/[0.08] transition-all hover:bg-white/[0.1] hover:text-white shrink-0"
                    >
                        {enlaceInicio ? (
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        ) : (
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        )}
                        {enlaceMobile.etiqueta}
                    </a>
                )}
            </div>
        </motion.nav>
    );
}
