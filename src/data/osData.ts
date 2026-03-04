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
