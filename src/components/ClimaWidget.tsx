import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { DadosAmbiente } from "../types";
import { colors, fontSize, radius, spacing } from "../theme";

async function buscarClima(): Promise<DadosAmbiente> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current=temperature_2m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=1`;
  const res = await fetch(url);
  const data = await res.json();

  return {
    temperatura: data.current.temperature_2m,
    umidade: data.current.relative_humidity_2m,
    tempMax: data.daily.temperature_2m_max[0],
    tempMin: data.daily.temperature_2m_min[0],
    chuva: data.daily.precipitation_sum[0] > 0,
    cidade: "São Paulo",
  };
}

function gerarDica(clima: DadosAmbiente): string {
  if (clima.chuva)
    return "Previsão de chuva. Atenção à hipotermia pós-treino.";
  if (clima.temperatura >= 32)
    return "Calor intenso. Aumente a ingestão hídrica antes do treino.";
  if (clima.temperatura >= 26)
    return "Dia quente. Hidrate-se bem durante toda a sessão.";
  if (clima.umidade < 30)
    return "Umidade baixa. O suor evapora rápido — beba mais água.";
  if (clima.temperatura < 15)
    return "Temperatura baixa. Use agasalho no aquecimento e pós-treino.";
  return "Condições climáticas favoráveis para o treino.";
}

interface Props {
  onClimaCarregado?: (dados: DadosAmbiente) => void;
}

export default function ClimaWidget({ onClimaCarregado }: Props) {
  const [clima, setClima] = useState<DadosAmbiente | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarClima()
      .then((dados) => {
        setClima(dados);
        onClimaCarregado?.(dados);
      })
      .catch(() => setClima(null))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <View style={s.container}>
        <ActivityIndicator color={colors.white} size="small" />
      </View>
    );
  }

  if (!clima) return null;

  const dica = gerarDica(clima);

  return (
    <View style={s.container}>
      <View style={s.topo}>
        <View style={s.tempAtual}>
          <Text style={s.tempValor}>{clima.temperatura}°C</Text>
          <Text style={s.tempCidade}>{clima.cidade}</Text>
        </View>
        <View style={s.minMax}>
          <Text style={s.minMaxText}>↑ {clima.tempMax}°C</Text>
          <Text style={s.minMaxText}>↓ {clima.tempMin}°C</Text>
          <Text style={s.minMaxText}>💧 {clima.umidade}%</Text>
        </View>
      </View>
      <View style={s.dica}>
        <Text style={s.dicaTexto}>{gerarDica(clima)}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.sm,
  },
  topo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  tempAtual: {},
  tempValor: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  tempCidade: {
    color: "rgba(255,255,255,0.7)",
    fontSize: fontSize.xs,
  },
  minMax: {
    alignItems: "flex-start",
    gap: 2,
    marginLeft: spacing.sm,
  },
  minMaxText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: fontSize.xs,
  },
  dica: {
    paddingLeft: spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.2)",
    maxWidth: 200,
  },
  dicaTexto: {
    color: colors.white,
    fontSize: fontSize.xs,
  },
});