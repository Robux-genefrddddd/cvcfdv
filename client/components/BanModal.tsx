import { AlertCircle, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserBan } from "@/lib/system-notices";

interface BanModalProps {
  ban: UserBan;
}

export function BanModal({ ban }: BanModalProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
      toast.success("Déconnecté");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const isBan = ban.type === "ban";
  const expiryDate = ban.expiresAt
    ? ban.expiresAt.toDate().toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-red-500 rounded-xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-red-500/20 rounded-full">
            <AlertCircle size={32} className="text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-red-400 mb-2">
          {isBan ? "Compte Banni" : "Avertissement"}
        </h1>

        <p className="text-center text-foreground/70 text-sm mb-6">
          {isBan
            ? "Votre compte a été suspendu par les administrateurs"
            : "Vous avez reçu un avertissement"}
        </p>

        <div className="bg-white/5 border border-red-500/30 rounded-lg p-4 mb-6 space-y-4">
          <div>
            <p className="text-xs text-foreground/50 uppercase font-semibold mb-2">
              Raison
            </p>
            <p className="text-sm text-foreground break-words">{ban.reason}</p>
          </div>

          <div className="h-px bg-white/10" />

          <div>
            <p className="text-xs text-foreground/50 uppercase font-semibold mb-2">
              {isBan ? "Statut du Ban" : "Statut de l'avertissement"}
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  ban.isPermanent ? "bg-red-500" : "bg-yellow-500"
                }`}
              />
              <p className="text-sm text-foreground">
                {ban.isPermanent ? "Permanent" : "Temporaire"}
              </p>
            </div>
          </div>

          {expiryDate && !ban.isPermanent && (
            <>
              <div className="h-px bg-white/10" />
              <div>
                <p className="text-xs text-foreground/50 uppercase font-semibold mb-2">
                  Expiration
                </p>
                <p className="text-sm text-foreground">{expiryDate}</p>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-foreground/50 mb-6">
          {isBan
            ? "Vous ne pouvez pas accéder à l'application"
            : "Continuer à violer les règles pourrait entraîner un bannissement"}
        </p>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 font-semibold rounded-lg border border-red-500/50 transition-all"
        >
          <LogOut size={18} />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
