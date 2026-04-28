import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { colors, fontSize, spacing, radius } from "../theme";

interface Props {
  titulo: string;
}

export default function Header({ titulo }: Props) {
  return (
    <View style={s.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={s.logo}
        resizeMode="contain"
      />
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
    marginRight: spacing.sm,
  },
  titulo: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
  },
});