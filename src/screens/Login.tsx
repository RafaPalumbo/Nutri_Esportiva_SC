import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors, fontSize, radius, spacing } from "../theme";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleLogin() {
    if (!email || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      // Mock temporário — substituir por chamada real à API
      if (email === "admin@deltah.com" && senha === "123456") {
        const mockToken =
          "eyJhbGciOiJIUzI1NiJ9." +
          btoa(
            JSON.stringify({
              usuario: {
                id: "1",
                nome: "Rafael",
                email: "admin@deltah.com",
                perfil: "nutricionista",
              },
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            })
          ) +
          ".assinatura";
        await login(mockToken);
      } else {
        setErro("Email ou senha incorretos.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={s.root}>
      <View style={s.container}>
        <Text style={s.logo}>✦</Text>
        <Text style={s.titulo}>DeltaH</Text>
        <Text style={s.subtitulo}>Hidratação Esportiva</Text>

        <TextInput
          style={s.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={s.input}
          placeholder="Senha"
          placeholderTextColor={colors.textMuted}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        {erro ? <Text style={s.erro}>{erro}</Text> : null}

        <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={carregando}>
          {carregando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={s.btnText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  logo: {
    fontSize: 40,
    color: colors.primary,
    fontWeight: "bold",
  },
  titulo: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.primary,
    marginTop: spacing.xs,
  },
  subtitulo: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
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
  erro: {
    color: colors.primary,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
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
});