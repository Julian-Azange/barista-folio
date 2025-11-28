import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs/server";

const f = createUploadthing();

// Middleware de autenticación mejorado
const handleAuth = async () => {
    try {
        const user = await currentUser();

        if (!user) {
            console.error("❌ UploadThing: No hay usuario logueado o token inválido.");
            throw new Error("Unauthorized");
        }

        // Retornamos el ID para usarlo en onUploadComplete
        // Es vital retornar un objeto aquí
        return { userId: user.id };

    } catch (error) {
        console.error("❌ Error en middleware de auth:", error);
        throw error;
    }
};

export const ourFileRouter = {
    // 1. Ruta para la imagen Hero
    heroImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => await handleAuth()) // Aseguramos que espere la auth
        .onUploadComplete(async ({ metadata, file }) => {
            // Este código corre en el SERVIDOR cuando termina la subida
            console.log("✅ Subida Hero Completada");
            console.log("   User ID:", metadata.userId);
            console.log("   File URL:", file.url);

            // Aquí NO retornamos nada al cliente, solo logueamos
        }),

    // 2. Ruta para la Galería
    galleryImages: f({ image: { maxFileSize: "8MB", maxFileCount: 4 } })
        .middleware(async () => await handleAuth())
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("✅ Subida Galería Completada");
            console.log("   User ID:", metadata.userId);
            console.log("   File URL:", file.url);
        }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;