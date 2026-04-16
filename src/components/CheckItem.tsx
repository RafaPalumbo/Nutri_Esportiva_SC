import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { colors, fontSize, radius, spacing } from "../theme";

interface Props {
  label: string;
  checked: boolean;
  onPress: () => void;
  textColor?: string;
}

export default function CheckItem({ label, checked, onPress, textColor }: Props) {
  return (
    <TouchableOpacity style={s.row} onPress={onPress}>
      <View style={[s.box, checked && s.boxChecked]}>
        {checked && <Text style={s.mark}>✓</Text>}
      </View>
      <Text style={[s.label, textColor ? { color: textColor } : {}]}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  boxChecked: {
    backgroundColor: colors.white,
  },
  mark: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: "bold",
  },
  label: {
    color: colors.white,
    fontSize: fontSize.md,
    flex: 1,
  },
});