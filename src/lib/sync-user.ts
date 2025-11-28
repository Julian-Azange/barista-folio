import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const syncUser = async () => {
    // 1. Obtener usuario autenticado de Clerk
    const user = await currentUser();

    // Si no hay usuario logueado, lo mandamos al login
    if (!user || !user.emailAddresses[0]) {
        return redirect("/sign-in");
    }

    const email = user.emailAddresses[0].emailAddress;

    // 2. Verificar si ya existe en NUESTRA base de datos
    const existingUser = await db.user.findUnique({
        where: { email },
        include: { portfolio: true },
    });

    // Si existe, lo devolvemos y terminamos
    if (existingUser) return existingUser;

    // 3. Si NO existe, lo creamos (Onboarding automático)

    // Generamos un slug base: "juan-perez"
    const baseSlug = (user.firstName + "-" + (user.lastName || "")).toLowerCase().replace(/\s+/g, '-');
    // Le agregamos caracteres random para evitar duplicados: "juan-perez-xf21"
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    const newUser = await db.user.create({
        data: {
            email,
            name: `${user.firstName} ${user.lastName || ""}`.trim(),
            image: user.imageUrl,
            // Creamos automáticamente un portafolio vacío
            portfolio: {
                create: {
                    title: `Portafolio de ${user.firstName}`,
                    slug: uniqueSlug,
                    primaryColor: "#D4A373", // Color default (Café)
                    bio: "¡Hola! Soy un apasionado del café...",
                }
            }
        },
        include: { portfolio: true }
    });

    return newUser;
};