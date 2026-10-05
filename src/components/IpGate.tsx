import { useEffect, useState } from "react";
import { ShieldX, RefreshCw } from "lucide-react";

const ALLOWED_IPS = ["45.230.209.12", "170.83.211.253"];

export const IpGate = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<"checking" | "allowed" | "denied">("checking");

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((data) => {
        setStatus(ALLOWED_IPS.includes(data.ip) ? "allowed" : "denied");
      })
      .catch(() => setStatus("denied"));
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Verificando acesso…
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-card border border-border rounded-lg p-8 text-center space-y-4 shadow-xl">
          <ShieldX className="h-10 w-10 text-destructive mx-auto" />
          <h1 className="text-xl font-bold text-foreground">Acesso não autorizado</h1>
          <p className="text-sm text-muted-foreground">
            Este dashboard só pode ser acessado a partir da rede autorizada.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
