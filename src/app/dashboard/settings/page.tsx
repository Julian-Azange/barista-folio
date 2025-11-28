import { syncUser } from "@/lib/sync-user";
import { updateProfile } from "@/actions/update-profile";
import { ProfileForm } from "@/components/dashboard/profile-form"; // Importamos el nuevo componente
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SettingsPage() {
    const user = await syncUser();
    const portfolio = user.portfolio;

    if (!portfolio) return null;

    return (
        <div className="min-h-screen p-6 md:p-12 bg-background flex justify-center">
            <div className="w-full max-w-2xl">

                <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al Dashboard
                </Link>

                <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
                    <h1 className="text-2xl font-bold text-white mb-8">Editar Perfil</h1>

                    {/* Renderizamos el formulario cliente pasando los datos y la acción */}
                    <ProfileForm
                        initialData={portfolio}
                        action={updateProfile}
                    />

                </div>
            </div>
        </div>
    );
}