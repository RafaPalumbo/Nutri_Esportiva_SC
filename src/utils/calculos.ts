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
  sintomas: string[],
  balanco: number
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

  // Risco de superingestão (balanço positivo > 500ml indica ingestão excessiva)
  if (balanco > 500)
    alertas.push("Ingestão acima da perda. Risco de hiperidratação.");

  return alertas;
}

export function calcularResultado(
  pre: DadosPreExercicio,
  pos: DadosPosExercicio
): ResultadoHidratacao {
  const duracaoHoras = pos.duracaoExercicio / 60;

  // Perda de massa bruta em kg
  const perdaBruta = pre.massaCorporal - pos.massaCorporal;

  // Perda ajustada = perda bruta + fluidos ingeridos (convertido para kg, 1ml ≈ 1g)
  const perdaAjustada = perdaBruta + pos.volumeIngerido / 1000;

  // Percentual de variação de massa corporal
  const perdaPercentual = (perdaBruta / pre.massaCorporal) * 100;

  // Taxa de sudorese em ml/h
  const taxaSudorese = (perdaAjustada * 1000) / duracaoHoras;

  // Balanço hídrico = ingestão - perda estimada em ml
  const balanco = pos.volumeIngerido - perdaAjustada * 1000;

  // Reposição recomendada = 150% da perda bruta em ml
  const reposicaoRecomendada = perdaBruta * 1000 * 1.5;

  return {
    taxaSudorese: Math.round(taxaSudorese),
    perdaHidricaAbsoluta: parseFloat(perdaBruta.toFixed(2)),
    perdaHidricaPercentual: parseFloat(perdaPercentual.toFixed(2)),
    balanco: Math.round(balanco),
    reposicaoRecomendada: Math.round(reposicaoRecomendada),
    classificacaoPerda: classificarPerda(perdaPercentual),
    classificacaoUrina: classificarUrina(pre.corUrina),
    alertas: gerarAlertas(perdaPercentual, pre.corUrina, pre.sintomas, balanco),
  };
}