import { Avaliacao, Atleta, Equipe, UsuarioLocal } from "../types";

const isWeb =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any = null;

if (!isWeb) {
  const SQLite = require("expo-sqlite");
  db = SQLite.openDatabaseSync("deltah.db");
}

const USUARIOS_KEY = "usuarios_locais";

export function initDatabase(): void {
  if (isWeb) return;

  db.execSync(`
    CREATE TABLE IF NOT EXISTS equipes (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      esporte TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS atletas (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      dataNascimento TEXT NOT NULL,
      esporte TEXT NOT NULL,
      equipeId TEXT,
      FOREIGN KEY (equipeId) REFERENCES equipes(id)
    );

    CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      perfil TEXT NOT NULL,
      criadoEm TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS avaliacoes (
      id TEXT PRIMARY KEY,
      atletaId TEXT NOT NULL,
      data TEXT NOT NULL,
      dados TEXT NOT NULL,
      FOREIGN KEY (atletaId) REFERENCES atletas(id)
    );
  `);
}

export function inserirEquipe(equipe: Equipe): void {
  if (isWeb) return;

  db.runSync(`INSERT INTO equipes (id, nome, esporte) VALUES (?, ?, ?)`, [
    equipe.id,
    equipe.nome,
    equipe.esporte,
  ]);
}

export function listarEquipes(): Equipe[] {
  if (isWeb) return [];

  return db.getAllSync(`SELECT * FROM equipes`) as Equipe[];
}

export function inserirAtleta(atleta: Atleta): void {
  if (isWeb) return;

  db.runSync(
    `INSERT INTO atletas (id, nome, dataNascimento, esporte, equipeId) VALUES (?, ?, ?, ?, ?)`,
    [
      atleta.id,
      atleta.nome,
      atleta.dataNascimento,
      atleta.esporte,
      atleta.equipeId ?? null,
    ],
  );
}

export function listarAtletas(): Atleta[] {
  if (isWeb) return [];

  return db.getAllSync(`SELECT * FROM atletas`) as Atleta[];
}

export function listarAtletasPorEquipe(equipeId: string): Atleta[] {
  if (isWeb) return [];

  return db.getAllSync(`SELECT * FROM atletas WHERE equipeId = ?`, [
    equipeId,
  ]) as Atleta[];
}

export function listarUsuariosLocais(): UsuarioLocal[] {
  if (isWeb) {
    const raw = localStorage.getItem(USUARIOS_KEY);
    return raw ? (JSON.parse(raw) as UsuarioLocal[]) : [];
  }

  return db.getAllSync(`SELECT * FROM usuarios`) as UsuarioLocal[];
}

export function buscarUsuarioLocalPorEmail(email: string): UsuarioLocal | null {
  const emailNormalizado = email.trim().toLowerCase();

  if (isWeb) {
    const usuarios = listarUsuariosLocais();
    return (
      usuarios.find(
        (usuario) => usuario.email.toLowerCase() === emailNormalizado,
      ) ?? null
    );
  }

  const usuario = db.getFirstSync(
    `SELECT * FROM usuarios WHERE lower(email) = ?`,
    [emailNormalizado],
  ) as UsuarioLocal | null;

  return usuario ?? null;
}

export function inserirUsuarioLocal(usuario: UsuarioLocal): void {
  const emailNormalizado = usuario.email.trim().toLowerCase();
  const usuarioExistente = buscarUsuarioLocalPorEmail(emailNormalizado);

  if (usuarioExistente) {
    throw new Error("Já existe uma conta cadastrada com este email.");
  }

  const usuarioNormalizado: UsuarioLocal = {
    ...usuario,
    email: emailNormalizado,
  };

  if (isWeb) {
    const usuarios = listarUsuariosLocais();
    usuarios.unshift(usuarioNormalizado);
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
    return;
  }

  db.runSync(
    `INSERT INTO usuarios (id, nome, email, senha, perfil, criadoEm) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      usuarioNormalizado.id,
      usuarioNormalizado.nome,
      usuarioNormalizado.email,
      usuarioNormalizado.senha,
      usuarioNormalizado.perfil,
      usuarioNormalizado.criadoEm,
    ],
  );
}

export function autenticarUsuarioLocal(
  email: string,
  senha: string,
): UsuarioLocal | null {
  const usuario = buscarUsuarioLocalPorEmail(email);

  if (!usuario) return null;
  if (usuario.senha !== senha) return null;

  return usuario;
}

export function inserirAvaliacao(avaliacao: Avaliacao): void {
  if (isWeb) {
    const key = `avaliacoes_${avaliacao.atletaId}`;
    const existentes: Avaliacao[] = JSON.parse(
      localStorage.getItem(key) ?? "[]",
    );
    existentes.unshift(avaliacao);
    localStorage.setItem(key, JSON.stringify(existentes));
    return;
  }

  db.runSync(
    `INSERT INTO avaliacoes (id, atletaId, data, dados) VALUES (?, ?, ?, ?)`,
    [
      avaliacao.id,
      avaliacao.atletaId,
      avaliacao.data,
      JSON.stringify(avaliacao),
    ],
  );
}

export function listarAvaliacoesPorAtleta(atletaId: string): Avaliacao[] {
  if (isWeb) {
    const raw = localStorage.getItem(`avaliacoes_${atletaId}`);
    return raw ? (JSON.parse(raw) as Avaliacao[]) : [];
  }

  const rows = db.getAllSync(
    `SELECT dados FROM avaliacoes WHERE atletaId = ? ORDER BY data DESC`,
    [atletaId],
  ) as { dados: string }[];

  return rows.map((row) => JSON.parse(row.dados) as Avaliacao);
}
