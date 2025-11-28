'use client'

import { motion } from "framer-motion";
import Image from "next/image";
import { Coffee, Instagram, Linkedin, Twitter } from "lucide-react";

interface PortfolioHeroProps {
    name: string;
    role: string;
    bio: string;
    image: string;
    color: string; // El color personalizado del barista
}

export const PortfolioHero = ({ name, role, bio, image, color }: PortfolioHeroProps) => {
    return (
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Fondo con degradado dinámico basado en el color del usuario */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    background: `radial-gradient(circle at 70% 30%, ${color}, transparent 60%)`
                }}
            />

            <div className="container px-4 md:px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">

                {/* Texto e Información */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-left space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/80">
                        <Coffee className="w-4 h-4" style={{ color }} />
                        <span>{role}</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[1.1]">
                        Hola, soy <br />
                        <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, #fff, ${color})` }}>
                            {name}
                        </span>
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                        {bio}
                    </p>

                    <div className="flex gap-4 pt-4">
                        {/* Botones sociales dummies */}
                        {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                            <button key={i} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-white">
                                <Icon className="w-5 h-5" />
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Imagen Principal (Hero Image) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    {/* Círculo decorativo detrás */}
                    <div
                        className="absolute inset-0 blur-[80px] -z-10 rounded-full opacity-30"
                        style={{ backgroundColor: color }}
                    />

                    <div className="relative aspect-square md:aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}