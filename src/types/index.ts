export interface Atleta {
  id: string;
  nome: string;
  dataNascimento: string;
  esporte: string;
  equipeId?: string;
}

export interface DadosPreExercicio {
  massaCorporal: number;
  corUrina: number;             // escala 1–5
  sede: number;                 // escala 0–4
  historicoHidratacao?: string;
  sintomas: string[];
  pesadoCorretamente: boolean;
}

export interface DadosAmbiente {
  temperatura: number;          // °C
  umidade: number;              // %
  cidade: string;mkdir src\utils
echo "" > src\utils\calculos.ts
}

export interface DadosPosExercicio {
  massaCorporal: number;
  volumeIngerido: number;       // ml
  duracaoExercicio: number;     // minutos
}

export interface Avaliacao {
  id: string;
  atletaId: string;
  data: string;
  preExercicio: DadosPreExercicio;
  ambiente?: DadosAmbiente;
  posExercicio?: DadosPosExercicio;
  resultado?: ResultadoHidratacao;
}

export type ClassificacaoPerda = "leve" | "moderada" | "alta" | "critica";

export type ClassificacaoUrina =
  | "bem_hidratado"
  | "adequado"
  | "desidratado"
  | "muito_desidratado";

export interface ResultadoHidratacao {
  taxaSudorese: number;
  perdaHidricaAbsoluta: number;
  perdaHidricaPercentual: number;
  reposicaoRecomendada: number;
  classificacaoPerda: ClassificacaoPerda;
  classificacaoUrina: ClassificacaoUrina;
  alertas: string[];
}

export interface Equipe {
  id: string;
  nome: string;
  esporte: string;
}