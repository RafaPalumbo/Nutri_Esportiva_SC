import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "deltah_token";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: "nutricionista" | "atleta";
}

export interface TokenPayload {
  usuario: Usuario;
  exp: number;
}

async function salvar(key: string, value: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function obter(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
}

async function remover(key: string) {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export async function salvarToken(token: string): Promise<void> {
  await salvar(TOKEN_KEY, token);
}

export async function obterToken(): Promise<string | null> {
  return await obter(TOKEN_KEY);
}

export async function removerToken(): Promise<void> {
  await remover(TOKEN_KEY);
}

export function decodificarToken(token: string): TokenPayload | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded as TokenPayload;
  } catch {
    return null;
  }
}

export function tokenValido(token: string): boolean {
  const payload = decodificarToken(token);
  if (!payload) return false;
  return payload.exp * 1000 > Date.now();
}