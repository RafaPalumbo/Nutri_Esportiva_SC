import React, { useState } from "react";
import { supabase } from "../../src/services/supabase";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { colors, fontSize, radius, spacing } from "../theme";

export default function Cadastro({ navigation }: any) {
  const { login } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [perfil, setPerfil] = useState<"nutricionista" | "atleta">("nutricionista");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleCadastro() {
    if (!nome || !email || !senha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const { data, error } = await supabase
        .from("usuarios")
        .insert([
          {
            nome,
            email,
            perfil,
          },
        ])
        .select()
        .single();

      if (error) {
        setErro(error.message);
        return;
      }

      await login(JSON.stringify({ usuario: data }));

    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={s.root}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.container}>
          <Image
            source={require("../../assets/logo.png")}
            style={s.logo}
            resizeMode="contain"
          />
          <Text style={s.titulo}>Criar conta</Text>
          <Text style={s.subtitulo}>DeltaH — Hidratação Esportiva</Text>

          <TextInput
            style={s.input}
            placeholder="Nome completo"
            placeholderTextColor="#999"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />

          <TextInput
            style={s.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={s.input}
            placeholder="Senha"
            placeholderTextColor="#999"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <TextInput
            style={s.input}
            placeholder="Confirmar senha"
            placeholderTextColor="#999"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />

          <Text style={s.perfilLabel}>Perfil</Text>
          <View style={s.perfilRow}>
            <TouchableOpacity
              style={[s.perfilBtn, perfil === "nutricionista" && s.perfilBtnActive]}
              onPress={() => setPerfil("nutricionista")}
            >
              <Text style={[s.perfilBtnText, perfil === "nutricionista" && s.perfilBtnTextActive]}>
                Nutricionista
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.perfilBtn, perfil === "atleta" && s.perfilBtnActive]}
              onPress={() => setPerfil("atleta")}
            >
              <Text style={[s.perfilBtnText, perfil === "atleta" && s.perfilBtnTextActive]}>
                Atleta
              </Text>
            </TouchableOpacity>
          </View>

          {erro ? <Text style={s.erro}>{erro}</Text> : null}

          <TouchableOpacity style={s.btn} onPress={handleCadastro} disabled={carregando}>
            {carregando ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={s.btnText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={s.btnLogin} onPress={() => navigation.goBack()}>
            <Text style={s.btnLoginText}>
              Já tem conta? <Text style={s.btnLoginLink}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: "center", padding: spacing.md },
  container: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  logo: {
    width: 56,
    height: 56,
    marginBottom: spacing.sm,
  },
  titulo: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitulo: {
    fontSize: fontSize.sm,
    color: "#999",
    marginBottom: spacing.lg,
  },
  input: {
    width: "100%",
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  perfilLabel: {
    alignSelf: "flex-start",
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  perfilRow: {
    flexDirection: "row",
    gap: spacing.sm,
    width: "100%",
    marginBottom: spacing.sm,
  },
  perfilBtn: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
  },
  perfilBtnActive: {
    borderColor: colors.primary,
    backgroundColor: "#FBE9EA",
  },
  perfilBtnText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: "600",
  },
  perfilBtnTextActive: {
    color: colors.primary,
  },
  erro: {
    color: colors.primary,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
    alignSelf: "flex-start",
  },
  btn: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  btnText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: fontSize.md,
  },
  btnLogin: {
    marginTop: spacing.md,
  },
  btnLoginText: {
    fontSize: fontSize.sm,
    color: "#999",
  },
  btnLoginLink: {
    color: colors.primary,
    fontWeight: "700",
  },
});