import { UserButton } from "@clerk/nextjs";
import { syncUser } from "@/lib/sync-user"; // <--- Importante: Esto conecta la DB
import { ExternalLink, Edit, Palette, FileText } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
    // 1. Buscamos o creamos el usuario en la DB real
    const user = await syncUser();
    const portfolio = user.portfolio;

    if (!portfolio) return <div>Cargando perfil...</div>;

    // Usamos localhost en desarrollo, luego será tu dominio real
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return (
        <div className="min-h-screen p-6 md:p-12 bg-background text-foreground">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* Header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
                        <p className="text-muted-foreground mt-1">
                            Bienvenido, {user.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-card p-2 rounded-full border border-border shadow-sm">
                        <span className="text-sm font-medium px-3 text-muted-foreground">Tu cuenta</span>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </header>

                {/* Status Card */}
                <section className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-background to-background border border-primary/20 p-8 shadow-2xl">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-2">Tu Portafolio está activo</h2>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                Tu perfil es visible públicamente.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Botón REAL hacia tu slug */}
                                <Link
                                    href={`/p/${portfolio.slug}`}
                                    target="_blank"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Ver Página Pública
                                </Link>

                                <div className="flex items-center gap-2 px-4 py-3 bg-background/50 backdrop-blur rounded-xl border border-white/10 text-sm font-mono text-muted-foreground">
                                    {baseUrl}/p/{portfolio.slug}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-card border border-border p-8 flex flex-col justify-center items-center text-center shadow-lg">
                        <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4 text-secondary-foreground">
                            <Palette className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold">Personalización</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            Color actual: <span style={{ color: portfolio.primaryColor }}>● {portfolio.primaryColor}</span>
                        </p>
                    </div>
                </section>

                {/* Botones de Acción */}
                <section>
                    <h3 className="text-xl font-semibold mb-6">Gestionar Contenido</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* ESTE BOTÓN AHORA LLEVARÁ A LA PÁGINA QUE CREAREMOS */}
                        <Link href="/dashboard/settings" className="group">
                            <div className="h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer group-hover:shadow-lg group-hover:shadow-primary/5">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                                    <Edit className="w-5 h-5" />
                                </div>
                                <h4 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">Editar Perfil</h4>
                                <p className="text-sm text-muted-foreground">Edita tu nombre, bio y URL personalizada.</p>
                            </div>
                        </Link>
                        <Link href="/dashboard/sections" className="group">
                            <div className="h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer group-hover:shadow-lg group-hover:shadow-primary/5">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h4 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">Secciones</h4>
                                <p className="text-sm text-muted-foreground">Agrega experiencia, galerías y más contenido.</p>
                            </div>
                        </Link>

                    </div>
                </section>
            </div>
        </div>
    );
}