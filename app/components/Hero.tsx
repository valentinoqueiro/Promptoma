"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Navbar from "./Navbar";

/* -----------------------------
   Animations & helpers
------------------------------ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* --- Hook: detectar breakpoint md para render condicional --- */
function useIsMdUp() {
  const [isMd, setIsMd] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsMd(m.matches);
    onChange();
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);
  return isMd;
}

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
      style={maxW ? { width: `${maxW}px`, textAlign: 'left' } : { textAlign: 'left' }}
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

/* --- Tarjeta de estadísticas animadas (EXPORTADA para usar en Why.tsx) --- */
export function ChartCard() {
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

/* --- Video Player con Controles Personalizados --- */
function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [showVolume, setShowVolume] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [hasUnmuted, setHasUnmuted] = useState(false); // Track si el usuario ya activó el sonido

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => setDuration(video.duration);
    const onEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  // Función para activar sonido y reiniciar video
  const handleUnmute = () => {
    const video = videoRef.current;
    if (!video) return;

    // Reiniciar el video desde el principio
    video.currentTime = 0;
    video.muted = false;
    setIsMuted(false);
    setHasUnmuted(true);
    setCurrentTime(0);

    // Asegurar que está reproduciendo
    video.play();
    setIsPlaying(true);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const vol = parseFloat(e.target.value);
    video.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
    if (isMuted) setHasUnmuted(true);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    // Verificar si ya estamos en pantalla completa
    const isFullscreen = document.fullscreenElement ||
      (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
      (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
      (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement;

    if (isFullscreen) {
      // Salir de pantalla completa
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as unknown as { webkitExitFullscreen?: () => void }).webkitExitFullscreen) {
        (document as unknown as { webkitExitFullscreen: () => void }).webkitExitFullscreen();
      } else if ((document as unknown as { mozCancelFullScreen?: () => void }).mozCancelFullScreen) {
        (document as unknown as { mozCancelFullScreen: () => void }).mozCancelFullScreen();
      } else if ((document as unknown as { msExitFullscreen?: () => void }).msExitFullscreen) {
        (document as unknown as { msExitFullscreen: () => void }).msExitFullscreen();
      }
    } else {
      // Entrar en pantalla completa - iOS Safari necesita webkitEnterFullscreen en el video
      const videoEl = video as HTMLVideoElement & {
        webkitEnterFullscreen?: () => void;
        webkitRequestFullscreen?: () => void;
        mozRequestFullScreen?: () => void;
        msRequestFullscreen?: () => void;
      };

      // Primero intentar webkitEnterFullscreen (específico para video en iOS Safari)
      if (videoEl.webkitEnterFullscreen) {
        videoEl.webkitEnterFullscreen();
      } else if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (videoEl.webkitRequestFullscreen) {
        videoEl.webkitRequestFullscreen();
      } else if (videoEl.mozRequestFullScreen) {
        videoEl.mozRequestFullScreen();
      } else if (videoEl.msRequestFullscreen) {
        videoEl.msRequestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="group relative aspect-video overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-[0_20px_80px_rgba(114,56,227,0.25)]"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Glow animado detrás del video */}
      <div
        aria-hidden
        className="absolute -inset-6 bg-gradient-to-r from-violet-600/30 via-pink-500/20 to-violet-600/30 blur-3xl opacity-60 animate-pulse"
      />
      {/* Borde decorativo con gradiente */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 via-transparent to-pink-500/20 pointer-events-none"
      />

      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="relative h-full w-full object-cover bg-black/80"
        style={{ borderRadius: "inherit" }}
        onClick={hasUnmuted ? togglePlay : handleUnmute}
      >
        Tu navegador no soporta la reproducción de video.
      </video>

      {/* Botón grande central para activar sonido */}
      {!hasUnmuted && (
        <button
          onClick={handleUnmute}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition-all duration-300 hover:bg-black/40 cursor-pointer"
          aria-label="Activar sonido y reproducir"
        >
          <div className="flex flex-col items-center gap-3 transform transition-transform duration-300 hover:scale-105">
            {/* Círculo con ícono de sonido */}
            <div className="relative">
              {/* Glow animado */}
              <div className="absolute inset-0 rounded-full bg-violet-500/40 blur-xl animate-pulse" />

              {/* Círculo principal */}
              <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-violet-600 to-violet-500 shadow-2xl shadow-violet-500/50 ring-4 ring-white/20">
                {/* Ícono de volumen con línea tachada */}
                <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              </div>
            </div>

            {/* Texto */}
            <span className="text-white font-semibold text-sm md:text-base bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
              🔊 Activar sonido
            </span>
          </div>
        </button>
      )}

      {/* Overlay sutil en hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition-opacity group-hover:ring-white/20"
      />

      {/* Controles Personalizados */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-all duration-300 ${showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
      >
        {/* Barra de Progreso */}
        <div className="mb-3">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer 
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-400 
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:shadow-violet-500/50
              [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-violet-400 
              [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-violet-500/50
              hover:[&::-webkit-slider-thumb]:scale-110 hover:[&::-moz-range-thumb]:scale-110
              transition-all"
            style={{
              background: `linear-gradient(to right, rgb(139 92 246) 0%, rgb(139 92 246) ${(currentTime / duration) * 100
                }%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) 100%)`,
            }}
          />
        </div>

        {/* Controles inferiores */}
        <div className="flex items-center gap-3 text-white">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Tiempo */}
          <div className="text-xs font-medium text-white/80 min-w-[80px]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          <div className="flex-1" />

          {/* Volumen */}
          <div
            className="relative flex items-center gap-2"
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
          >
            <button
              onClick={toggleMute}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
              aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted || volume === 0 ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
              )}
            </button>

            {/* Slider de Volumen */}
            <div
              className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 transition-all duration-200 ${showVolume ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                }`}
            >
              <div className="bg-black/90 backdrop-blur-md rounded-lg p-2 shadow-xl ring-1 ring-white/10">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer rotate-0
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-400 
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-violet-400 
                    [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                  style={{
                    background: `linear-gradient(to right, rgb(139 92 246) 0%, rgb(139 92 246) ${volume * 100
                      }%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Pantalla Completa */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
            aria-label="Pantalla completa"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
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
      if (!ctx) return;
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
   HERO - Layout Unidimensional Centrado
   Flujo: Texto → Video → CTAs
------------------------------ */
export default function Hero() {
  const isMd = useIsMdUp();
  return (
    <motion.section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-b from-[#0b0f14] to-[#111827] text-white"
      initial="hidden"
      animate="visible"
    >
      {/* Navbar fijo */}
      <Navbar />

      {/* Glow decorativo central */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[40rem] w-[40rem] rounded-full bg-violet-700/20 blur-[100px]"
      />

      {/* Hero content - Layout centrado verticalmente (compactado) */}
      <motion.div
        className="relative z-20 mx-auto max-w-6xl px-4 pt-20 pb-10 md:px-8 md:pt-28 md:pb-16"
        variants={container}
      >
        {/* Bloque de Texto - Centrado y Expandido */}
        <motion.div className="mx-auto max-w-5xl text-center" variants={fadeUp}>
          {/* Badge */}
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 ring-1 ring-white/20"
            variants={fadeUp}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
            </span>
            <span className="text-sm font-medium text-gray-300">Automatización con IA</span>
          </motion.div>

          <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-[3.5rem] lg:text-6xl">
            El futuro de tu negocio comienza con la{" "}
            <span className="whitespace-nowrap">
              Automatización <Typewriter />
            </span>
          </h1>

          <motion.p
            className="mx-auto mt-4 max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl"
            variants={fadeUp}
          >
            Implementamos IA y automatizaciones que ahorran tiempo, reducen
            errores y multiplican resultados.
          </motion.p>
        </motion.div>

        {/* Video VSL - Elemento Central (elevado) */}
        <motion.div
          className="mx-auto mt-6 max-w-4xl md:mt-8"
          variants={fadeUp}
        >
          <VideoPlayer src="/imagenes/VSL.mp4" />
        </motion.div>

        {/* CTAs - Base del flujo visual */}
        <motion.div
          className="mx-auto mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:mt-8 md:gap-4"
          variants={fadeUp}
        >
          <a
            href="#why-section"
            className="inline-flex w-full items-center justify-center rounded-xl bg-white/10 px-8 py-3 text-base font-semibold ring-1 ring-white/20 transition hover:bg-white/15 hover:ring-white/30 sm:w-auto md:px-10 md:py-4 md:text-lg"
          >
            Conocer más
          </a>
          <a
            href="#cta"
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-8 py-3 text-base font-semibold shadow-lg shadow-violet-500/25 transition hover:from-violet-500 hover:to-violet-400 sm:w-auto md:px-10 md:py-4 md:text-lg"
          >
            Agendar entrevista
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400"
          variants={fadeUp}
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
            Integración con python y n8n
          </span>
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Soporte continuo
          </span>
        </motion.div>
      </motion.div>

      {/* Partículas de red - Solo en Desktop */}
      {isMd && <NetworkLines full={true} height={220} count={28} />}

      {/* Grid sutil de fondo */}
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