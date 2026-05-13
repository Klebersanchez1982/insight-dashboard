import { useState, useEffect, FormEvent } from "react";
import { Lock } from "lucide-react";
import logo from "@/assets/logo.png";

const PASSWORD = "cncshop2026";
const STORAGE_KEY = "cncshop_auth";

export const PasswordGate = ({ children }: { children: React.ReactNode }) => {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") setAuthed(true);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-card border border-border rounded-lg p-8 space-y-6 shadow-xl"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="bg-white rounded-md px-3 py-2">
            <img src={logo} alt="CNCShop" className="h-12" />
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">CNCSHOP</h1>
          <p className="text-sm text-muted-foreground">Acesso restrito</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="pwd" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Lock className="h-4 w-4" /> Senha
          </label>
          <input
            id="pwd"
            type="password"
            autoFocus
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Digite a senha"
          />
          {error && <p className="text-sm text-destructive">Senha incorreta</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2 rounded-md transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};
