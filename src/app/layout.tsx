import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. Importamos Clerk y el tema oscuro
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
// 2. Importamos el Toaster de Sonner
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Barista Folio",
  description: "Portafolios profesionales para expertos en café",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 3. ¡IMPORTANTE! ClerkProvider debe envolver TODO, incluido <html>
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "#D4A373" }
      }}
    >
      <html lang="es" className="dark">
        <body className={`${inter.className} bg-background text-foreground`}>
          {/* El contenido de la página */}
          {children}

          {/* Las alertas flotantes */}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}