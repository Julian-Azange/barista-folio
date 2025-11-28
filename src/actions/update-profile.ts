'use server'

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const clerkUser = await currentUser();
    if (!clerkUser || !clerkUser.emailAddresses[0]) {
        throw new Error("No autorizado");
    }

    const email = clerkUser.emailAddresses[0].emailAddress;

    const dbUser = await db.user.findUnique({
        where: { email },
    });

    if (!dbUser) {
        throw new Error("Usuario no encontrado en la base de datos");
    }

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const bio = formData.get("bio") as string;
    const primaryColor = formData.get("primaryColor") as string;
    // NUEVO: Recibimos la URL de la imagen
    const heroImage = formData.get("heroImage") as string;

    await db.portfolio.upsert({
        where: { userId: dbUser.id },
        update: {
            title,
            slug,
            bio,
            primaryColor,
            heroImage, // <--- Actualizamos la imagen
        },
        create: {
            userId: dbUser.id,
            title: title || `Portafolio de ${clerkUser.firstName}`,
            slug: slug,
            bio: bio,
            primaryColor: primaryColor || "#D4A373",
            heroImage,
        },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/p/${slug}`);
    redirect("/dashboard");
}