-- Comercial da Lizy (orçamentos, notas fiscais e totais de clientes) por unidade.
-- Tabelas só para service_role: dados de clientes e valores nunca chegam ao navegador;
-- a tela recebe apenas agregados pela função dashboard-data.

CREATE TABLE public.lizy_com_orcamentos (
  empresa text NOT NULL CHECK (empresa IN ('Matriz','Filial','Eletronica')),
  id_externo text NOT NULL,
  numero text,
  status text,
  tipo_orcamento int,
  vendedor text,
  cliente text,
  valor numeric,
  data_criacao timestamptz,
  data_finalizacao timestamptz,
  data_reprovacao timestamptz,
  data_venda timestamptz,
  coletado_em timestamptz NOT NULL,
  PRIMARY KEY (empresa, id_externo)
);

CREATE TABLE public.lizy_com_notas (
  empresa text NOT NULL CHECK (empresa IN ('Matriz','Filial','Eletronica')),
  id_externo text NOT NULL,
  tipo text,
  situacao text,
  cliente text,
  id_cliente text,
  vendedor text,
  valor numeric,
  emissao date,
  coletado_em timestamptz NOT NULL,
  PRIMARY KEY (empresa, id_externo)
);

CREATE TABLE public.lizy_com_clientes (
  empresa text PRIMARY KEY CHECK (empresa IN ('Matriz','Filial','Eletronica')),
  ativos int, inativos int, novos int,
  periodo_inicio date, periodo_fim date,
  coletado_em timestamptz NOT NULL
);

CREATE TABLE public.lizy_com_sync (
  empresa text PRIMARY KEY,
  ultimo_sucesso timestamptz,
  ultimo_erro text,
  ultimo_erro_em timestamptz,
  qtd_orcamentos int,
  qtd_notas int
);

CREATE TABLE public.lizy_com_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  em timestamptz NOT NULL DEFAULT now(),
  ip text, permitido boolean NOT NULL, motivo text, user_agent text
);

GRANT ALL ON public.lizy_com_orcamentos, public.lizy_com_notas, public.lizy_com_clientes,
  public.lizy_com_sync, public.lizy_com_audit TO service_role;
REVOKE ALL ON public.lizy_com_orcamentos, public.lizy_com_notas, public.lizy_com_clientes,
  public.lizy_com_sync, public.lizy_com_audit FROM anon, authenticated;

ALTER TABLE public.lizy_com_orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lizy_com_notas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lizy_com_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lizy_com_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lizy_com_audit ENABLE ROW LEVEL SECURITY;

CREATE INDEX lizy_com_orcamentos_status_idx ON public.lizy_com_orcamentos (status);
CREATE INDEX lizy_com_notas_emissao_idx ON public.lizy_com_notas (emissao);
CREATE INDEX lizy_com_audit_em_idx ON public.lizy_com_audit (em);

-- Troca atômica do snapshot de uma unidade (tudo ou nada).
CREATE OR REPLACE FUNCTION public.lizy_com_replace_snapshot(
  p_empresa text, p_orcamentos jsonb, p_notas jsonb, p_clientes jsonb,
  p_periodo_inicio date, p_periodo_fim date, p_coletado_em timestamptz
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_orc int; v_notas int;
BEGIN
  IF p_empresa IS NULL OR p_empresa NOT IN ('Matriz','Filial','Eletronica') THEN
    RAISE EXCEPTION 'empresa invalida';
  END IF;
  IF p_coletado_em IS NULL THEN RAISE EXCEPTION 'coletado_em obrigatorio'; END IF;

  DELETE FROM lizy_com_orcamentos WHERE empresa = p_empresa;
  DELETE FROM lizy_com_notas WHERE empresa = p_empresa;

  INSERT INTO lizy_com_orcamentos (empresa, id_externo, numero, status, tipo_orcamento, vendedor,
    cliente, valor, data_criacao, data_finalizacao, data_reprovacao, data_venda, coletado_em)
  SELECT p_empresa, o->>'id_externo', o->>'numero', o->>'status', (o->>'tipo_orcamento')::int,
    o->>'vendedor', o->>'cliente', (o->>'valor')::numeric,
    (o->>'data_criacao')::timestamptz, (o->>'data_finalizacao')::timestamptz,
    (o->>'data_reprovacao')::timestamptz, (o->>'data_venda')::timestamptz, p_coletado_em
  FROM jsonb_array_elements(COALESCE(p_orcamentos, '[]'::jsonb)) o
  WHERE o->>'id_externo' IS NOT NULL
  ON CONFLICT DO NOTHING;
  GET DIAGNOSTICS v_orc = ROW_COUNT;

  INSERT INTO lizy_com_notas (empresa, id_externo, tipo, situacao, cliente, id_cliente, vendedor,
    valor, emissao, coletado_em)
  SELECT p_empresa, n->>'id_externo', n->>'tipo', n->>'situacao', n->>'cliente', n->>'id_cliente',
    n->>'vendedor', (n->>'valor')::numeric, (n->>'emissao')::date, p_coletado_em
  FROM jsonb_array_elements(COALESCE(p_notas, '[]'::jsonb)) n
  WHERE n->>'id_externo' IS NOT NULL
  ON CONFLICT DO NOTHING;
  GET DIAGNOSTICS v_notas = ROW_COUNT;

  IF p_clientes IS NOT NULL AND jsonb_typeof(p_clientes) = 'object' THEN
    INSERT INTO lizy_com_clientes (empresa, ativos, inativos, novos, periodo_inicio, periodo_fim, coletado_em)
    VALUES (p_empresa, (p_clientes->>'ativos')::int, (p_clientes->>'inativos')::int,
      (p_clientes->>'novos')::int, p_periodo_inicio, p_periodo_fim, p_coletado_em)
    ON CONFLICT (empresa) DO UPDATE SET ativos = EXCLUDED.ativos, inativos = EXCLUDED.inativos,
      novos = EXCLUDED.novos, periodo_inicio = EXCLUDED.periodo_inicio,
      periodo_fim = EXCLUDED.periodo_fim, coletado_em = EXCLUDED.coletado_em;
  END IF;

  INSERT INTO lizy_com_sync (empresa, ultimo_sucesso, qtd_orcamentos, qtd_notas)
  VALUES (p_empresa, now(), v_orc, v_notas)
  ON CONFLICT (empresa) DO UPDATE SET ultimo_sucesso = EXCLUDED.ultimo_sucesso,
    qtd_orcamentos = EXCLUDED.qtd_orcamentos, qtd_notas = EXCLUDED.qtd_notas;

  RETURN jsonb_build_object('orcamentos', v_orc, 'notas', v_notas);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.lizy_com_replace_snapshot(text, jsonb, jsonb, jsonb, date, date, timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.lizy_com_replace_snapshot(text, jsonb, jsonb, jsonb, date, date, timestamptz) TO service_role;
