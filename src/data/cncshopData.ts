import { supabase } from "@/integrations/supabase/client";

export interface DashboardData {
  kpis: {
    abertas: number;
    pedidosMatriz: number;
    pedidosEletronica: number;
    pedidosFilial: number;
  };

  statusCounts: { name: string; value: number }[];
  metaPctMin: number;
  importacoes: string[];
  pendencias: string[];
  /** Comercial vindo da Lizy (comparação com as planilhas). null enquanto não houver dados. */
  lizy?: LizyComercial | null;
}

export interface LizyComercial {
  atualizadoEm: string | null;
  desatualizado: boolean;
  semDados: boolean;
  propostasAbertas: number;
  propostasAbertasValor: number;
  statusEquipe: { name: string; value: number }[];
  pedidos: { matriz: number; eletronica: number; filial: number };
  faturamentoMes: number;
  faturamentoPorUnidade: { matriz: number; eletronica: number; filial: number };
  notasMes: number;
  clientes: { novos: number; ativos: number };
  topClientes: { nome: string; valor: number }[];
}

export class AccessDeniedError extends Error {}

export async function fetchDashboard(): Promise<DashboardData> {
  const { data, error } = await supabase.functions.invoke("dashboard-data");
  if (error) {
    const status = (error as { context?: Response }).context?.status;
    if (status === 403) throw new AccessDeniedError("forbidden");
    throw error;
  }
  if (data && (data as { forbidden?: boolean }).forbidden) throw new AccessDeniedError("forbidden");
  return data as DashboardData;
}
