"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* --- Tipos --- */
interface NavbarProps {
    enlaces?: { etiqueta: string; href: string }[];
}

/* --- Enlaces por defecto --- */
const enlacesPorDefecto = [
    { etiqueta: "Inicio", href: "#inicio" },
    { etiqueta: "Beneficios", href: "#why-section" },
    { etiqueta: "Casos de uso", href: "#use-cases" },
    { etiqueta: "Chatbots", href: "/chatbots" },
];

export default function Navbar({
    enlaces = enlacesPorDefecto,
}: NavbarProps) {
    const [menuAbierto, setMenuAbierto] = useState(false);
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

    useEffect(() => {
        document.body.style.overflow = menuAbierto ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuAbierto]);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "bg-[#0b0f14]/70 backdrop-blur-2xl border-b border-white/[0.06]"
                    : "bg-transparent"
                }`}
        >
            <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3 md:px-8 md:py-3.5">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2.5 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/imagenes/Logo-Promptoma.png"
                        alt="Promptoma"
                        className="h-8 w-8 rounded-lg object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="text-[1.05rem] font-semibold text-white/90 tracking-tight transition-colors group-hover:text-white">
                        Promptoma
                    </span>
                </a>

                {/* Enlaces - Desktop: pastilla glassmorphism centrada */}
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

                {/* Botón hamburguesa - Móvil */}
                <button
                    onClick={() => setMenuAbierto(!menuAbierto)}
                    className="md:hidden relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-white/5"
                    aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={menuAbierto}
                >
                    <div className="flex flex-col items-center justify-center gap-[5px]">
                        <span
                            className={`block h-[1.5px] w-[18px] bg-gray-300 rounded-full transition-all duration-300 origin-center ${menuAbierto ? "rotate-45 translate-y-[3.25px]" : ""
                                }`}
                        />
                        <span
                            className={`block h-[1.5px] w-[18px] bg-gray-300 rounded-full transition-all duration-300 origin-center ${menuAbierto ? "-rotate-45 -translate-y-[3.25px]" : ""
                                }`}
                        />
                    </div>
                </button>
            </div>

            {/* Menú móvil */}
            <AnimatePresence>
                {menuAbierto && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="md:hidden overflow-hidden bg-[#0b0f14]/95 backdrop-blur-2xl border-t border-white/[0.04]"
                    >
                        <div className="flex flex-col px-4 py-5 gap-0.5">
                            {enlaces.map((enlace) => (
                                <a
                                    key={enlace.href}
                                    href={enlace.href}
                                    onClick={() => setMenuAbierto(false)}
                                    className="px-4 py-3 text-[15px] font-medium text-gray-300 rounded-xl transition-colors hover:text-white hover:bg-white/[0.04]"
                                >
                                    {enlace.etiqueta}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
