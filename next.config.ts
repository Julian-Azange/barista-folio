import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Habilitamos imágenes de perfil de Clerk (Google/Email)
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      // Si usas otro proveedor después (como uploadthing), lo agregaremos aquí
      {
        protocol: 'https',
        hostname: 'utfs.io',
      }
    ],
  },
};

export default nextConfig;