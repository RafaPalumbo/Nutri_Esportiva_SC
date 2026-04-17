import { Platform } from "react-native";
import { Avaliacao, Atleta, Equipe } from "../types";

const isWeb = true;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any = null;

if (!isWeb) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const SQLite = require("expo-sqlite");
  db = SQLite.openDatabaseSync("deltah.db");
}

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
  db.runSync(`INSERT INTO equipes (id, nome, esporte) VALUES (?, ?, ?)`,
    [equipe.id, equipe.nome, equipe.esporte]);
}

export function listarEquipes(): Equipe[] {
  if (isWeb) return [];
  return db.getAllSync(`SELECT * FROM equipes`) as Equipe[];
}

export function inserirAtleta(atleta: Atleta): void {
  if (isWeb) return;
  db.runSync(
    `INSERT INTO atletas (id, nome, dataNascimento, esporte, equipeId) VALUES (?, ?, ?, ?, ?)`,
    [atleta.id, atleta.nome, atleta.dataNascimento, atleta.esporte, atleta.equipeId ?? null]
  );
}

export function listarAtletas(): Atleta[] {
  if (isWeb) return [];
  return db.getAllSync(`SELECT * FROM atletas`) as Atleta[];
}

export function listarAtletasPorEquipe(equipeId: string): Atleta[] {
  if (isWeb) return [];
  return db.getAllSync(`SELECT * FROM atletas WHERE equipeId = ?`, [equipeId]) as Atleta[];
}

export function inserirAvaliacao(avaliacao: Avaliacao): void {
  if (isWeb) return;
  db.runSync(
    `INSERT INTO avaliacoes (id, atletaId, data, dados) VALUES (?, ?, ?, ?)`,
    [avaliacao.id, avaliacao.atletaId, avaliacao.data, JSON.stringify(avaliacao)]
  );
}

export function listarAvaliacoesPorAtleta(atletaId: string): Avaliacao[] {
  if (isWeb) return [];
  const rows = db.getAllSync(
    `SELECT dados FROM avaliacoes WHERE atletaId = ? ORDER BY data DESC`,
    [atletaId]
  ) as { dados: string }[];
  return rows.map((row) => JSON.parse(row.dados) as Avaliacao);
}