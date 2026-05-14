export interface Atleta {
  id: string;
  nome: string;
  dataNascimento: string;
  esporte: string;
  equipeId?: string;
}

export type ExposicaoSolar = "baixa" | "moderada" | "alta";

export interface DadosAmbiente {
  temperatura: number; // °C
  umidade: number; // %
  cidade: string;
  sensacaoTermica?: number; // °C
  vento?: number; // km/h
  exposicaoSolar?: ExposicaoSolar;
  tempMax?: number; // °C
  tempMin?: number; // °C
  chuva?: boolean;
}

export interface DadosPreExercicio {
  massaCorporal: number;
  corUrina: number; // escala 1–5
  sede: number; // escala 0–4
  historicoHidratacao?: string;
  sintomas: string[];
  pesadoCorretamente: boolean;

  modalidade?: string;
  duracaoPrevista?: number; // minutos
  intensidadePercebida?: number; // escala 0–10
  vestimenta?: string;
  equipamento?: string;
}

export interface DadosPosExercicio {
  massaCorporal: number;
  volumeIngerido: number; // ml
  volumeUrinario?: number; // ml
  duracaoExercicio: number; // minutos

  roupaEncharcada?: boolean;
  trocaVestimenta?: boolean;
  sintomas?: string[];
  toleranciaPlano?: string;
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

export type NivelRisco = "baixo" | "moderado" | "alto" | "critico";

export type CategoriaRisco =
  | "hipoidratacao"
  | "hiperidratacao"
  | "hiponatremia"
  | "calor"
  | "clinico"
  | "qualidade_medida";

export interface RiscoTriagem {
  id: string;
  categoria: CategoriaRisco;
  nivel: NivelRisco;
  mensagem: string;
  acao: string;
  encaminhar: boolean;
}

export interface RecomendacaoHidratacao {
  ingestaoAlvoMinMlHora: number;
  ingestaoAlvoMaxMlHora: number;
  intervaloMinutos: number;
  volumePorIntervaloMin: number;
  volumePorIntervaloMax: number;
}

export interface ResultadoHidratacao {
  taxaSudorese: number;
  perdaHidricaAbsoluta: number;
  perdaHidricaAjustada?: number;
  perdaHidricaPercentual: number;
  balanco: number; // ml — positivo = hiperidratação, negativo = deficit
  reposicaoRecomendada: number;
  recomendacao?: RecomendacaoHidratacao;
  classificacaoPerda: ClassificacaoPerda;
  classificacaoUrina: ClassificacaoUrina;
  alertas: string[];
  riscos?: RiscoTriagem[];
}

export interface Equipe {
  id: string;
  nome: string;
  esporte: string;
}

export interface UsuarioLocal {
  id: string;
  nome: string;
  email: string;
  senha: string;
  perfil: "nutricionista" | "atleta";
  criadoEm: string;
}
