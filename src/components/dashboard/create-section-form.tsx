'use client'

import { createSection } from "@/actions/sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/utils/uploadthing"; // Importamos el Dropzone
import { toast } from "sonner";
import { useState } from "react";
import { FileText, Image as ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";

export const CreateSectionForm = () => {
    const [isPending, setIsPending] = useState(false);
    const [activeType, setActiveType] = useState<'text' | 'gallery'>('text');

    // Estado para guardar las URLs de las fotos subidas
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        formData.append("type", activeType);

        // Si es galería, agregamos el array de fotos como JSON
        if (activeType === 'gallery') {
            if (uploadedImages.length === 0) {
                toast.error("Sube al menos una foto para la galería");
                setIsPending(false);
                return;
            }
            formData.append("imagesJson", JSON.stringify(uploadedImages));
        }

        try {
            await createSection(formData);
            toast.success("Sección creada correctamente");

            // Resetear todo
            const form = document.getElementById("create-section-form") as HTMLFormElement;
            form.reset();
            setUploadedImages([]);
            setActiveType('text'); // Volver al default
        } catch (error) {
            toast.error("Error creando la sección");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form id="create-section-form" action={handleSubmit} className="bg-card border border-border p-6 rounded-xl space-y-6">

            {/* Selector de Tipo */}
            <div className="grid grid-cols-2 gap-4">
                <div
                    onClick={() => setActiveType('text')}
                    className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${activeType === 'text' ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 hover:border-white/30 text-muted-foreground'}`}
                >
                    <FileText className="w-6 h-6" />
                    <span className="font-medium">Texto / Bio</span>
                </div>
                <div
                    onClick={() => setActiveType('gallery')}
                    className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${activeType === 'gallery' ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 hover:border-white/30 text-muted-foreground'}`}
                >
                    <ImageIcon className="w-6 h-6" />
                    <span className="font-medium">Galería</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Título de la Sección</label>
                <Input name="title" placeholder={activeType === 'text' ? "Ej: Mi Experiencia" : "Ej: Mis Mejores Latte Art"} required />
            </div>

            {/* --- CONTENIDO DINÁMICO --- */}

            {/* CASO 1: TEXTO */}
            {activeType === 'text' && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Contenido</label>
                    <Textarea
                        name="contentText"
                        placeholder="Escribe aquí el contenido..."
                        rows={5}
                    />
                </div>
            )}

            {/* CASO 2: GALERÍA */}
            {activeType === 'gallery' && (
                <div className="space-y-4">
                    <label className="text-sm font-medium">Subir Imágenes (Máx 4)</label>

                    {/* Área de Subida */}
                    <div className="border border-dashed border-white/20 rounded-xl bg-black/20 p-4">
                        <UploadDropzone
                            endpoint="galleryImages"
                            onClientUploadComplete={(res) => {
                                if (res) {
                                    const newUrls = res.map(file => file.url);
                                    setUploadedImages(prev => [...prev, ...newUrls]);
                                    toast.success("Fotos subidas");
                                }
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`Error: ${error.message}`);
                            }}
                            appearance={{
                                container: "h-40",
                                label: "text-primary hover:text-primary/80",
                                button: "bg-primary text-black"
                            }}
                        />
                    </div>

                    {/* Previsualización de fotos subidas */}
                    {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                            {uploadedImages.map((url, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                                    <Image src={url} alt="preview" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                                        className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <Button type="submit" className="w-full font-bold bg-primary text-black hover:bg-primary/90" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                {activeType === 'text' ? 'Guardar Texto' : 'Guardar Galería'}
            </Button>
        </form>
    )
}