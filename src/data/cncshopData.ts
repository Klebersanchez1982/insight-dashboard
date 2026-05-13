export interface PropostaRecord {
  proposta: string;
  ordemServico: string;
  status: string;
  usuario: string;
  razaoSocial: string;
  cidade: string;
}

export interface MetaMensalRecord {
  mes: string;
  faturamento: number;
  meta: number;
}

const PROPOSTAS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZGPdMEgzUiby-Xh8h7V1e4Dq5g5wcnztAFlHjsqWAC2Z9ysaEpW6046-f2FAKmGBkLSlTPfcYSEi1/pub?output=csv";

const METAS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vShyk8j-D4F4BDXa55igF-IPWJ6ckcgHX_0JL330WXvYf6eRpGsFD2yVfeocRQvYV7Ipe11Zx8jJV7x/pub?output=csv";

const INFORMACOES_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vShyk8j-D4F4BDXa55igF-IPWJ6ckcgHX_0JL330WXvYf6eRpGsFD2yVfeocRQvYV7Ipe11Zx8jJV7x/pub?gid=419508041&single=true&output=csv";

export interface InformacoesData {
  importacoes: string[];
  informacoes: string[];
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") {
        result.push(current.trim());
        current = "";
      } else current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseNumber(s: string): number {
  if (!s) return 0;
  return parseFloat(s.replace(/\./g, "").replace(",", ".")) || 0;
}

export async function fetchPropostas(): Promise<PropostaRecord[]> {
  const res = await fetch(PROPOSTAS_CSV_URL);
  const text = await res.text();
  const lines = text.split("\n").filter(l => l.trim());
  return lines.slice(1).map(line => {
    const c = parseCSVLine(line);
    return {
      proposta: c[1] ?? "",
      ordemServico: c[2] ?? "",
      status: (c[3] ?? "").toUpperCase().trim(),
      usuario: c[4] ?? "",
      razaoSocial: c[5] ?? "",
      cidade: c[6] ?? "",
    };
  });
}

export async function fetchMetasMensais(): Promise<MetaMensalRecord[]> {
  const res = await fetch(METAS_CSV_URL);
  const text = await res.text();
  const lines = text.split("\n").filter(l => l.trim());
  return lines.slice(1).map(line => {
    const c = parseCSVLine(line);
    return {
      mes: (c[0] ?? "").toUpperCase().trim(),
      faturamento: parseNumber(c[1] ?? ""),
      meta: parseNumber(c[2] ?? ""),
    };
  });
}

const MESES = [
  "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
  "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO",
];

export function getMetaMesAtual(metas: MetaMensalRecord[]): MetaMensalRecord | null {
  const now = new Date();
  const mesAtual = MESES[now.getMonth()];
  return metas.find(m => m.mes === mesAtual) ?? null;
}

export function getStatusCounts(propostas: PropostaRecord[]) {
  const groups: Record<string, number> = {};
  propostas.forEach(p => {
    const s = p.status || "SEM STATUS";
    groups[s] = (groups[s] || 0) + 1;
  });
  return Object.entries(groups)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
