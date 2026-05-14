import React, { useState } from "react";
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
import { inserirUsuarioLocal } from "../database";
import { colors, fontSize, radius, spacing } from "../theme";

const INPUT_PLACEHOLDER = "#8A8580";

export default function Cadastro({ navigation }: any) {
  const { login } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [perfil, setPerfil] = useState<"nutricionista" | "atleta">(
    "nutricionista",
  );
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
      const usuario = {
        id: Date.now().toString(),
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha,
        perfil,
        criadoEm: new Date().toISOString(),
      };

      inserirUsuarioLocal(usuario);

      const mockToken =
        "eyJhbGciOiJIUzI1NiJ9." +
        btoa(
          JSON.stringify({
            usuario: {
              id: usuario.id,
              nome: usuario.nome,
              email: usuario.email,
              perfil: usuario.perfil,
            },
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
          }),
        ) +
        ".assinatura";

      await login(mockToken);
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao cadastrar usuário.",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={s.root}>
      <View style={s.decorCircleTop} />
      <View style={s.decorCircleBottom} />

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
            placeholderTextColor={INPUT_PLACEHOLDER}
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />

          <TextInput
            style={s.input}
            placeholder="Email"
            placeholderTextColor={INPUT_PLACEHOLDER}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={s.input}
            placeholder="Senha"
            placeholderTextColor={INPUT_PLACEHOLDER}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <TextInput
            style={s.input}
            placeholder="Confirmar senha"
            placeholderTextColor={INPUT_PLACEHOLDER}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />

          <Text style={s.perfilLabel}>Perfil</Text>

          <View style={s.perfilRow}>
            <TouchableOpacity
              style={[
                s.perfilBtn,
                perfil === "nutricionista" && s.perfilBtnActive,
              ]}
              onPress={() => setPerfil("nutricionista")}
            >
              <Text
                style={[
                  s.perfilBtnText,
                  perfil === "nutricionista" && s.perfilBtnTextActive,
                ]}
              >
                Nutricionista
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.perfilBtn, perfil === "atleta" && s.perfilBtnActive]}
              onPress={() => setPerfil("atleta")}
            >
              <Text
                style={[
                  s.perfilBtnText,
                  perfil === "atleta" && s.perfilBtnTextActive,
                ]}
              >
                Atleta
              </Text>
            </TouchableOpacity>
          </View>

          {erro ? <Text style={s.erro}>{erro}</Text> : null}

          <TouchableOpacity
            style={s.btn}
            onPress={handleCadastro}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={s.btnText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={s.btnLogin}
            onPress={() => navigation.goBack()}
          >
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
  root: {
    flex: 1,
    backgroundColor: "#FAF7F4",
    overflow: "hidden",
  },
  decorCircleTop: {
    position: "absolute",
    top: -120,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(214,48,49,0.08)",
  },
  decorCircleBottom: {
    position: "absolute",
    bottom: -140,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(139,0,0,0.06)",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.md,
  },
  container: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
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
    color: "#8A8580",
    marginBottom: spacing.lg,
  },
  input: {
    width: "100%",
    backgroundColor: "#F1ECE7",
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: "#E6DDD5",
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
    borderColor: "#E6DDD5",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  perfilBtnActive: {
    borderColor: colors.primary,
    backgroundColor: "#FBE9EA",
  },
  perfilBtnText: {
    fontSize: fontSize.sm,
    color: "#666",
    fontWeight: "700",
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
    color: "#8A8580",
  },
  btnLoginLink: {
    color: colors.primary,
    fontWeight: "700",
  },
});
