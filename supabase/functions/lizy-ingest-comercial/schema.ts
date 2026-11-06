import { z } from "npm:zod@3";

// Formato do snapshot enviado pelo coletor. Separado do index.ts para poder ser testado.
const txt = (max = 300) => z.string().max(max).nullable().optional();
const isoDateTime = z.string().datetime({ offset: true }).nullable().optional();
const isoDay = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional();
const num = z.number().finite().nullable().optional();
const id = z.union([z.string().min(1).max(100), z.number().transform(String)]);

const OrcamentoSchema = z.object({
  id_externo: id,
  numero: z.union([z.string().max(60), z.number().transform(String)]).nullable().optional(),
  status: txt(40),
  tipo_orcamento: z.number().int().nullable().optional(),
  vendedor: txt(120),
  cliente: txt(),
  valor: num,
  data_criacao: isoDateTime,
  data_finalizacao: isoDateTime,
  data_reprovacao: isoDateTime,
  data_venda: isoDateTime,
});

const NotaSchema = z.object({
  id_externo: id,
  tipo: txt(20),
  situacao: txt(40),
  cliente: txt(),
  id_cliente: txt(100),
  vendedor: txt(120),
  valor: num,
  emissao: isoDay,
});

const ClientesSchema = z.object({
  ativos: z.number().int().nullable().optional(),
  inativos: z.number().int().nullable().optional(),
  novos: z.number().int().nullable().optional(),
}).nullable().optional();

export const BodySchema = z.object({
  coletado_em: z.string().datetime({ offset: true }),
  periodo_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  periodo_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  empresas: z.array(z.object({
    empresa: z.enum(["Matriz", "Filial", "Eletronica"]),
    orcamentos: z.array(OrcamentoSchema).max(10000),
    notas: z.array(NotaSchema).max(10000),
    clientes: ClientesSchema,
  })).min(1).max(3),
});
