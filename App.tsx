import "./global.css";
import { useEffect } from "react";
import { Platform } from "react-native";
import { AuthProvider } from "./src/context/AuthContext";
import Navigation from "./src/navigation";
import { initDatabase } from "./src/database";

export default function App() {
  useEffect(() => {
    if (Platform.OS !== "web") {
      initDatabase();
    }
  }, []);

  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}