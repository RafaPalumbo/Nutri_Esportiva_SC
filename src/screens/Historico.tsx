import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { colors, fontSize, radius, spacing } from "../theme";
import { listarAvaliacoesPorAtleta } from "../database";
import { Avaliacao, ClassificacaoPerda } from "../types";

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

export default function Historico({ atletaId }: Props) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

  useFocusEffect(
  useCallback(() => {
    const dados = listarAvaliacoesPorAtleta(atletaId);
    setAvaliacoes(dados);
  }, [atletaId])
);

  return (
    <SafeAreaView style={s.root}>
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
      </ScrollView>
    </SafeAreaView>
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
});