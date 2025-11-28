'use client'

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SectionProps {
    title: string;
    type: string;
    content: any;
    primaryColor: string;
}

export const SectionRenderer = ({ title, type, content, primaryColor }: SectionProps) => {

    // --- 1. DISEÑO PARA TEXTO (TARJETA COMPACTA) ---
    if (type === 'text') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                // "h-full" hace que si una tarjeta tiene poco texto y la de al lado mucho, ambas midan lo mismo
                className="h-full"
            >
                <div className="h-full bg-card/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:border-white/20 transition-all duration-300 group flex flex-col">

                    {/* Título pequeño y elegante */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-1 w-8 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-primary transition-colors" style={{ '--primary': primaryColor } as any}>
                            {title}
                        </h3>
                    </div>

                    {/* Texto */}
                    <div className="prose prose-invert prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed whitespace-pre-line flex-grow">
                        {content.text}
                    </div>
                </div>
            </motion.div>
        );
    }

    // --- 2. DISEÑO PARA GALERÍA (FULL WIDTH) ---
    if (type === 'gallery') {
        const images = content.images || [];

        return (
            // La clase "md:col-span-2" hace que la galería rompa la fila y ocupe todo el ancho
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="md:col-span-2 py-8"
            >
                <div className="flex items-center gap-4 mb-8 justify-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white relative inline-block">
                        {title}
                        <span className="absolute -bottom-2 left-0 w-full h-1 rounded-full opacity-50" style={{ backgroundColor: primaryColor }} />
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] md:h-[500px]">
                    {images.map((img: string, idx: number) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            className={cn(
                                "relative rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-card",
                                // Lógica para mosaico interesante:
                                // Si hay 3 fotos o más: la primera es grande
                                images.length >= 3 && idx === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-1"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`Gallery ${idx}`}
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    }

    return null;
};