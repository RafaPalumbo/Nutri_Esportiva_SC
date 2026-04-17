import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { colors } from "../theme";
import { DadosPreExercicio, DadosPosExercicio as DadosPosExercicioType } from "../types";
import Resultado from "../screens/Resultado";


import Login from "../screens/Login";
import PesoEstadoBasal from "../screens/PesoEstadoBasal";
import DadosPosExercicio from "../screens/DadosPosExercicio";

export type RootStackParamList = {
  Login: undefined;
  PesoEstadoBasal: undefined;
  DadosPosExercicio: { preExercicio: DadosPreExercicio };
  Resultado: {
    preExercicio: DadosPreExercicio;
    posExercicio: DadosPosExercicioType;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { logado, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {logado ? (
          <>
            <Stack.Screen name="PesoEstadoBasal" component={PesoEstadoBasal} />
            <Stack.Screen name="DadosPosExercicio" component={DadosPosExercicio} />
            <Stack.Screen name="Resultado" component={Resultado} />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

