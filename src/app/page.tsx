import { BaristaCard } from "@/components/barista-card";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Coffee } from "lucide-react";
import { db } from "@/lib/db"; // <--- Importamos la DB

// Esto asegura que la página siempre busque datos frescos y no use caché vieja
export const revalidate = 0;

export default async function Home() {
    // 1. CONSULTA A LA BASE DE DATOS
    const portfolios = await db.portfolio.findMany({
        orderBy: { createdAt: 'desc' }, // Los más recientes primero
        take: 9, // Traemos máximo 9 para no saturar
        include: {
            user: true // Necesitamos datos del usuario (nombre, foto por defecto)
        }
    });

    return (
        <main className="min-h-screen bg-background relative selection:bg-primary selection:text-black">

            {/* --- NAVBAR SUPERIOR --- */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/50 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black">
                        <Coffee className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden sm:block">BaristaFolio</span>
                </div>

                <div className="flex items-center gap-4">
                    <SignedOut>
                        <Link href="/sign-in">
                            <Button variant="ghost" className="hover:text-primary">Iniciar Sesión</Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button className="bg-white text-black hover:bg-white/90 font-semibold">
                                Unirse
                            </Button>
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <Link href="/dashboard">
                            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                                Ir a mi Dashboard
                            </Button>
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                    El Arte del Café, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#b8860b]">
                        Perfiles Expertos.
                    </span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
                    Descubre a los mejores baristas, tostadores y catadores.
                    Explora sus trayectorias, certificaciones y estilo único.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <SignedOut>
                        <Link href="/sign-up">
                            <Button size="lg" className="h-12 px-8 text-lg bg-primary text-black hover:bg-primary/90 rounded-full font-bold shadow-[0_0_20px_rgba(212,163,115,0.3)] hover:shadow-[0_0_30px_rgba(212,163,115,0.5)] transition-all">
                                Crear mi Portafolio Gratis
                            </Button>
                        </Link>
                        <Link href="#explore">
                            <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-white/20 hover:bg-white/10">
                                Explorar Baristas
                            </Button>
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <Link href="/dashboard">
                            <Button size="lg" className="h-12 px-8 text-lg bg-primary text-black hover:bg-primary/90 rounded-full font-bold flex items-center gap-2">
                                Gestionar mi Perfil <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </SignedIn>
                </div>
            </section>

            {/* --- GRID DE PORTAFOLIOS REALES --- */}
            <section id="explore" className="px-4 md:px-8 max-w-7xl mx-auto pb-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">Baristas Destacados</h2>
                    <span className="text-sm text-muted-foreground">Más recientes</span>
                </div>

                {portfolios.length === 0 ? (
                    // 2. ESTADO VACÍO (Si nadie se ha registrado aún)
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <p className="text-muted-foreground mb-4">Aún no hay perfiles públicos.</p>
                        <Link href="/sign-up">
                            <Button variant="link" className="text-primary">¡Sé el primero en aparecer aquí!</Button>
                        </Link>
                    </div>
                ) : (
                    // 3. MAPEO DE DATOS REALES
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {portfolios.map((portfolio) => (
                            <BaristaCard
                                key={portfolio.id}
                                name={portfolio.user.name || "Barista"}
                                slug={portfolio.slug}
                                role={portfolio.title}
                                // Prioridad de imagen: 1. Hero subido -> 2. Avatar de Clerk -> 3. Placeholder
                                imageUrl={portfolio.heroImage || portfolio.user.image || "https://images.unsplash.com/photo-1511537632536-34a74592df48?q=80&w=1000&auto=format&fit=crop"}
                                color={portfolio.primaryColor}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}