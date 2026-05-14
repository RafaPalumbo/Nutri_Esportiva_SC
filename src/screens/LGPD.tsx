import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function TelaLGPD() {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Privacidade e LGPD</Text>

      <ScrollView>
        <Text style={styles.texto}>
          Este aplicativo segue a Lei Geral de Proteção de Dados (LGPD).
          {"\n\n"}
          Seus dados são utilizados apenas para fins relacionados à hidratação
          esportiva e melhoria da experiência do usuário.
          {"\n\n"}
          Garantimos:
          {"\n"}• Segurança dos dados
          {"\n"}• Privacidade das informações
          {"\n"}• Transparência no uso dos dados
          {"\n"}• Possibilidade de exclusão da conta
          {"\n\n"}
          Ao utilizar o aplicativo, você concorda com nossa política de
          privacidade.
        </Text>
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.setaVoltar}
      >
        <Ionicons name="arrow-back-circle" size={42} color="#8B0000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#8B0000",
  },

  texto: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },

  botaoVoltar: {
    backgroundColor: "#8B0000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  setaVoltar: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
});
