import { Platform } from "react-native";
import { Avaliacao, NivelRisco, RiscoTriagem } from "../types";

const PESO_RISCO: Record<NivelRisco, number> = {
  baixo: 1,
  moderado: 2,
  alto: 3,
  critico: 4,
};

function formatarDataHora(dataISO: string): string {
  return new Date(dataISO).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function obterRiscoPrincipal(riscos?: RiscoTriagem[]): RiscoTriagem | null {
  if (!riscos || riscos.length === 0) return null;

  return riscos.reduce((maior, atual) =>
    PESO_RISCO[atual.nivel] > PESO_RISCO[maior.nivel] ? atual : maior,
  );
}

function escaparCsv(valor: unknown): string {
  if (valor === null || valor === undefined) return "";

  const texto = String(valor);
  const precisaEscapar =
    texto.includes(",") ||
    texto.includes('"') ||
    texto.includes("\n") ||
    texto.includes("\r");

  if (!precisaEscapar) return texto;

  return `"${texto.replace(/"/g, '""')}"`;
}

function gerarNomeArquivo(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  const hora = String(agora.getHours()).padStart(2, "0");
  const minuto = String(agora.getMinutes()).padStart(2, "0");

  return `historico_hidratacao_${ano}-${mes}-${dia}_${hora}-${minuto}.csv`;
}

export function gerarCsvAvaliacoes(avaliacoes: Avaliacao[]): string {
  const cabecalho = [
    "Data/Hora",
    "Modalidade",
    "Massa pre (kg)",
    "Massa pos (kg)",
    "Duracao (min)",
    "Volume ingerido (ml)",
    "Volume urinario (ml)",
    "Taxa sudorese (ml/h)",
    "Perda massa (%)",
    "Perda ajustada (L)",
    "Balanco (ml)",
    "Reposicao recomendada (ml)",
    "Classificacao perda",
    "Temperatura (C)",
    "Umidade (%)",
    "Sensacao termica (C)",
    "Vento (km/h)",
    "Cidade",
    "Risco principal",
    "Nivel risco principal",
    "Mensagem risco principal",
  ];

  const linhas = avaliacoes
    .filter((avaliacao) => avaliacao.resultado)
    .map((avaliacao) => {
      const pre = avaliacao.preExercicio;
      const pos = avaliacao.posExercicio;
      const ambiente = avaliacao.ambiente;
      const resultado = avaliacao.resultado;
      const riscoPrincipal = obterRiscoPrincipal(resultado?.riscos);

      return [
        formatarDataHora(avaliacao.data),
        pre.modalidade ?? "",
        pre.massaCorporal,
        pos?.massaCorporal ?? "",
        pos?.duracaoExercicio ?? "",
        pos?.volumeIngerido ?? "",
        pos?.volumeUrinario ?? "",
        resultado?.taxaSudorese ?? "",
        resultado?.perdaHidricaPercentual ?? "",
        resultado?.perdaHidricaAjustada ?? "",
        resultado?.balanco ?? "",
        resultado?.reposicaoRecomendada ?? "",
        resultado?.classificacaoPerda ?? "",
        ambiente?.temperatura ?? "",
        ambiente?.umidade ?? "",
        ambiente?.sensacaoTermica ?? "",
        ambiente?.vento ?? "",
        ambiente?.cidade ?? "",
        riscoPrincipal?.categoria ?? "",
        riscoPrincipal?.nivel ?? "",
        riscoPrincipal?.mensagem ?? "",
      ];
    });

  return [cabecalho, ...linhas]
    .map((linha) => linha.map(escaparCsv).join(","))
    .join("\n");
}

export function exportarCsvAvaliacoes(avaliacoes: Avaliacao[]): {
  sucesso: boolean;
  mensagem: string;
} {
  const csv = gerarCsvAvaliacoes(avaliacoes);

  if (Platform.OS !== "web") {
    return {
      sucesso: false,
      mensagem: "Exportação CSV disponível inicialmente na versão web.",
    };
  }

  if (typeof window === "undefined" || typeof document === "undefined") {
    return {
      sucesso: false,
      mensagem: "Ambiente web indisponível para exportação.",
    };
  }

  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = gerarNomeArquivo();
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);

  return {
    sucesso: true,
    mensagem: "CSV exportado com sucesso.",
  };
}
