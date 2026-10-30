CREATE TABLE public.lizy_ordens (
  empresa text NOT NULL CHECK (empresa IN ('Matriz','Filial','Eletronica')),
  id_externo text NOT NULL,
  numero_ordem int, sigla text, cliente text, etapa_origem text, status text,
  data_entrada timestamptz, data_prevista timestamptz, data_fim timestamptz,
  atrasada boolean, urgente boolean, tipo_servico text, categoria text,
  fabricante text, equipamento text, modelo text, prioridade text,
  coletado_em timestamptz NOT NULL,
  PRIMARY KEY (empresa, id_externo)
);
CREATE TABLE public.lizy_tecnicos (
  empresa text NOT NULL, tecnico text NOT NULL,
  etapas_concluidas int, etapas_participadas int, horas numeric, horas_media_ordem numeric,
  em_andamento int, periodo_inicio timestamptz, periodo_fim timestamptz,
  coletado_em timestamptz NOT NULL,
  PRIMARY KEY (empresa, tecnico)
);
CREATE TABLE public.lizy_sync (
  empresa text PRIMARY KEY, ultimo_sucesso timestamptz, ultimo_erro text,
  ultimo_erro_em timestamptz, qtd_ordens int, qtd_tecnicos int
);
CREATE TABLE public.lizy_etapa_map (
  empresa text NOT NULL, etapa_origem text NOT NULL, etapa_padrao text NOT NULL,
  laboratorio text, ordem int, PRIMARY KEY (empresa, etapa_origem)
);
GRANT ALL ON public.lizy_ordens, public.lizy_tecnicos, public.lizy_sync, public.lizy_etapa_map TO service_role;
ALTER TABLE public.lizy_ordens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lizy_tecnicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lizy_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lizy_etapa_map ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.lizy_replace_snapshot(
  p_empresa text, p_ordens jsonb, p_tecnicos jsonb,
  p_periodo_inicio timestamptz, p_periodo_fim timestamptz, p_coletado_em timestamptz)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_o int; v_t int;
BEGIN
  IF p_empresa NOT IN ('Matriz','Filial','Eletronica') THEN
    RAISE EXCEPTION 'empresa invalida';
  END IF;
  DELETE FROM lizy_ordens WHERE empresa = p_empresa;
  DELETE FROM lizy_tecnicos WHERE empresa = p_empresa;
  INSERT INTO lizy_ordens (empresa, id_externo, numero_ordem, sigla, cliente, etapa_origem, status,
    data_entrada, data_prevista, data_fim, atrasada, urgente, tipo_servico, categoria,
    fabricante, equipamento, modelo, prioridade, coletado_em)
  SELECT p_empresa, x->>'id_externo', (x->>'numero_ordem')::int, x->>'sigla_tipo_servico', x->>'nome_cliente',
    x->>'etapa_atual_nome', x->>'status', (x->>'data_entrada')::timestamptz,
    (x->>'data_prevista_entrega')::timestamptz, (x->>'data_fim')::timestamptz,
    (x->>'atrasada')::boolean, (x->>'urgente')::boolean, x->>'nome_tipo_servico',
    x->>'nome_categoria_equipamento', x->>'fabricante', x->>'equipamento', x->>'modelo',
    x->>'prioridade', p_coletado_em
  FROM jsonb_array_elements(COALESCE(p_ordens,'[]'::jsonb)) x
  ON CONFLICT (empresa, id_externo) DO NOTHING;
  GET DIAGNOSTICS v_o = ROW_COUNT;
  INSERT INTO lizy_tecnicos (empresa, tecnico, etapas_concluidas, etapas_participadas, horas,
    horas_media_ordem, em_andamento, periodo_inicio, periodo_fim, coletado_em)
  SELECT p_empresa, x->>'nome_tecnico', (x->>'ordens_finalizadas')::int, (x->>'etapas_participadas')::int,
    (x->>'tempo_trabalhado_horas')::numeric, (x->>'tempo_medio_ordem_horas')::numeric,
    (x->>'em_andamento')::int, p_periodo_inicio, p_periodo_fim, p_coletado_em
  FROM jsonb_array_elements(COALESCE(p_tecnicos,'[]'::jsonb)) x
  ON CONFLICT (empresa, tecnico) DO NOTHING;
  GET DIAGNOSTICS v_t = ROW_COUNT;
  INSERT INTO lizy_sync (empresa, ultimo_sucesso, qtd_ordens, qtd_tecnicos)
  VALUES (p_empresa, now(), v_o, v_t)
  ON CONFLICT (empresa) DO UPDATE SET ultimo_sucesso = EXCLUDED.ultimo_sucesso,
    qtd_ordens = EXCLUDED.qtd_ordens, qtd_tecnicos = EXCLUDED.qtd_tecnicos;
  RETURN jsonb_build_object('ordens', v_o, 'tecnicos', v_t);
END $$;
REVOKE EXECUTE ON FUNCTION public.lizy_replace_snapshot(text, jsonb, jsonb, timestamptz, timestamptz, timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.lizy_replace_snapshot(text, jsonb, jsonb, timestamptz, timestamptz, timestamptz) TO service_role;