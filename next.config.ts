import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Generar archivos estáticos para hosting sin Node
  output: "export",
  // Si usás <Image>, desactiva la optimización del servidor
  images: { unoptimized: true },
  // Necesario para que las subpáginas funcionen con exportación estática
  trailingSlash: true,
};

export default nextConfig;
