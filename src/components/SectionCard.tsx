import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radius, spacing, fontSize } from "../theme";

interface Props {
  titulo: string;
  children: React.ReactNode;
}

export default function SectionCard({ titulo, children }: Props) {
  return (
    <View style={s.wrapper}>
      <Text style={s.titulo}>• {titulo}</Text>
      <View style={s.card}>{children}</View>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  titulo: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: fontSize.md,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});