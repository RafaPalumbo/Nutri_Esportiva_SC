import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { colors, fontSize, radius, spacing } from "../theme";
import { listarAvaliacoesPorAtleta } from "../database";
import {
  Avaliacao,
  CategoriaRisco,
  ClassificacaoPerda,
  NivelRisco,
  RiscoTriagem,
} from "../types";
import { exportarCsvAvaliacoes } from "../utils/exportarCsv";

interface Props {
  atletaId: string;
}

const CORES_CLASSIFICACAO: Record<ClassificacaoPerda, string> = {
  leve: "#81C784",
  moderada: "#FFB74D",
  alta: "#FF7043",
  critica: "#E53935",
};

const LABELS_CLASSIFICACAO: Record<ClassificacaoPerda, string> = {
  leve: "Leve",
  moderada: "Moderada",
  alta: "Alta",
  critica: "Crítica",
};

const CORES_RISCO: Record<NivelRisco, string> = {
  baixo: "#81C784",
  moderado: "#FFB74D",
  alto: "#FF7043",
  critico: "#E53935",
};

const LABELS_RISCO: Record<NivelRisco, string> = {
  baixo: "Baixo",
  moderado: "Moderado",
  alto: "Alto",
  critico: "Crítico",
};

const LABELS_CATEGORIA_RISCO: Record<CategoriaRisco, string> = {
  hipoidratacao: "Hipoidratação",
  hiperidratacao: "Hiperidratação",
  hiponatremia: "Hiponatremia",
  calor: "Calor",
  clinico: "Clínico",
  qualidade_medida: "Qualidade da medida",
};

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
    PESO_RISCO[atual.nivel] > PESO_RISCO[maior.nivel] ? atual : maior
  );
}

function calcularMedia(valores: number[]): number {
  if (valores.length === 0) return 0;

  const soma = valores.reduce((total, valor) => total + valor, 0);
  return soma / valores.length;
}

export default function Historico({ atletaId }: Props) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [mensagemExportacao, setMensagemExportacao] = useState("");

  useFocusEffect(
    useCallback(() => {
      const dados = listarAvaliacoesPorAtleta(atletaId);
      setAvaliacoes(dados);
    }, [atletaId])
  );

  const avaliacoesComResultado = useMemo(
    () => avaliacoes.filter((avaliacao) => avaliacao.resultado),
    [avaliacoes]
  );

  const totalSessoes = avaliacoesComResultado.length;

  const mediaTaxaSudorese = useMemo(() => {
    const taxas = avaliacoesComResultado.map(
      (avaliacao) => avaliacao.resultado?.taxaSudorese ?? 0
    );

    return Math.round(calcularMedia(taxas));
  }, [avaliacoesComResultado]);

  const mediaPerdaPercentual = useMemo(() => {
    const perdas = avaliacoesComResultado.map(
      (avaliacao) => avaliacao.resultado?.perdaHidricaPercentual ?? 0
    );

    return parseFloat(calcularMedia(perdas).toFixed(2));
  }, [avaliacoesComResultado]);

  const totalRiscosAltosOuCriticos = useMemo(() => {
    return avaliacoesComResultado.reduce((total, avaliacao) => {
      const riscos = avaliacao.resultado?.riscos ?? [];
      const possuiRiscoImportante = riscos.some(
        (risco) => risco.nivel === "alto" || risco.nivel === "critico"
      );

      return possuiRiscoImportante ? total + 1 : total;
    }, 0);
  }, [avaliacoesComResultado]);

  function handleExportarCsv() {
    if (avaliacoesComResultado.length === 0) {
      setMensagemExportacao("Não há avaliações com resultado para exportar.");
      return;
    }

    const retorno = exportarCsvAvaliacoes(avaliacoesComResultado);
    setMensagemExportacao(retorno.mensagem);
  }

  return (
    <SafeAreaView style={s.root}>
      <Header titulo="DeltaH" />
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.tituloRow}>
          <Text style={s.sectionTitle}>• Histórico de Avaliações.</Text>

          {totalSessoes > 0 && (
            <TouchableOpacity style={s.btnExportar} onPress={handleExportarCsv}>
              <Text style={s.btnExportarText}>Exportar CSV</Text>
            </TouchableOpacity>
          )}
        </View>

        {mensagemExportacao ? (
          <Text style={s.mensagemExportacao}>{mensagemExportacao}</Text>
        ) : null}

        {totalSessoes === 0 ? (
          <View style={s.vazio}>
            <Text style={s.vazioTexto}>Nenhuma avaliação registrada ainda.</Text>
          </View>
        ) : (
          <>
            <View style={s.painel}>
              <Text style={s.painelTitulo}>Painel longitudinal</Text>

              <View style={s.painelGrid}>
                <View style={s.painelMetric}>
                  <Text style={s.painelValor}>{totalSessoes}</Text>
                  <Text style={s.painelLabel}>sessões</Text>
                </View>

                <View style={s.painelMetric}>
                  <Text style={s.painelValor}>{mediaTaxaSudorese}</Text>
                  <Text style={s.painelLabel}>média ml/h</Text>
                </View>

                <View style={s.painelMetric}>
                  <Text style={s.painelValor}>{mediaPerdaPercentual}%</Text>
                  <Text style={s.painelLabel}>média perda</Text>
                </View>

                <View style={s.painelMetric}>
                  <Text style={s.painelValor}>{totalRiscosAltosOuCriticos}</Text>
                  <Text style={s.painelLabel}>risco alto/crítico</Text>
                </View>
              </View>
            </View>

            {avaliacoesComResultado.map((avaliacao) => {
              const resultado = avaliacao.resultado;
              if (!resultado) return null;

              const ambiente = avaliacao.ambiente;
              const riscoPrincipal = obterRiscoPrincipal(resultado.riscos);
              const primeiroAlerta = resultado.alertas[0];

              return (
                <View key={avaliacao.id} style={s.card}>
                  <View style={s.cardTopo}>
                    <View style={s.cardDataContainer}>
                      <Text style={s.cardData}>{formatarDataHora(avaliacao.data)}</Text>

                      {avaliacao.preExercicio.modalidade && (
                        <Text style={s.cardSubInfo}>
                          {avaliacao.preExercicio.modalidade}
                        </Text>
                      )}
                    </View>

                    <View
                      style={[
                        s.badge,
                        {
                          backgroundColor:
                            CORES_CLASSIFICACAO[resultado.classificacaoPerda],
                        },
                      ]}
                    >
                      <Text style={s.badgeText}>
                        {LABELS_CLASSIFICACAO[resultado.classificacaoPerda]}
                      </Text>
                    </View>
                  </View>

                  <View style={s.cardMetrics}>
                    <View style={s.metric}>
                      <Text style={s.metricValor}>{resultado.taxaSudorese}</Text>
                      <Text style={s.metricLabel}>ml/h</Text>
                    </View>

                    <View style={s.metric}>
                      <Text style={s.metricValor}>
                        {resultado.perdaHidricaPercentual}%
                      </Text>
                      <Text style={s.metricLabel}>perda</Text>
                    </View>

                    <View style={s.metric}>
                      <Text style={s.metricValor}>
                        {resultado.reposicaoRecomendada}
                      </Text>
                      <Text style={s.metricLabel}>ml repor</Text>
                    </View>
                  </View>

                  {ambiente && (
                    <View style={s.infoBox}>
                      <Text style={s.infoTitulo}>Ambiente</Text>
                      <Text style={s.infoTexto}>
                        {ambiente.cidade} • {ambiente.temperatura}°C • umidade{" "}
                        {ambiente.umidade}%
                      </Text>

                      {typeof ambiente.sensacaoTermica === "number" && (
                        <Text style={s.infoTexto}>
                          Sensação térmica: {ambiente.sensacaoTermica}°C
                        </Text>
                      )}

                      {typeof ambiente.vento === "number" && (
                        <Text style={s.infoTexto}>Vento: {ambiente.vento} km/h</Text>
                      )}
                    </View>
                  )}

                  {riscoPrincipal && (
                    <View style={s.riscoBox}>
                      <View
                        style={[
                          s.riscoBadge,
                          { backgroundColor: CORES_RISCO[riscoPrincipal.nivel] },
                        ]}
                      >
                        <Text style={s.riscoBadgeText}>
                          {LABELS_RISCO[riscoPrincipal.nivel]}
                        </Text>
                      </View>

                      <View style={s.riscoConteudo}>
                        <Text style={s.riscoTitulo}>
                          Risco principal:{" "}
                          {LABELS_CATEGORIA_RISCO[riscoPrincipal.categoria]}
                        </Text>
                        <Text style={s.riscoMensagem}>
                          {riscoPrincipal.mensagem}
                        </Text>
                      </View>
                    </View>
                  )}

                  {!riscoPrincipal && primeiroAlerta && (
                    <Text style={s.alerta}>• {primeiroAlerta}</Text>
                  )}
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: 40 },
  tituloRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: fontSize.lg,
    flex: 1,
  },
  btnExportar: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  btnExportarText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: fontSize.sm,
  },
  mensagemExportacao: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  vazio: {
    alignItems: "center",
    marginTop: spacing.xl,
  },
  vazioTexto: {
    color: "#666",
    fontSize: fontSize.md,
  },
  painel: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  painelTitulo: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  painelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  painelMetric: {
    width: "48%",
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: "center",
  },
  painelValor: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: "700",
  },
  painelLabel: {
    color: "#555",
    fontSize: fontSize.xs,
    fontWeight: "600",
    textAlign: "center",
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  cardDataContainer: {
    flex: 1,
  },
  cardData: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.text,
  },
  cardSubInfo: {
    fontSize: fontSize.xs,
    color: "#666",
    marginTop: spacing.xs,
  },
  badge: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: fontSize.xs,
  },
  cardMetrics: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  metric: {
    alignItems: "center",
    flex: 1,
  },
  metricValor: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.primary,
  },
  metricLabel: {
    fontSize: fontSize.xs,
    color: "#555",
    fontWeight: "600",
    marginTop: 2,
  },
  infoBox: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  infoTitulo: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  infoTexto: {
    color: "#555",
    fontSize: fontSize.xs,
    marginBottom: 2,
  },
  riscoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF4F1",
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  riscoBadge: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  riscoBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: fontSize.xs,
  },
  riscoConteudo: {
    flex: 1,
  },
  riscoTitulo: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  riscoMensagem: {
    color: "#555",
    fontSize: fontSize.xs,
    lineHeight: 16,
  },
  alerta: {
    marginTop: spacing.sm,
    fontSize: fontSize.xs,
    color: "#FF7043",
  },
});