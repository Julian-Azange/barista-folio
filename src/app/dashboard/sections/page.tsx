import { syncUser } from "@/lib/sync-user";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, FileText, Image as ImageIcon } from "lucide-react";
import { deleteSection } from "@/actions/sections";
import { CreateSectionForm } from "@/components/dashboard/create-section-form"; // Crearemos esto en el paso 3

export default async function SectionsPage() {
    const user = await syncUser();
    const portfolio = user.portfolio;

    if (!portfolio) return null;

    // Obtenemos las secciones existentes
    const sections = await db.section.findMany({
        where: { portfolioId: portfolio.id },
        orderBy: { createdAt: 'asc' } // Las más viejas primero
    });

    return (
        <div className="min-h-screen p-6 md:p-12 bg-background flex justify-center">
            <div className="w-full max-w-3xl space-y-8">

                {/* Header con navegación */}
                <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Dashboard
                    </Link>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white">Gestionar Secciones</h1>
                    <p className="text-muted-foreground">Agrega bloques de contenido para construir tu historia.</p>
                </div>

                {/* LISTA DE SECCIONES EXISTENTES */}
                <div className="space-y-4">
                    {sections.length === 0 ? (
                        <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-muted-foreground bg-white/5">
                            No tienes secciones creadas aún. ¡Agrega la primera!
                        </div>
                    ) : (
                        sections.map((section) => (
                            <div key={section.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        {section.type === 'text' ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{section.title}</h3>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{section.type}</p>
                                    </div>
                                </div>

                                {/* Botón de Eliminar (Server Action Inline) */}
                                <form action={async () => {
                                    'use server'
                                    await deleteSection(section.id)
                                }}>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        ))
                    )}
                </div>

                {/* COMPONENTE PARA CREAR NUEVA (Formulario) */}
                <div className="pt-8 border-t border-white/10">
                    <h2 className="text-xl font-bold text-white mb-6">Agregar Nueva Sección</h2>
                    <CreateSectionForm />
                </div>

            </div>
        </div>
    );
}