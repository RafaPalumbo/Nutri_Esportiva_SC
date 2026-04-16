import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const CORES_URINA = [
  { id: 1, cor: "#F9E84C" },
  { id: 2, cor: "#E2C84A" },
  { id: 3, cor: "#C8A030" },
  { id: 4, cor: "#B87020" },
  { id: 5, cor: "#8B4000" },
];

const SINTOMAS = ["Náusea", "Fadiga", "Tontura", "Outro"];

export default function PesoEstadoBasal() {
  const [massa, setMassa] = useState("");
  const [pesadoCorretamente, setPesadoCorretamente] = useState(false);
  const [corSelecionada, setCorSelecionada] = useState<number | null>(null);
  const [sede, setSede] = useState(2);
  const [historicoHidratacao, setHistoricoHidratacao] = useState("");
  const [sintomasSelecionados, setSintomasSelecionados] = useState<string[]>([]);
  const [outro, setOutro] = useState("");

  function toggleSintoma(sintoma: string) {
    setSintomasSelecionados((prev) =>
      prev.includes(sintoma)
        ? prev.filter((s) => s !== sintoma)
        : [...prev, sintoma]
    );
  }

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLogo}>
          <Text style={s.headerLogoIcon}>✦</Text>
        </View>
        <Text style={s.headerTitle}>Nutri-Esportiva - São Camilo</Text>
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.sectionLabel}>• Peso e Estado Basal.</Text>

        {/* Card */}
        <View style={s.card}>

          {/* Massa corporal */}
          <Text style={s.fieldLabel}>• Massa corporal pré-exercício (kg) *</Text>
          <TextInput
            style={s.input}
            placeholder="ex: 75,5kg"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={massa}
            onChangeText={setMassa}
          />

          {/* Checklist bexiga */}
          <TouchableOpacity
            style={s.checkRow}
            onPress={() => setPesadoCorretamente(!pesadoCorretamente)}
          >
            <View style={[s.checkbox, pesadoCorretamente && s.checkboxChecked]}>
              {pesadoCorretamente && <Text style={s.checkMark}>✓</Text>}
            </View>
            <Text style={s.checkLabel}>Foi pesado com bexiga vazia e roupa padrão? *</Text>
          </TouchableOpacity>

          {/* Cor da Urina */}
          <Text style={s.fieldLabel}>• Cor da Urina (aproximadamente) *</Text>
          <View style={s.coresRow}>
            {CORES_URINA.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setCorSelecionada(item.id)}
                style={[
                  s.corBox,
                  { backgroundColor: item.cor },
                  corSelecionada === item.id && s.corBoxSelected,
                ]}
              />
            ))}
          </View>

          {/* Sede */}
          <Text style={s.fieldLabel}>• Sede *</Text>
          <View style={s.sedeContainer}>
            <Text style={s.sedeLabel}>Pouca Sede</Text>
            <View style={s.sedeTrack}>
              {[0, 1, 2, 3, 4].map((val) => (
                <TouchableOpacity
                  key={val}
                  onPress={() => setSede(val)}
                  style={[s.sedeDot, sede === val && s.sedeDotActive]}
                />
              ))}
            </View>
            <Text style={s.sedeLabel}>Muita Sede</Text>
          </View>

          {/* Histórico */}
          <Text style={s.fieldLabel}>• Histórico Recente de Hidratação</Text>
          <TextInput
            style={s.input}
            placeholder="ex: 0,5L nas últimas 2 horas"
            placeholderTextColor="#aaa"
            value={historicoHidratacao}
            onChangeText={setHistoricoHidratacao}
          />

          {/* Sintomas */}
          <Text style={s.fieldLabel}>• Sintomas</Text>
          {SINTOMAS.map((sintoma) => (
            <TouchableOpacity
              key={sintoma}
              style={s.checkRow}
              onPress={() => toggleSintoma(sintoma)}
            >
              <View style={[s.checkbox, sintomasSelecionados.includes(sintoma) && s.checkboxChecked]}>
                {sintomasSelecionados.includes(sintoma) && (
                  <Text style={s.checkMark}>✓</Text>
                )}
              </View>
              <Text style={s.checkLabel}>{sintoma}</Text>
            </TouchableOpacity>
          ))}

          {sintomasSelecionados.includes("Outro") && (
            <TextInput
              style={[s.input, { marginTop: 8 }]}
              placeholder="Descreva o sintoma"
              placeholderTextColor="#aaa"
              value={outro}
              onChangeText={setOutro}
            />
          )}

          {/* Botão Avançar */}
          <TouchableOpacity style={s.avancar}>
            <Text style={s.avancarText}>Avançar &gt;&gt;</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const VERMELHO = "#C8000A";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f0f0f0" },
  header: {
    backgroundColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: VERMELHO,
  },
  headerLogo: {
    width: 32, height: 32, borderRadius: 6,
    backgroundColor: VERMELHO,
    alignItems: "center", justifyContent: "center",
    marginRight: 10,
  },
  headerLogoIcon: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#222" },
  scroll: { padding: 16, paddingBottom: 40 },
  sectionLabel: {
    color: VERMELHO, fontWeight: "700",
    fontSize: 14, marginBottom: 10,
  },
  card: {
    backgroundColor: VERMELHO,
    borderRadius: 14,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  fieldLabel: {
    color: "#fff", fontWeight: "700",
    fontSize: 13, marginBottom: 8, marginTop: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#222",
  },
  checkRow: {
    flexDirection: "row", alignItems: "center", marginTop: 6,
  },
  checkbox: {
    width: 20, height: 20,
    borderWidth: 2, borderColor: "#fff",
    borderRadius: 4, marginRight: 10,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxChecked: { backgroundColor: "#fff" },
  checkMark: { color: VERMELHO, fontSize: 13, fontWeight: "bold" },
  checkLabel: { color: "#fff", fontSize: 13, flex: 1 },
  coresRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  corBox: {
    width: 44, height: 44, borderRadius: 10,
  },
  corBoxSelected: {
    borderWidth: 3, borderColor: "#fff",
    transform: [{ scale: 1.1 }],
  },
  sedeContainer: {
    flexDirection: "row", alignItems: "center",
    gap: 8, marginBottom: 4,
  },
  sedeLabel: { color: "#fff", fontSize: 11 },
  sedeTrack: {
    flex: 1, flexDirection: "row",
    justifyContent: "space-between", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20, paddingHorizontal: 6, paddingVertical: 4,
  },
  sedeDot: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  sedeDotActive: { backgroundColor: "#fff" },
  avancar: { alignItems: "flex-end", marginTop: 20 },
  avancarText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});