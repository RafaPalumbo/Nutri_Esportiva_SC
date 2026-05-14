import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/Header";
import { colors, fontSize, radius, spacing } from "../theme";
import { calcularResultado } from "../utils/calculos";
import { ClassificacaoPerda } from "../types";
import { inserirAvaliacao } from "../database";
import { useAuth } from "../context/AuthContext";

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

export default function Resultado({ navigation, route }: any) {
  const { preExercicio, posExercicio, ambiente } = route.params;
  const { usuario } = useAuth();

  const resultado = useMemo(
    () => calcularResultado(preExercicio, posExercicio),
    [preExercicio, posExercicio]
  );

  useEffect(() => {
    try {
      inserirAvaliacao({
        id: Date.now().toString(),
        atletaId: usuario?.id ?? "1",
        data: new Date().toISOString(),
        preExercicio,
        ambiente,
        posExercicio,
        resultado,
      });
    } catch (e) {
      console.error("erro ao salvar:", e);
    }
  }, [ambiente, posExercicio, preExercicio, resultado, usuario?.id]);

  function irParaHistorico() {
    navigation.navigate("MainTabs", {
      screen: "HistoricoTab",
    });
  }

  const recomendacao = resultado.recomendacao;

  return (
    <View style={s.root}>
      <Header titulo="DeltaH" />

      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.sectionTitle}>• Resultado da Avaliação.</Text>

        <LinearGradient
          colors={["#8B0000", "#C8000A", "#D63031"]}
          locations={[0, 0.3, 1]}
          style={s.card}
        >
          <View style={s.metricRow}>
            <Text style={s.metricLabel}>Taxa de Sudorese</Text>
            <Text style={s.metricValor}>{resultado.taxaSudorese} ml/h</Text>
          </View>

          <View style={s.metricRow}>
            <Text style={s.metricLabel}>Perda de Massa</Text>
            <Text style={s.metricValor}>{resultado.perdaHidricaPercentual}%</Text>
          </View>

          {typeof resultado.perdaHidricaAjustada === "number" && (
            <View style={s.metricRow}>
              <Text style={s.metricLabel}>Perda Ajustada</Text>
              <Text style={s.metricValor}>{resultado.perdaHidricaAjustada} L</Text>
            </View>
          )}

          <View style={s.metricRow}>
            <Text style={s.metricLabel}>Classificação</Text>

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

          <View style={s.metricRow}>
            <Text style={s.metricLabel}>Balanço Hídrico</Text>
            <Text style={s.metricValor}>
              {resultado.balanco > 0 ? "+" : ""}
              {resultado.balanco} ml
            </Text>
          </View>

          <View style={[s.metricRow, s.destaque]}>
            <Text style={s.metricLabel}>Repor ainda</Text>
            <Text style={s.metricValorDestaque}>
              {resultado.reposicaoRecomendada} ml
            </Text>
          </View>

          {recomendacao && (
            <View style={s.recomendacaoContainer}>
              <Text style={s.boxTitulo}>Recomendação prática</Text>

              <Text style={s.boxTexto}>
                Meta sugerida: {recomendacao.ingestaoAlvoMinMlHora}–
                {recomendacao.ingestaoAlvoMaxMlHora} ml/h
              </Text>

              <Text style={s.boxTexto}>
                Fracionamento: {recomendacao.volumePorIntervaloMin}–
                {recomendacao.volumePorIntervaloMax} ml a cada{" "}
                {recomendacao.intervaloMinutos} min
              </Text>
            </View>
          )}

          {ambiente && (
            <View style={s.ambienteContainer}>
              <Text style={s.boxTitulo}>Ambiente da sessão</Text>

              <Text style={s.boxTexto}>
                • {ambiente.cidade}: {ambiente.temperatura}°C, umidade{" "}
                {ambiente.umidade}%
              </Text>

              {typeof ambiente.sensacaoTermica === "number" && (
                <Text style={s.boxTexto}>
                  • Sensação térmica: {ambiente.sensacaoTermica}°C
                </Text>
              )}

              {typeof ambiente.vento === "number" && (
                <Text style={s.boxTexto}>• Vento: {ambiente.vento} km/h</Text>
              )}

              {ambiente.exposicaoSolar && (
                <Text style={s.boxTexto}>
                  • Exposição solar: {ambiente.exposicaoSolar}
                </Text>
              )}
            </View>
          )}

          {resultado.alertas.length > 0 && (
            <View style={s.alertasContainer}>
              <Text style={s.boxTitulo}>Alertas</Text>

              {resultado.alertas.map((alerta, i) => (
                <Text key={i} style={s.boxTexto}>
                  • {alerta}
                </Text>
              ))}
            </View>
          )}

          <View style={s.botoes}>
            <TouchableOpacity onPress={() => navigation.popToTop()}>
              <Text style={s.btn}>Nova Avaliação</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={irParaHistorico}>
              <Text style={s.btn}>Ver Histórico</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.md,
    paddingBottom: 40,
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
  },
  sectionTitle: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: fontSize.lg,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  card: {
    borderRadius: radius.lg,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    width: "100%",
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
    gap: spacing.sm,
  },
  metricLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: fontSize.md,
    flex: 1,
  },
  metricValor: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: "700",
    textAlign: "right",
  },
  destaque: {
    borderBottomWidth: 0,
    marginTop: spacing.xs,
  },
  metricValorDestaque: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: "700",
    textAlign: "right",
  },
  badge: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: fontSize.sm,
  },
  recomendacaoContainer: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  ambienteContainer: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  alertasContainer: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  boxTitulo: {
    color: colors.white,
    fontWeight: "700",
    fontSize: fontSize.md,
    marginBottom: spacing.xs,
  },
  boxTexto: {
    color: "rgba(255,255,255,0.9)",
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  botoes: {
    alignItems: "center",
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  btn: {
    color: colors.white,
    fontWeight: "700",
    fontSize: fontSize.md,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    textAlign: "center",
    minWidth: 150,
  },
});