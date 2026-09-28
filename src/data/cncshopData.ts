import { supabase } from "@/integrations/supabase/client";

export interface DashboardData {
  kpis: { abertas: number; pedidosAbertos: number; enviadas: number };
  statusCounts: { name: string; value: number }[];
  metaPctMin: number;
  importacoes: string[];
  pendencias: string[];
}

export class AccessDeniedError extends Error {}

export async function fetchDashboard(): Promise<DashboardData> {
  const { data, error } = await supabase.functions.invoke("dashboard-data");
  if (error) {
    const status = (error as { context?: Response }).context?.status;
    if (status === 403) throw new AccessDeniedError("forbidden");
    throw error;
  }
  return data as DashboardData;
}
