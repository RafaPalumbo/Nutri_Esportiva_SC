import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import Header from "../components/Header";
import { colors, fontSize, radius, spacing } from "../theme";
import { calcularResultado } from "../utils/calculos";
import { ClassificacaoPerda } from "../types";
import { inserirAvaliacao } from "../database";
import { useAuth } from "../context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "Resultado">;

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

export default function Resultado({ navigation, route }: Props) {
  const { preExercicio, posExercicio } = route.params;
  const resultado = calcularResultado(preExercicio, posExercicio);
  const { usuario } = useAuth();

  useEffect(() => {
    try {
      const avaliacao = {
        id: Date.now().toString(),
        atletaId: usuario?.id ?? "1",
        data: new Date().toISOString(),
        preExercicio,
        posExercicio,
        resultado,
      };
      inserirAvaliacao(avaliacao);
    } catch (e) {
      console.error("erro ao salvar:", e);
    }
  }, []);

  return (
    <View style={s.root}>
      <Header titulo="Nutri-Esportiva - São Camilo" />
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
            <Text style={s.metricLabel}>Perda Hídrica</Text>
            <Text style={s.metricValor}>{resultado.perdaHidricaPercentual}%</Text>
          </View>

          <View style={s.metricRow}>
            <Text style={s.metricLabel}>Classificação</Text>
            <View style={[s.badge, { backgroundColor: CORES_CLASSIFICACAO[resultado.classificacaoPerda] }]}>
              <Text style={s.badgeText}>{LABELS_CLASSIFICACAO[resultado.classificacaoPerda]}</Text>
            </View>
          </View>

          <View style={s.metricRow}>
            <Text style={s.metricLabel}>Balanço Hídrico</Text>
            <Text style={s.metricValor}>
              {resultado.balanco > 0 ? "+" : ""}{resultado.balanco} ml
            </Text>
          </View>

          <View style={[s.metricRow, s.destaque]}>
            <Text style={s.metricLabel}>Repor ainda</Text>
            <Text style={s.metricValorDestaque}>{resultado.reposicaoRecomendada} ml</Text>
          </View>

          {resultado.alertas.length > 0 && (
            <View style={s.alertasContainer}>
              <Text style={s.alertasTitulo}>Alertas</Text>
              {resultado.alertas.map((alerta, i) => (
                <Text key={i} style={s.alertaItem}>• {alerta}</Text>
              ))}
            </View>
          )}

          <View style={s.botoes}>
            <TouchableOpacity onPress={() => navigation.popToTop()}>
              <Text style={s.btn}>Nova Avaliação</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Historico", { atletaId: usuario?.id ?? "1" })}>
              <Text style={s.btn}>Ver Histórico</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: 40 },
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
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
  },
  metricLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: fontSize.md,
  },
  metricValor: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: "700",
  },
  destaque: {
    borderBottomWidth: 0,
    marginTop: spacing.xs,
  },
  metricValorDestaque: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: "700",
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
  alertasContainer: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  alertasTitulo: {
    color: colors.white,
    fontWeight: "700",
    fontSize: fontSize.md,
    marginBottom: spacing.xs,
  },
  alertaItem: {
    color: "rgba(255,255,255,0.9)",
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
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
  },
});