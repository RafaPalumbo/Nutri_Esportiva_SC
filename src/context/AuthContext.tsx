import React, { createContext, useContext, useEffect, useState } from "react";
import { obterToken, removerToken, salvarToken, tokenValido, decodificarToken, Usuario } from "../auth";

interface AuthContextData {
  usuario: Usuario | null;
  token: string | null;
  logado: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  carregando: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function verificarSessao() {
      const tokenSalvo = await obterToken();
      if (tokenSalvo && tokenValido(tokenSalvo)) {
        const payload = decodificarToken(tokenSalvo);
        if (payload) {
          setToken(tokenSalvo);
          setUsuario(payload.usuario);
        }
      }
      setCarregando(false);
    }
    verificarSessao();
  }, []);

  async function login(novoToken: string) {
    await salvarToken(novoToken);
    const payload = decodificarToken(novoToken);
    if (payload) {
      setToken(novoToken);
      setUsuario(payload.usuario);
    }
  }

  async function logout() {
    await removerToken();
    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, token, logado: !!usuario, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}