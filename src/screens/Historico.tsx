import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../navigation";
import Header from "../components/Header";
import { colors, fontSize, radius, spacing } from "../theme";
import { listarAvaliacoesPorAtleta } from "../database";
import { Avaliacao, ClassificacaoPerda } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Historico">;

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

export default function Historico({ route, navigation }: Props) {
  const { atletaId } = route.params;
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

 useFocusEffect(
  useCallback(() => {
    const raw = localStorage.getItem(`avaliacoes_${atletaId}`);
    const dados = raw ? (JSON.parse(raw) as Avaliacao[]) : [];
    setAvaliacoes(dados);
  }, [atletaId])
);

  return (
    <View style={s.root}>
      <Header titulo="Nutri-Esportiva - São Camilo" />
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.sectionTitle}>• Histórico de Avaliações.</Text>

        {avaliacoes.length === 0 ? (
          <View style={s.vazio}>
            <Text style={s.vazioTexto}>Nenhuma avaliação registrada ainda.</Text>
          </View>
        ) : (
          avaliacoes.map((avaliacao) => {
            const resultado = avaliacao.resultado;
            if (!resultado) return null;

            return (
              <View key={avaliacao.id} style={s.card}>
                <View style={s.cardTopo}>
                  <Text style={s.cardData}>
                    {new Date(avaliacao.data).toLocaleDateString("pt-BR")}
                  </Text>
                  <View style={[s.badge, { backgroundColor: CORES_CLASSIFICACAO[resultado.classificacaoPerda] }]}>
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
                    <Text style={s.metricValor}>{resultado.perdaHidricaPercentual}%</Text>
                    <Text style={s.metricLabel}>Perda</Text>
                  </View>
                  <View style={s.metric}>
                    <Text style={s.metricValor}>{resultado.reposicaoRecomendada}</Text>
                    <Text style={s.metricLabel}>ml repor</Text>
                  </View>
                </View>

                {resultado.alertas.length > 0 && (
                  <Text style={s.alerta}>• {resultado.alertas[0]}</Text>
                )}
              </View>
            );
          })
        )}

        <TouchableOpacity style={s.btnNova} onPress={() => navigation.popToTop()}>
          <Text style={s.btnNovaText}>+ Nova Avaliação</Text>
        </TouchableOpacity>
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
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  vazio: {
    alignItems: "center",
    marginTop: spacing.xl,
  },
  vazioTexto: {
    color: colors.textMuted,
    fontSize: fontSize.md,
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
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  cardData: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.text,
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
  },
  metric: {
    alignItems: "center",
  },
  metricValor: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.primary,
  },
  metricLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  alerta: {
    marginTop: spacing.sm,
    fontSize: fontSize.xs,
    color: "#FF7043",
  },
  btnNova: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  btnNovaText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: fontSize.md,
  },
});