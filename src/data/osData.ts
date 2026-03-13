export interface OSRecord {
  numero: string;
  seq?: string;
  statusLab: string;
  statusOS: string;
  emissao: string;
  descricao: string;
  numSerie?: string;
  baseAtivo?: string;
  razaoSocial: string;
  cidade: string;
  uf: string;
  categoriaOS: string;
}

export function getStatusLabCountData(data: OSRecord[]) {
  const groups: Record<string, number> = {};
  data.forEach(os => {
    const status = os.statusLab || "SEM STATUS";
    groups[status] = (groups[status] || 0) + 1;
  });
  return Object.entries(groups)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpza0h0T--mGQ1SdcS4bkHkPjAROf08dyweBAxJ1tACGGBH2EqGZsez4UUuDLCFNTdQ8J5ehpWIB9s/pub?output=csv";

const META_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpza0h0T--mGQ1SdcS4bkHkPjAROf08dyweBAxJ1tACGGBH2EqGZsez4UUuDLCFNTdQ8J5ehpWIB9s/pub?gid=151603371&single=true&output=csv";

export interface MetaRecord {
  meta: number;
  atual: number;
}

function parseNumber(str: string): number {
  // handles "435.750,00" → 435750.00
  return parseFloat(str.replace(/\./g, "").replace(",", ".")) || 0;
}

export async function fetchMetaData(): Promise<MetaRecord> {
  const res = await fetch(META_CSV_URL);
  const text = await res.text();
  console.log("META CSV raw:", text);
  const lines = text.split("\n").filter(l => l.trim());
  if (lines.length < 2) return { meta: 0, atual: 0 };
  const cols = parseCSVLine(lines[1]);
  console.log("META parsed cols:", cols);
  const meta = parseNumber(cols[0] ?? "0");
  const atual = parseNumber(cols[1] ?? "0");
  console.log("META values:", { meta, atual, percent: meta > 0 ? (atual / meta * 100).toFixed(1) : 0 });
  return { meta, atual };
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
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

export async function fetchOSData(): Promise<OSRecord[]> {
  const res = await fetch(SHEET_CSV_URL);
  const text = await res.text();
  const lines = text.split("\n").filter(l => l.trim());
  // skip header
  return lines.slice(1).map(line => {
    const cols = parseCSVLine(line);
    return {
      numero: cols[0] ?? "",
      seq: cols[1] ?? "",
      statusLab: cols[2] ?? "",
      statusOS: cols[3] ?? "",
      emissao: cols[4] ?? "",
      descricao: cols[5] ?? "",
      razaoSocial: cols[6] ?? "",
      numSerie: cols[7] ?? "",
      baseAtivo: cols[8] ?? "",
      categoriaOS: cols[9] ?? "",
      cidade: cols[10] ?? "",
      uf: cols[11] ?? "",
    };
  });
}
