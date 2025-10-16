"use client";
import React from "react";


function IconWrap({ children, href }: { children: React.ReactNode; href?: string }) {
  return (
    <a
      href={href || "#"}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/15 backdrop-blur transition hover:bg-white/10 hover:ring-white/25"
      aria-label="Red social"
    >
      <span className="text-white/80 transition group-hover:text-white">{children}</span>
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative text-white">
      {/* Degradado desde abajo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(70% 90% at 50% 120%, rgba(114,56,227,0.40) 0%, rgba(114,56,227,0.16) 45%, transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 py-10">

        <div className="mt-8 flex flex-col items-center justify-between gap-6 md:mt-10 md:flex-row">
          <p className="text-sm text-gray-400">© {year} Promptoma. Todos los derechos reservados.</p>

          {/* Solo Instagram, LinkedIn y YouTube */}
          <nav aria-label="Redes sociales" className="flex items-center gap-4">
            {/* Instagram */}
            <IconWrap href="#">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                />
              </svg>
            </IconWrap>

            {/* LinkedIn */}
            <IconWrap href="#">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
                />
              </svg>
            </IconWrap>

            {/* YouTube */}
            <IconWrap href="#">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="m10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73"
                />
              </svg>
            </IconWrap>
          </nav>
        </div>
      </div>
    </footer>
  );
}