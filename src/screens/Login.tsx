import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { autenticarUsuarioLocal } from "../database";
import { colors, fontSize, radius, spacing } from "../theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const INPUT_PLACEHOLDER = "#8A8580";

export default function Login({ navigation }: Props) {
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
      let usuario = null;

      if (email === "admin@deltah.com" && senha === "123456") {
        usuario = {
          id: "1",
          nome: "Rafael",
          email: "admin@deltah.com",
          perfil: "nutricionista" as const,
        };
      } else {
        const usuarioLocal = autenticarUsuarioLocal(email, senha);

        if (usuarioLocal) {
          usuario = {
            id: usuarioLocal.id,
            nome: usuarioLocal.nome,
            email: usuarioLocal.email,
            perfil: usuarioLocal.perfil,
          };
        }
      }

      if (!usuario) {
        setErro("Email ou senha incorretos.");
        return;
      }

      const mockToken =
        "eyJhbGciOiJIUzI1NiJ9." +
        btoa(
          JSON.stringify({
            usuario,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
          })
        ) +
        ".assinatura";

      await login(mockToken);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={s.root}>
      <View style={s.decorCircleTop} />
      <View style={s.decorCircleBottom} />

      <View style={s.container}>
        <Image
          source={require("../../assets/logo.png")}
          style={s.logo}
          resizeMode="contain"
        />

        <Text style={s.titulo}>DeltaH</Text>
        <Text style={s.subtitulo}>Hidratação Esportiva</Text>

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

        {erro ? <Text style={s.erro}>{erro}</Text> : null}

        <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={carregando}>
          {carregando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={s.btnText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={s.btnCadastro}
          onPress={() => navigation.navigate("Cadastro")}
        >
          <Text style={s.btnCadastroText}>
            Não tem conta? <Text style={s.btnCadastroLink}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FAF7F4",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.md,
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
  container: {
    width: "90%",
    maxWidth: 400,
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
    width: 64,
    height: 64,
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
  btnCadastro: {
    marginTop: spacing.md,
  },
  btnCadastroText: {
    fontSize: fontSize.sm,
    color: "#8A8580",
  },
  btnCadastroLink: {
    color: colors.primary,
    fontWeight: "700",
  },
});