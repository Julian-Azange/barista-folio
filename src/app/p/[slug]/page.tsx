import { db } from "@/lib/db";
import { PortfolioHero } from "@/components/portfolio/hero";
import { SectionRenderer } from "@/components/portfolio/section-renderer";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
    params: { slug: string }
}

// 1. Generar Metadata dinámica para SEO (Título de la pestaña)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params; // Await necesario en Next 15

    const portfolio = await db.portfolio.findUnique({
        where: { slug: slug },
        include: { user: true }
    });

    if (!portfolio) return { title: "Barista No Encontrado" };

    return {
        title: `${portfolio.title} | Barista Folio`,
        description: portfolio.bio || `Portafolio de ${portfolio.user.name}`,
    }
}

// 2. Componente de Página
export default async function PortfolioPage({ params }: PageProps) {
    const { slug } = await params;

    const portfolio = await db.portfolio.findUnique({
        where: { slug: slug },
        include: {
            user: true,
            sections: {
                orderBy: { order: 'asc' }
            }
        }
    });

    if (!portfolio) return notFound();

    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden">

            <PortfolioHero
                name={portfolio.user.name || "Barista"}
                role={portfolio.title}
                bio={portfolio.bio || ""}
                image={portfolio.heroImage || portfolio.user.image || "/placeholder.jpg"}
                color={portfolio.primaryColor}
            />

            {/* --- AQUÍ ESTÁ EL CAMBIO PRINCIPAL --- */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">

                {/* Usamos CSS Grid: 1 columna en móvil, 2 columnas en PC */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {portfolio.sections.length > 0 ? (
                        portfolio.sections.map((section) => (
                            <SectionRenderer
                                key={section.id}
                                title={section.title}
                                type={section.type}
                                content={section.content}
                                primaryColor={portfolio.primaryColor}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-muted-foreground opacity-50">
                            <p>Este barista aún no ha agregado secciones.</p>
                        </div>
                    )}

                </div>
            </div>

        </main>
    );
}