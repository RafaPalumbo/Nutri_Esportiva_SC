import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import Header from "../components/Header";
import CheckItem from "../components/CheckItem";
import { colors, fontSize, radius, spacing } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "DadosPosExercicio">;

const SINTOMAS_POS = [
  "Náusea",
  "Fadiga excessiva",
  "Tontura",
  "Cãibras",
  "Dor de cabeça",
];

export default function DadosPosExercicio({ navigation, route }: Props) {
  const [massaPos, setMassaPos] = useState("");
  const [volumeIngerido, setVolumeIngerido] = useState("");
  const [duracao, setDuracao] = useState("");
  const [sintomasSelecionados, setSintomasSelecionados] = useState<string[]>([]);
  const [roupaEncharcada, setRoupaEncharcada] = useState(false);

  const toggleSintoma = (sintoma: string) => {
    setSintomasSelecionados((prev) =>
      prev.includes(sintoma) ? prev.filter((s) => s !== sintoma) : [...prev, sintoma]
    );
  };

  function handleAvancar() {
    if (!massaPos || !volumeIngerido || !duracao) return;

    navigation.navigate("Resultado", {
      preExercicio: route.params.preExercicio,
      posExercicio: {
        massaCorporal: parseFloat(massaPos),
        volumeIngerido: parseFloat(volumeIngerido),
        duracaoExercicio: parseFloat(duracao),
      },
    });
  }

  return (
    <View style={s.root}>
      <Header titulo="Nutri-Esportiva - São Camilo" />
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.sectionTitle}>• Dados Pós-Exercício.</Text>

        <LinearGradient
          colors={["#8B0000", "#C8000A", "#D63031"]}
          locations={[0, 0.3, 1]}
          style={s.card}
        >
          <Text style={s.label}>Massa corporal pós-exercício (kg) *</Text>
          <TextInput
            style={s.input}
            placeholder="ex: 74,5kg"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={massaPos}
            onChangeText={(t) => setMassaPos(t.replace(",", "."))}
          />

          <Text style={s.label}>Volume de fluidos ingeridos durante o treino (ml) *</Text>
          <TextInput
            style={s.input}
            placeholder="ex: 500"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={volumeIngerido}
            onChangeText={setVolumeIngerido}
          />

          <Text style={s.label}>Duração do exercício (minutos) *</Text>
          <TextInput
            style={s.input}
            placeholder="ex: 60"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={duracao}
            onChangeText={setDuracao}
          />

          <CheckItem
            label="Roupa muito encharcada ou troca de vestimenta durante o treino?"
            checked={roupaEncharcada}
            onPress={() => setRoupaEncharcada(!roupaEncharcada)}
            textColor={colors.white}
          />

          <Text style={s.label}>• Sintomas pós-exercício</Text>
          {SINTOMAS_POS.map((sintoma) => (
            <CheckItem
              key={sintoma}
              label={sintoma}
              checked={sintomasSelecionados.includes(sintoma)}
              onPress={() => toggleSintoma(sintoma)}
              textColor={colors.white}
            />
          ))}

          <View style={s.botoes}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={s.btnVoltar}>&lt;&lt; Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAvancar}>
              <Text style={s.btnAvancar}>Avançar &gt;&gt;</Text>
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
  label: {
    color: colors.white,
    fontWeight: "700",
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    padding: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
  btnVoltar: {
    color: colors.white,
    fontWeight: "700",
    fontSize: fontSize.md,
  },
  btnAvancar: {
    color: colors.white,
    fontWeight: "700",
    fontSize: fontSize.md,
  },
});