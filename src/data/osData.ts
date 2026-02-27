export interface OSRecord {
  numero: number;
  seq?: number;
  statusLab: string;
  statusOS: string;
  emissao: string;
  tipoOS: string;
  descricao: string;
  numSerie?: string;
  razaoSocial: string;
  cidade: string;
  uf: string;
  categoriaOS: string;
  tecnico: string;
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

export const osData: OSRecord[] = [
  { numero: 702, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "", emissao: "2/12/26", tipoOS: "OS com Faturamento", descricao: "DRIVE BETA FANUC A06B-6093-H112", razaoSocial: "WEG CESTARI REDUTORES E MOTORREDUTORES SA", cidade: "MONTE ALTO", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Felipe" },
  { numero: 701, statusLab: "EQUIPAMENTO EM TESTE FINAL", statusOS: "", emissao: "2/11/26", tipoOS: "OS sem Faturamento", descricao: "ACIONAMENTO TMC-14-230-12-20-3.0/11", razaoSocial: "MOCDROL HIDRAULICA LTDA", cidade: "MOCOCA", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Kaue" },
  { numero: 700, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "2/10/26", tipoOS: "OS com Faturamento", descricao: "DRIVE SIMODRIVE 160A SIEMENS", razaoSocial: "ZANINI RENK EQUIPAMENTOS INDUSTRIAIS LTDA", cidade: "CRAVINHOS", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Marcelo" },
  { numero: 699, statusLab: "DESCONTAMINAÇÃO DO EQUIPAMENTO", statusOS: "", emissao: "2/10/26", tipoOS: "OS com Faturamento", descricao: "SIMODRIVE SIEMENS 50A", razaoSocial: "ZANINI RENK EQUIPAMENTOS INDUSTRIAIS LTDA", cidade: "CRAVINHOS", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Erickson" },
  { numero: 698, statusLab: "EQUIPAMENTO EM TESTE FINAL", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "2/10/26", tipoOS: "OS com Faturamento", descricao: "DRIVE SPINDLE FANUC A06B-6141-H011", razaoSocial: "TRANSCONTROL COM IND DE PROD ELETRONICOS LTDA", cidade: "RIO DE JANEIRO", uf: "RJ", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Gabriel" },
  { numero: 697, statusLab: "EQUIPAMENTO EM TESTE FINAL", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "2/10/26", tipoOS: "OS com Faturamento", descricao: "FONTE FANUC A06B-6110-H011", razaoSocial: "TRANSCONTROL COM IND DE PROD ELETRONICOS LTDA", cidade: "RIO DE JANEIRO", uf: "RJ", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Leonardo" },
  { numero: 696, statusLab: "EQUIPAMENTO EM TESTE FINAL", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "2/10/26", tipoOS: "OS com Faturamento", descricao: "DRIVE ALFA I FANUC A06B-6114-H303", razaoSocial: "TRANSCONTROL COM IND DE PROD ELETRONICOS LTDA", cidade: "RIO DE JANEIRO", uf: "RJ", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Felipe" },
  { numero: 695, statusLab: "EMBALAGEM/EXPEDIÇÃO - EMBALADO", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "2/10/26", tipoOS: "OS com Faturamento", descricao: "PLACA DE POTENCIA LP25A", razaoSocial: "BMA BORRACHAS MONTE ALTO LTDA", cidade: "MONTE ALTO", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Kaue" },
  { numero: 694, statusLab: "EQUIP. SEM DEFEITO DEVOLVER AO CLIENTE", statusOS: "1 - URGENTE", emissao: "2/9/26", tipoOS: "OS com Faturamento", descricao: "DRIVE DUPLOMATIC TMC-14-230-12-20-3.0/10", razaoSocial: "MOCDROL HIDRAULICA LTDA", cidade: "MOCOCA", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Giovane" },
  { numero: 693, statusLab: "EMBALAGEM/EXPEDIÇÃO - PRONTO", statusOS: "2 - APROVADO", emissao: "2/9/26", tipoOS: "OS com Faturamento", descricao: "FONTE SITOP 10 A 6EP1334-3BA00", razaoSocial: "MOCDROL HIDRAULICA LTDA", cidade: "MOCOCA", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Marcelo" },
  { numero: 692, statusLab: "AGUARDANDO FORNECEDOR", statusOS: "1 - URGENTE", emissao: "2/9/26", tipoOS: "OS com Faturamento", descricao: "DRIVE DUPLOMATIC TMC-14-400-12-20-3.0/11", razaoSocial: "MOCDROL HIDRAULICA LTDA", cidade: "MOCOCA", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Erickson" },
  { numero: 691, statusLab: "EQUIPAMENTOS SEM REPARO", statusOS: "", emissao: "2/9/26", tipoOS: "OS com Faturamento", descricao: "PLACA I/O SIEMENS 828D", razaoSocial: "RENTEK CNC ASSISTANCE MANUTENCOES LTDA", cidade: "BELO HORIZONTE", uf: "MG", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Gabriel" },
  { numero: 690, statusLab: "", statusOS: "", emissao: "2/9/26", tipoOS: "OS com Faturamento", descricao: "CPU CCU 3 V 6.5", razaoSocial: "RENTEK CNC ASSISTANCE MANUTENCOES LTDA", cidade: "BELO HORIZONTE", uf: "MG", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Leonardo" },
  { numero: 686, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "2/6/26", tipoOS: "OS com Faturamento", descricao: "DRIVE FANUC A06B-6222-H030", razaoSocial: "METALKRAFT S/A SISTEMAS AUTOMOTIVOS", cidade: "QUATRO BARRAS", uf: "PR", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Felipe" },
  { numero: 685, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "", emissao: "2/6/26", tipoOS: "OS com Faturamento", descricao: "TECLADO HEIDENHAIN TE-535M", razaoSocial: "HBA HUTCHINSON BRASIL AUTOMOTIVE LTDA", cidade: "MONTE ALTO", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Kaue" },
  { numero: 684, statusLab: "EM AVALIAÇÃO - CONFIRMANDO DEFEITO", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "2/5/26", tipoOS: "OS com Faturamento", descricao: "CNC FANUC FS16I-MB", razaoSocial: "LOPSA INDUSTRIA E COMERCIO DE TORNEADOS LTDA", cidade: "SAO PAULO", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Giovane" },
  { numero: 682, statusLab: "INICIO DE TESTE EM BANCADA", statusOS: "", emissao: "2/4/26", tipoOS: "OS sem Faturamento", descricao: "DRIVE FANUC ALFA A06B-6096-H206", razaoSocial: "THERMOVAL INDUSTRIA DE VALVULAS LTDA", cidade: "CRAVINHOS", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Marcelo" },
  { numero: 681, statusLab: "EMBALAGEM/EXPEDIÇÃO - EMBALADO", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "2/4/26", tipoOS: "OS com Faturamento", descricao: "SERVO AMPLIFICADOR FANUC 40/40HV-B", razaoSocial: "IOCHPE MAXION SA", cidade: "LIMEIRA", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Erickson" },
  { numero: 680, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "2/4/26", tipoOS: "OS com Faturamento", descricao: "SERVO MOTOR A06B-0041-B605", razaoSocial: "NEO RODAS SA", cidade: "VINHEDO", uf: "SP", categoriaOS: "LABORATÓRIO DE SERVOMOTORES", tecnico: "Gabriel" },
  { numero: 679, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "2/4/26", tipoOS: "OS com Faturamento", descricao: "FONTE OKUMA MPS45", razaoSocial: "NEO RODAS SA", cidade: "VINHEDO", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Leonardo" },
  { numero: 678, statusLab: "EMBALAGEM/EXPEDIÇÃO - PRONTO", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "2/4/26", tipoOS: "OS com Faturamento", descricao: "MODULO FANUC A03B-0819-C011", razaoSocial: "NEO RODAS SA", cidade: "VINHEDO", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Felipe" },
  { numero: 677, statusLab: "EMBALAGEM/EXPEDIÇÃO - PRONTO", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "2/4/26", tipoOS: "OS com Faturamento", descricao: "FONTE FANUC A06B-6120-H045", razaoSocial: "NEO RODAS SA", cidade: "VINHEDO", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Kaue" },
  { numero: 676, statusLab: "EMBALAGEM/EXPEDIÇÃO - PRONTO", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "2/4/26", tipoOS: "OS com Faturamento", descricao: "FONTE FANUC A06B-6120-H045", razaoSocial: "NEO RODAS SA", cidade: "VINHEDO", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Giovane" },
  { numero: 675, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "", emissao: "2/4/26", tipoOS: "OS com Faturamento", descricao: "DRIVE OKUMA MIV0204S-1-B5", razaoSocial: "NEO RODAS SA", cidade: "VINHEDO", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Marcelo" },
  { numero: 674, statusLab: "EMBALAGEM/EXPEDIÇÃO - PRONTO", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "2/4/26", tipoOS: "OS com Faturamento", descricao: "MODULO I/O FANUC A03B-0819-C161", razaoSocial: "NEO RODAS SA", cidade: "VINHEDO", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Erickson" },
  { numero: 673, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "", emissao: "2/4/26", tipoOS: "OS sem Faturamento", descricao: "DRIVE OKUMA BL2-D100A", razaoSocial: "MANGELS INDUSTRIAL SA", cidade: "TRES CORACOES", uf: "MG", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Gabriel" },
  { numero: 672, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "", emissao: "2/4/26", tipoOS: "OS sem Faturamento", descricao: "DRIVE OKUMA BL2 -75A", razaoSocial: "MANGELS INDUSTRIAL SA", cidade: "TRES CORACOES", uf: "MG", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Leonardo" },
  { numero: 671, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "", emissao: "2/4/26", tipoOS: "OS com Faturamento", descricao: "DRIVE OKUMA BL2 -75/75A", razaoSocial: "MANGELS INDUSTRIAL SA", cidade: "TRES CORACOES", uf: "MG", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Felipe" },
  { numero: 670, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "", emissao: "2/4/26", tipoOS: "OS sem Faturamento", descricao: "DRIVE OKUMA BL2 -75/75A", razaoSocial: "MANGELS INDUSTRIAL SA", cidade: "TRES CORACOES", uf: "MG", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Kaue" },
  { numero: 669, statusLab: "EQUIPAMENTO EM TESTE FINAL", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "2/4/26", tipoOS: "OS com Faturamento", descricao: "FONTE FANUC AIPS 26", razaoSocial: "REI AUTO PARTS INDUSTRIA E COMERCIO LTDA", cidade: "ARCEBURGO", uf: "MG", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Giovane" },
  { numero: 668, statusLab: "EQUIPAMENTO EM TESTE FINAL", statusOS: "2 - APROVADO", emissao: "2/4/26", tipoOS: "OS com Faturamento", descricao: "DRIVE YASKAWA CACR-SR10BE12G-E", razaoSocial: "REI AUTO PARTS INDUSTRIA E COMERCIO LTDA", cidade: "ARCEBURGO", uf: "MG", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Marcelo" },
  { numero: 667, statusLab: "ENTREGUE AO CLIENTE", statusOS: "", emissao: "2/4/26", tipoOS: "OS sem Faturamento", descricao: "TECLADO OPERADOR FANUC", razaoSocial: "CESTARI INDUSTRIAL E COMERCIAL SA", cidade: "MONTE ALTO", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Erickson" },
  { numero: 666, statusLab: "ENTREGUE AO CLIENTE", statusOS: "", emissao: "2/4/26", tipoOS: "OS sem Faturamento", descricao: "CNC FANUC 21I-MB", razaoSocial: "CESTARI INDUSTRIAL E COMERCIAL SA", cidade: "MONTE ALTO", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Gabriel" },
  { numero: 665, statusLab: "ENTREGUE AO CLIENTE", statusOS: "AGUARDANDO AVALIAÇÃO", emissao: "2/4/26", tipoOS: "OS sem Faturamento", descricao: "MANIVELA FANUC A860-0203-T013", razaoSocial: "CESTARI INDUSTRIAL E COMERCIAL SA", cidade: "MONTE ALTO", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Leonardo" },
  { numero: 664, statusLab: "EQUIPAMENTO EM TESTE FINAL", statusOS: "", emissao: "2/3/26", tipoOS: "OS com Faturamento", descricao: "PLACA FANUC A16B-2201-0101", razaoSocial: "MARCHESAN IMPLEMENTOS E MAQUINAS AGRICOLAS TATU S A", cidade: "MATAO", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Felipe" },
  { numero: 662, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "2/2/26", tipoOS: "OS com Faturamento", descricao: "FCA70P-4BV CNC M70", razaoSocial: "NIVALDO GARDINI", cidade: "SAO CARLOS", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Kaue" },
  { numero: 658, statusLab: "EM AVALIAÇÃO - CONFIRMANDO DEFEITO", statusOS: "", emissao: "1/30/26", tipoOS: "OS com Faturamento", descricao: "SIMODRIVE SIEMENS", razaoSocial: "OLIVEIRA MANUTENCAO E REPARACAO DE MAQUINAS INDUSTRIAIS LTDA", cidade: "GRAVATAI", uf: "RS", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Giovane" },
  { numero: 655, statusLab: "INICIO DE TESTE EM BANCADA", statusOS: "", emissao: "1/30/26", tipoOS: "OS com Faturamento", descricao: "DRIVE SBF-AH501/5A", razaoSocial: "TRES S FERRAMENTAS DE PRECISAO LTDA", cidade: "CRAVINHOS", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Marcelo" },
  { numero: 650, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "", emissao: "1/30/26", tipoOS: "OS com Faturamento", descricao: "FONTE SIMODRIVE 611 36/47KW", razaoSocial: "SPEED FORM INDUSTRIA E COMERCIO LTDA", cidade: "RIO DE JANEIRO", uf: "RJ", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Erickson" },
  { numero: 649, statusLab: "ENTREGUE AO CLIENTE", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "1/29/26", tipoOS: "OS com Faturamento", descricao: "DRIVE OKUMA MIV0505A-1-B5", razaoSocial: "ROSSINI MURTA INDUSTRIA METALURGICA LTDA", cidade: "SANTANA DE PARNAIBA", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Gabriel" },
  { numero: 646, statusLab: "INICIO DE TESTE EM BANCADA", statusOS: "EQUIPAMENTO SEM REPARO", emissao: "1/29/26", tipoOS: "OS com Faturamento", descricao: "MODULO SIEMENS 6SL3130-7TE21-6AA3", razaoSocial: "ENG-AGRO PECAS E PROJETOS LTDA", cidade: "PEDERNEIRAS", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Leonardo" },
  { numero: 643, statusLab: "EMBALAGEM/EXPEDIÇÃO - PRONTO", statusOS: "2 - APROVADO", emissao: "1/28/26", tipoOS: "OS com Faturamento", descricao: "DRIVE SPINDLE MITSUBISHI MDS-B-SPJ2-55", razaoSocial: "CONEXAO SISTEMAS DE PROTESE LTDA", cidade: "ARUJA", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Felipe" },
  { numero: 640, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "GARANTIA", emissao: "1/27/26", tipoOS: "OS com Faturamento", descricao: "SIMODRIVE 2X25A", razaoSocial: "ROSSINI MURTA INDUSTRIA METALURGICA LTDA", cidade: "SANTANA DE PARNAIBA", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Kaue" },
  { numero: 638, statusLab: "", statusOS: "1 - URGENTE", emissao: "1/26/26", tipoOS: "OS com Faturamento", descricao: "MAQUINA MULTIPLIC 30D ROMI", razaoSocial: "TRES S FERRAMENTAS DE PRECISAO LTDA", cidade: "CRAVINHOS", uf: "SP", categoriaOS: "REFORMA/RETROFIT DE MÁQUINAS", tecnico: "Giovane" },
  { numero: 635, statusLab: "EQUIPAMENTO FICARA EM TESTE NA MAQUINA", statusOS: "AGUARDANDO AVALIAÇÃO", emissao: "1/23/26", tipoOS: "OS com Faturamento", descricao: "CNC 0-TC ( MACH 6)", razaoSocial: "MODERTECH ASSISTENCIA TECNICA CNC LTDA", cidade: "MATAO", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Marcelo" },
  { numero: 632, statusLab: "EQUIPAMENTO EM TESTE FINAL", statusOS: "", emissao: "1/23/26", tipoOS: "OS sem Faturamento", descricao: "FONTE SIMODRIVE SIEMENS 55/71KW", razaoSocial: "FUNDICAO BATATAIS LTDA", cidade: "BATATAIS", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Erickson" },
  { numero: 629, statusLab: "INICIO DE TESTE EM BANCADA", statusOS: "GARANTIA", emissao: "1/22/26", tipoOS: "OS sem Faturamento", descricao: "FONTE SIMODRIVE 16/21 KW SIEMENS", razaoSocial: "SILC INDUSTRIA DE AUTOPECAS LTDA", cidade: "BATATAIS", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Gabriel" },
  { numero: 628, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "2 - APROVADO", emissao: "1/22/26", tipoOS: "OS com Faturamento", descricao: "SINUMERIK 810D CCU BOX 2X25A", razaoSocial: "SILC INDUSTRIA DE AUTOPECAS LTDA", cidade: "BATATAIS", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Leonardo" },
  { numero: 627, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "2 - APROVADO", emissao: "1/22/26", tipoOS: "OS com Faturamento", descricao: "SERVO MOTOR SIEMENS", razaoSocial: "SILC INDUSTRIA DE AUTOPECAS LTDA", cidade: "BATATAIS", uf: "SP", categoriaOS: "LABORATÓRIO DE SERVOMOTORES", tecnico: "Felipe" },
  { numero: 626, statusLab: "INICIO DE TESTE EM BANCADA", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "1/22/26", tipoOS: "OS com Faturamento", descricao: "CNC FANUC 21I-TA", razaoSocial: "IPPEL EQUIPAMENTOS LTDA", cidade: "PIRAI DO SUL", uf: "PR", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Kaue" },
  { numero: 622, statusLab: "EMBALAGEM/EXPEDIÇÃO - PRONTO", statusOS: "", emissao: "1/21/26", tipoOS: "OS com Faturamento", descricao: "PLACA I/O SIEMENS 802DSL", razaoSocial: "MANIVA CNC MANUTENCAO INDUSTRIAL LTDA", cidade: "ARARAS", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Giovane" },
  { numero: 621, statusLab: "EMBALAGEM/EXPEDIÇÃO - EMBALADO", statusOS: "", emissao: "1/21/26", tipoOS: "OS com Faturamento", descricao: "PLACA DE I/O FANUC A20B-2002-0520", razaoSocial: "MANIVA CNC MANUTENCAO INDUSTRIAL LTDA", cidade: "ARARAS", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Marcelo" },
  { numero: 620, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "1/21/26", tipoOS: "OS com Faturamento", descricao: "TECLADO OPERADOR FANUC", razaoSocial: "MANIVA CNC MANUTENCAO INDUSTRIAL LTDA", cidade: "ARARAS", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Erickson" },
  { numero: 617, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "1/21/26", tipoOS: "OS com Faturamento", descricao: "SERVO MOTOR FANUC B2/3000", razaoSocial: "NEO RODAS SA", cidade: "VINHEDO", uf: "SP", categoriaOS: "LABORATÓRIO DE SERVOMOTORES", tecnico: "Gabriel" },
  { numero: 612, statusLab: "INICIO DE TESTE EM BANCADA", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "1/19/26", tipoOS: "OS com Faturamento", descricao: "CNC FANUC 160I -MB", razaoSocial: "AXAL DO BRASIL LTDA", cidade: "NOVA ODESSA", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Leonardo" },
  { numero: 611, statusLab: "INICIO DE TESTE EM BANCADA", statusOS: "PROPOSTA ENVIADA PARA O CLIENTE", emissao: "1/19/26", tipoOS: "OS com Faturamento", descricao: "PAINEL FANUC 160I-MB", razaoSocial: "AXAL DO BRASIL LTDA", cidade: "NOVA ODESSA", uf: "SP", categoriaOS: "LABORATÓRIO ELETRÔNICO", tecnico: "Felipe" },
  { numero: 606, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "", emissao: "1/16/26", tipoOS: "OS com Faturamento", descricao: "SERVO MOTOR SIEMENS", razaoSocial: "MANUTEX CNC ELETRONICA LTDA", cidade: "MONTE ALTO", uf: "SP", categoriaOS: "LABORATÓRIO DE SERVOMOTORES", tecnico: "Kaue" },
  { numero: 605, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "", emissao: "1/16/26", tipoOS: "OS sem Faturamento", descricao: "MOTOR OKUMA SEM IDENTIFICACAO N. 2", razaoSocial: "MANUTEX CNC ELETRONICA LTDA", cidade: "MONTE ALTO", uf: "SP", categoriaOS: "LABORATÓRIO DE SERVOMOTORES", tecnico: "Giovane" },
  { numero: 604, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "", emissao: "1/16/26", tipoOS: "OS com Faturamento", descricao: "MOTOR OKUMA SEM IDENTIFICACAO N. 1", razaoSocial: "MANUTEX CNC ELETRONICA LTDA", cidade: "MONTE ALTO", uf: "SP", categoriaOS: "LABORATÓRIO DE SERVOMOTORES", tecnico: "Marcelo" },
  { numero: 603, statusLab: "AGUARDANDO AVALIAÇÃO", statusOS: "", emissao: "1/16/26", tipoOS: "OS sem Faturamento", descricao: "SERVO MOTOR OKUMA BL-MP-500-20SB", razaoSocial: "MANUTEX CNC ELETRONICA LTDA", cidade: "MONTE ALTO", uf: "SP", categoriaOS: "LABORATÓRIO DE SERVOMOTORES", tecnico: "Erickson" },
];

// Helper functions
export function getStatusLabGroups(data: OSRecord[]) {
  const groups: Record<string, number> = {};
  data.forEach(os => {
    const status = os.statusLab || "SEM STATUS";
    groups[status] = (groups[status] || 0) + 1;
  });
  return Object.entries(groups)
    .map(([name, value]) => ({ name: name.length > 25 ? name.slice(0, 25) + "…" : name, fullName: name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getTechnicianGroups(data: OSRecord[]) {
  const groups: Record<string, number> = {};
  data.forEach(os => {
    groups[os.tecnico] = (groups[os.tecnico] || 0) + 1;
  });
  return Object.entries(groups)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getUFGroups(data: OSRecord[]) {
  const groups: Record<string, number> = {};
  data.forEach(os => {
    groups[os.uf] = (groups[os.uf] || 0) + 1;
  });
  return Object.entries(groups)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getTipoOSGroups(data: OSRecord[]) {
  const groups: Record<string, number> = {};
  data.forEach(os => {
    groups[os.tipoOS] = (groups[os.tipoOS] || 0) + 1;
  });
  return Object.entries(groups).map(([name, value]) => ({ name, value }));
}

export function getTopClients(data: OSRecord[], limit = 8) {
  const groups: Record<string, number> = {};
  data.forEach(os => {
    const name = os.razaoSocial.length > 30 ? os.razaoSocial.slice(0, 30) + "…" : os.razaoSocial;
    groups[name] = (groups[name] || 0) + 1;
  });
  return Object.entries(groups)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}
