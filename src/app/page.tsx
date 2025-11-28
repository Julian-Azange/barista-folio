import { BaristaCard } from "@/components/barista-card";
import { Button } from "@/components/ui/button"; // Importamos botón de Shadcn
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"; // Componentes de Clerk
import Link from "next/link";
import { ArrowRight, Coffee } from "lucide-react";

// Datos dummy (los mantenemos por ahora mientras hay pocos usuarios reales)
const MOCK_BARISTAS = [
    {
        name: "Valentina Roa",
        slug: "valen-coffee",
        role: "Specialty Brewer",
        imageUrl: "https://images.unsplash.com/photo-1518057111178-44a106bad636?q=80&w=688&auto=format&fit=crop",
        color: "#D4A373"
    },
    {
        name: "Carlos Méndez",
        slug: "carlos-barista",
        role: "Latte Art Champion",
        imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop",
        color: "#2A9D8F"
    },
    {
        name: "Sofía Black",
        slug: "sofia-roast",
        role: "Master Roaster",
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=687&auto=format&fit=crop",
        color: "#E76F51"
    }
];

export default function Home() {
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
                    {/* Si NO está logueado, mostramos Login */}
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

                    {/* Si YA está logueado, mostramos Dashboard y Avatar */}
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
                {/* Glow Effect de fondo */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                    El Arte del Café, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#b8860b]">
                        Perfiles Expertos.
                    </span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
                    Descubre a los mejores baristas, tostadores y catadores.
                    Explora sus trayectorias, certificaciones y estilo único en una plataforma diseñada para el gremio.
                </p>

                {/* Botones de Acción Principal (CTA) */}
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

            {/* --- GRID DE PORTAFOLIOS --- */}
            <section id="explore" className="px-4 md:px-8 max-w-7xl mx-auto pb-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">Baristas Destacados</h2>
                    <span className="text-sm text-muted-foreground">Mostrando selección</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_BARISTAS.map((barista) => (
                        <BaristaCard key={barista.slug} {...barista} />
                    ))}
                </div>
            </section>
        </main>
    );
}