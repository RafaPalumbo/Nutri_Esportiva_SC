import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../theme";


import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import PesoEstadoBasal from "../screens/PesoEstadoBasal";
import DadosPosExercicio from "../screens/DadosPosExercicio";
import Resultado from "../screens/Resultado";
import Historico from "../screens/Historico";
import Conta from "../screens/Conta";

import { DadosPreExercicio, DadosPosExercicio as DadosPosExercicioType } from "../types";

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  MainTabs: undefined;
  DadosPosExercicio: { preExercicio: DadosPreExercicio };
  Resultado: {
    preExercicio: DadosPreExercicio;
    posExercicio: DadosPosExercicioType;
  };
};

export type TabParamList = {
  Inicio: undefined;
  HistoricoTab: undefined;
  ContaTab: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  const { usuario } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          height: Platform.OS === "ios" ? 85 : 65,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#aaa",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={focused ? colors.primary : "#aaa"}
            />
          ),
        }}
      >
        {(props) => <PesoEstadoBasal {...props} />}
      </Tab.Screen>

      <Tab.Screen
        name="HistoricoTab"
        options={{
          tabBarLabel: "Histórico",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={24}
              color={focused ? colors.primary : "#aaa"}
            />
          ),
        }}
      >
        {() => <Historico atletaId={usuario?.id ?? ""} />}
      </Tab.Screen>

      <Tab.Screen
        name="ContaTab"
        component={Conta}
        options={{
          tabBarLabel: "Conta",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={focused ? colors.primary : "#aaa"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="DadosPosExercicio" component={DadosPosExercicio} />
      <Stack.Screen name="Resultado" component={Resultado} />
    </Stack.Navigator>
  );
}

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
    <SafeAreaProvider>
      <NavigationContainer>
        {logado ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}