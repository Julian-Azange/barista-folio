'use client'

import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner"; // <--- IMPORTAMOS SONNER

interface ProfileFormProps {
    initialData: {
        title: string;
        slug: string;
        bio: string | null;
        primaryColor: string;
        heroImage: string | null;
    };
    action: (formData: FormData) => void;
}

export const ProfileForm = ({ initialData, action }: ProfileFormProps) => {
    const [imageUrl, setImageUrl] = useState<string>(initialData.heroImage || "");
    const [isPending, setIsPending] = useState(false); // Estado de carga

    // Manejador para el submit manual
    const handleSubmit = async (formData: FormData) => {
        setIsPending(true); // Activamos spinner
        try {
            await action(formData);
            toast.success("Perfil actualizado correctamente"); // ALERTA ÉXITO
        } catch (error) {
            toast.error("Hubo un error al guardar"); // ALERTA ERROR
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8">

            <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground">Foto de Portada</label>

                {imageUrl ? (
                    <div className="relative w-full h-64 rounded-xl overflow-hidden border border-white/20 group">
                        <Image
                            src={imageUrl}
                            alt="Hero Preview"
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setImageUrl("");
                                toast.info("Imagen eliminada, recuerda subir una nueva");
                            }}
                            className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="w-full h-64 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
                        <UploadButton
                            endpoint="heroImage"
                            onClientUploadComplete={(res) => {
                                if (res && res[0]) {
                                    setImageUrl(res[0].url);
                                    toast.success("¡Imagen subida con éxito!"); // ALERTA AL SUBIR FOTO
                                }
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`Error: ${error.message}`);
                            }}
                            appearance={{
                                button: "bg-primary text-black font-bold hover:bg-primary/90",
                                allowedContent: "text-muted-foreground"
                            }}
                        />
                    </div>
                )}
                <input type="hidden" name="heroImage" value={imageUrl} />
            </div>

            {/* ... (El resto de inputs Título, Slug, Bio, Color igual que antes) ... */}

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Título Profesional</label>
                    <input
                        name="title"
                        defaultValue={initialData.title}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Ej: Master Roaster"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Tu URL</label>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs md:text-sm">baristafolio.com/p/</span>
                        <input
                            name="slug"
                            defaultValue={initialData.slug}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Biografía</label>
                <textarea
                    name="bio"
                    defaultValue={initialData.bio || ""}
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Cuenta tu historia..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Color de Acento</label>
                <div className="flex items-center gap-4 p-4 border border-input rounded-lg bg-card">
                    <input
                        type="color"
                        name="primaryColor"
                        defaultValue={initialData.primaryColor}
                        className="h-10 w-16 bg-transparent border-none cursor-pointer rounded"
                    />
                    <span className="text-sm text-muted-foreground">Este color definirá tu marca personal</span>
                </div>
            </div>

            {/* Botón con estado de carga */}
            <Button type="submit" size="lg" className="w-full bg-primary text-black font-bold hover:bg-primary/90 mt-8" disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                    </>
                ) : (
                    "Guardar Cambios"
                )}
            </Button>
        </form>
    );
}