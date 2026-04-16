import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fontSize, radius, spacing } from "../theme";

interface Props {
  titulo: string;
}

export default function Header({ titulo }: Props) {
  return (
    <View style={s.container}>
      <View style={s.logo}>
        <Text style={s.logoIcon}>✦</Text>
      </View>
      <Text style={s.titulo}>{titulo}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  logoIcon: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: "bold",
  },
  titulo: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
  },
});