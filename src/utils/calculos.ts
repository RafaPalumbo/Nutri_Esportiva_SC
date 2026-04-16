import {
  ClassificacaoPerda,
  ClassificacaoUrina,
  DadosPosExercicio,
  DadosPreExercicio,
  ResultadoHidratacao,
} from "../types";

function classificarPerda(percentual: number): ClassificacaoPerda {
  if (percentual < 1) return "leve";
  if (percentual < 2) return "moderada";
  if (percentual < 3) return "alta";
  return "critica";
}

function classificarUrina(corUrina: number): ClassificacaoUrina {
  if (corUrina <= 2) return "bem_hidratado";
  if (corUrina === 3) return "adequado";
  if (corUrina === 4) return "desidratado";
  return "muito_desidratado";
}

function gerarAlertas(
  percentual: number,
  corUrina: number,
  sintomas: string[]
): string[] {
  const alertas: string[] = [];

  if (percentual >= 3)
    alertas.push("Perda hídrica crítica. Avaliação profissional necessária.");
  else if (percentual >= 2)
    alertas.push("Perda hídrica elevada. Reforce a hidratação imediatamente.");

  if (corUrina === 5)
    alertas.push("Urina muito escura. Sinal de desidratação severa.");

  if (sintomas.includes("Tontura") || sintomas.includes("Náusea"))
    alertas.push("Sintomas relatados exigem atenção clínica.");

  return alertas;
}

export function calcularResultado(
  pre: DadosPreExercicio,
  pos: DadosPosExercicio
): ResultadoHidratacao {
  const perdaAbsoluta = pre.massaCorporal - pos.massaCorporal;
  const perdaPercentual = (perdaAbsoluta / pre.massaCorporal) * 100;

  // Taxa de sudorese = (perda de peso em ml + volume ingerido) / duração em horas
  const duracaoHoras = pos.duracaoExercicio / 60;
  const taxaSudorese = (perdaAbsoluta * 1000 + pos.volumeIngerido) / duracaoHoras;

  // Reposição = 150% da perda para compensar perdas residuais
  const reposicaoRecomendada = perdaAbsoluta * 1000 * 1.5;

  return {
    taxaSudorese: Math.round(taxaSudorese),
    perdaHidricaAbsoluta: parseFloat(perdaAbsoluta.toFixed(2)),
    perdaHidricaPercentual: parseFloat(perdaPercentual.toFixed(2)),
    reposicaoRecomendada: Math.round(reposicaoRecomendada),
    classificacaoPerda: classificarPerda(perdaPercentual),
    classificacaoUrina: classificarUrina(pre.corUrina),
    alertas: gerarAlertas(perdaPercentual, pre.corUrina, pre.sintomas),
  };
}