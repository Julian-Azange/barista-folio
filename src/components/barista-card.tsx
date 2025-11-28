'use client'

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BaristaCardProps {
    name: string;
    slug: string;
    role: string;
    imageUrl: string; // Imagen de perfil o hero
    color: string; // Color personalizado del usuario
}

export const BaristaCard = ({ name, slug, role, imageUrl, color }: BaristaCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-2xl bg-card border border-white/10 shadow-lg"
        >
            {/* Background Gradient sutil basado en el color del usuario */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{ background: `linear-gradient(to top, ${color}, transparent)` }}
            />

            <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay oscuro para leer texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute bottom-0 p-6 w-full">
                    <p className="text-sm font-medium text-primary mb-1 tracking-wider uppercase">
                        {role}
                    </p>
                    <h3 className="text-2xl font-bold text-white mb-4 font-sans">
                        {name}
                    </h3>

                    <Link href={`/p/${slug}`} className="block w-full">
                        <button
                            className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all"
                        >
                            <span className="text-sm font-medium">Ver Portafolio</span>
                            <ArrowRight className="w-4 h-4 text-primary" />
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};