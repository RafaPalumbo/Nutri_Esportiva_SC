import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, Text, View, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/Header";
import CheckItem from "../components/CheckItem";
import { colors, spacing, radius, fontSize } from "../theme";

const SINTOMAS = ["Náusea", "Fadiga", "Tontura", "Outro"];

export default function PesoEstadoBasal() {
    const [massa, setMassa] = useState("");
    const [pesadoCorretamente, setPesadoCorretamente] = useState(false);
    const [corSelecionada, setCorSelecionada] = useState<number | null>(null);
    const [sede, setSede] = useState(0);
    const [historicoHidratacao, setHistoricoHidratacao] = useState("");
    const [sintomasSelecionados, setSintomasSelecionados] = useState<string[]>([]);
    const [outro, setOutro] = useState("");

    const toggleSintoma = (sintoma: string) => {
        setSintomasSelecionados((prev) =>
            prev.includes(sintoma) ? prev.filter((s) => s !== sintoma) : [...prev, sintoma]
        );
    };

    return (
        <View style={s.root}>
            <Header titulo="Nutri-Esportiva - São Camilo" />
            <ScrollView contentContainerStyle={s.scroll}>
                <Text style={s.sectionTitle}>• Peso e Estado Basal.</Text>

                <LinearGradient
                    colors={["#8B0000", "#C8000A", "#D63031"]}
                    locations={[0, 1]}
                    style={s.card}
                >
                    {/* Massa corporal */}
                    <Text style={s.label}>Massa corporal pré-exercício (kg) *</Text>
                    <TextInput
                        style={s.input}
                        placeholder="ex: 75,5kg"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={massa}
                        onChangeText={(t) => setMassa(t.replace(",", "."))}
                    />

                    <CheckItem
                        label="Foi pesado com bexiga vazia e roupa padrão? *"
                        checked={pesadoCorretamente}
                        onPress={() => setPesadoCorretamente(!pesadoCorretamente)}
                        textColor={colors.white}
                    />

                    {/* Cor da Urina */}
                    <Text style={s.label}>• Cor da Urina (aproximadamente) *</Text>
                    <View style={s.coresRow}>
                        {colors.urina.map((cor, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setCorSelecionada(index + 1)}
                                style={[
                                    s.corBox,
                                    { backgroundColor: cor },
                                    corSelecionada === index + 1 && s.corBoxSelected,
                                ]}
                            />
                        ))}
                    </View>

                    {/* Sede */}
                    <Text style={s.label}>• Sede *</Text>
                    <View style={s.sedeWrapper}>
                        <Text style={s.sedeText}>Pouca Sede</Text>
                        <View style={s.track}>
                            {[0, 1, 2, 3, 4].map((v) => (
                                <TouchableOpacity
                                    key={v}
                                    onPress={() => setSede(v)}
                                    style={[s.dot, sede === v && s.dotActive]}
                                />
                            ))}
                        </View>
                        <Text style={s.sedeText}>Muita Sede</Text>
                    </View>

                    {/* Histórico */}
                    <Text style={s.label}>• Histórico Recente de Hidratação</Text>
                    <TextInput
                        style={s.input}
                        placeholder="ex: 0,5L nas últimas 2 horas"
                        placeholderTextColor="#999"
                        value={historicoHidratacao}
                        onChangeText={setHistoricoHidratacao}
                    />

                    {/* Sintomas */}
                    <Text style={s.label}>• Sintomas</Text>
                    {SINTOMAS.map((sintoma) => (
                        <CheckItem
                            key={sintoma}
                            label={sintoma}
                            checked={sintomasSelecionados.includes(sintoma)}
                            onPress={() => toggleSintoma(sintoma)}
                            textColor={colors.white}
                        />
                    ))}

                    {sintomasSelecionados.includes("Outro") && (
                        <TextInput
                            style={[s.input, { marginTop: spacing.xs }]}
                            placeholder="Descreva o sintoma"
                            placeholderTextColor="#999"
                            value={outro}
                            onChangeText={setOutro}
                        />
                    )}

                    <TouchableOpacity style={s.avancar}>
                        <Text style={s.avancarText}>Avançar &gt;&gt;</Text>
                    </TouchableOpacity>
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
    coresRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.xs },
    corBox: {
        width: 45,
        height: 45,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
    },
    corBoxSelected: {
        borderWidth: 3,
        borderColor: colors.white,
        transform: [{ scale: 1.1 }],
    },
    sedeWrapper: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    sedeText: { color: colors.white, fontSize: fontSize.xs },
    track: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "rgba(255,255,255,0.3)",
        borderRadius: 15,
        padding: spacing.xs,
    },
    dot: { width: 18, height: 18, borderRadius: 9, backgroundColor: "rgba(255,255,255,0.4)" },
    dotActive: { backgroundColor: colors.white },
    avancar: { alignSelf: "flex-end", marginTop: spacing.lg },
    avancarText: { color: colors.white, fontWeight: "700", fontSize: fontSize.md },
});