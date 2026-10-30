export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      dashboard_cache: {
        Row: {
          body: Json
          id: string
          updated_at: string
        }
        Insert: {
          body: Json
          id: string
          updated_at?: string
        }
        Update: {
          body?: Json
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      lizy_etapa_map: {
        Row: {
          empresa: string
          etapa_origem: string
          etapa_padrao: string
          laboratorio: string | null
          ordem: number | null
        }
        Insert: {
          empresa: string
          etapa_origem: string
          etapa_padrao: string
          laboratorio?: string | null
          ordem?: number | null
        }
        Update: {
          empresa?: string
          etapa_origem?: string
          etapa_padrao?: string
          laboratorio?: string | null
          ordem?: number | null
        }
        Relationships: []
      }
      lizy_ordens: {
        Row: {
          atrasada: boolean | null
          categoria: string | null
          cliente: string | null
          coletado_em: string
          data_entrada: string | null
          data_fim: string | null
          data_prevista: string | null
          empresa: string
          equipamento: string | null
          etapa_origem: string | null
          fabricante: string | null
          id_externo: string
          modelo: string | null
          numero_ordem: number | null
          prioridade: string | null
          sigla: string | null
          status: string | null
          tipo_servico: string | null
          urgente: boolean | null
        }
        Insert: {
          atrasada?: boolean | null
          categoria?: string | null
          cliente?: string | null
          coletado_em: string
          data_entrada?: string | null
          data_fim?: string | null
          data_prevista?: string | null
          empresa: string
          equipamento?: string | null
          etapa_origem?: string | null
          fabricante?: string | null
          id_externo: string
          modelo?: string | null
          numero_ordem?: number | null
          prioridade?: string | null
          sigla?: string | null
          status?: string | null
          tipo_servico?: string | null
          urgente?: boolean | null
        }
        Update: {
          atrasada?: boolean | null
          categoria?: string | null
          cliente?: string | null
          coletado_em?: string
          data_entrada?: string | null
          data_fim?: string | null
          data_prevista?: string | null
          empresa?: string
          equipamento?: string | null
          etapa_origem?: string | null
          fabricante?: string | null
          id_externo?: string
          modelo?: string | null
          numero_ordem?: number | null
          prioridade?: string | null
          sigla?: string | null
          status?: string | null
          tipo_servico?: string | null
          urgente?: boolean | null
        }
        Relationships: []
      }
      lizy_sync: {
        Row: {
          empresa: string
          qtd_ordens: number | null
          qtd_tecnicos: number | null
          ultimo_erro: string | null
          ultimo_erro_em: string | null
          ultimo_sucesso: string | null
        }
        Insert: {
          empresa: string
          qtd_ordens?: number | null
          qtd_tecnicos?: number | null
          ultimo_erro?: string | null
          ultimo_erro_em?: string | null
          ultimo_sucesso?: string | null
        }
        Update: {
          empresa?: string
          qtd_ordens?: number | null
          qtd_tecnicos?: number | null
          ultimo_erro?: string | null
          ultimo_erro_em?: string | null
          ultimo_sucesso?: string | null
        }
        Relationships: []
      }
      lizy_tecnicos: {
        Row: {
          coletado_em: string
          em_andamento: number | null
          empresa: string
          etapas_concluidas: number | null
          etapas_participadas: number | null
          horas: number | null
          horas_media_ordem: number | null
          periodo_fim: string | null
          periodo_inicio: string | null
          tecnico: string
        }
        Insert: {
          coletado_em: string
          em_andamento?: number | null
          empresa: string
          etapas_concluidas?: number | null
          etapas_participadas?: number | null
          horas?: number | null
          horas_media_ordem?: number | null
          periodo_fim?: string | null
          periodo_inicio?: string | null
          tecnico: string
        }
        Update: {
          coletado_em?: string
          em_andamento?: number | null
          empresa?: string
          etapas_concluidas?: number | null
          etapas_participadas?: number | null
          horas?: number | null
          horas_media_ordem?: number | null
          periodo_fim?: string | null
          periodo_inicio?: string | null
          tecnico?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      lizy_replace_snapshot: {
        Args: {
          p_coletado_em: string
          p_empresa: string
          p_ordens: Json
          p_periodo_fim: string
          p_periodo_inicio: string
          p_tecnicos: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
