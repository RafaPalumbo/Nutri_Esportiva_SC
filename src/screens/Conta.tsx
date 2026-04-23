import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { colors, fontSize, radius, spacing } from "../theme";

export default function Conta() {
  const { usuario, logout } = useAuth();

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <Text style={s.titulo}>Minha Conta</Text>
      </View>

      <View style={s.card}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>
            {usuario?.nome?.charAt(0).toUpperCase() ?? "?"}
          </Text>
        </View>
        <Text style={s.nome}>{usuario?.nome}</Text>
        <Text style={s.email}>{usuario?.email}</Text>
        <View style={s.badge}>
          <Text style={s.badgeText}>{usuario?.perfil}</Text>
        </View>
      </View>

      <View style={s.menu}>
        <TouchableOpacity style={s.menuItem}>
          <Text style={s.menuItemText}> Atletas e Equipes</Text>
          <Text style={s.menuArrow}>&gt;</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.menuItem}>
          <Text style={s.menuItemText}> Relatórios</Text>
          <Text style={s.menuArrow}>&gt;</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.menuItem}>
          <Text style={s.menuItemText}> Privacidade e LGPD</Text>
          <Text style={s.menuArrow}>&gt;</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={s.btnLogout} onPress={logout}>
        <Text style={s.btnLogoutText}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  titulo: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
  },
  card: {
    backgroundColor: colors.white,
    margin: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  avatarText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "700",
  },
  nome: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  badge: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  menu: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    borderRadius: radius.lg,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  menuArrow: {
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  btnLogout: {
    margin: spacing.md,
    marginTop: "auto",
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  btnLogoutText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: fontSize.md,
  },
});