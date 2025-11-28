'use server'

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createSection(formData: FormData) {
    const user = await currentUser();
    if (!user || !user.emailAddresses[0]) throw new Error("No autorizado");

    const email = user.emailAddresses[0].emailAddress;

    const dbUser = await db.user.findUnique({
        where: { email },
        include: { portfolio: true }
    });

    if (!dbUser?.portfolio) throw new Error("Portafolio no encontrado");

    const title = formData.get("title") as string;
    const type = formData.get("type") as string;

    // Estructuramos el contenido JSON según el tipo
    let contentJson = {};

    if (type === 'text') {
        const contentText = formData.get("contentText") as string;
        contentJson = { text: contentText };
    }
    else if (type === 'gallery') {
        // Recibimos las URLs de las fotos como un string JSON
        const imagesJson = formData.get("imagesJson") as string;
        contentJson = { images: JSON.parse(imagesJson || "[]") };
    }

    await db.section.create({
        data: {
            portfolioId: dbUser.portfolio.id,
            title,
            type,
            content: contentJson,
            order: 0,
        }
    });

    revalidatePath("/dashboard/sections");
    revalidatePath(`/p/${dbUser.portfolio.slug}`);
}

export async function deleteSection(sectionId: string) {
    const user = await currentUser();
    if (!user) throw new Error("No autorizado");

    await db.section.delete({
        where: { id: sectionId }
    });

    revalidatePath("/dashboard/sections");
}