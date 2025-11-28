import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Exportamos las funciones GET y POST para que Next.js sepa responder
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
});