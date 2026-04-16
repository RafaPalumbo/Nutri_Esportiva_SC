# 💧 DeltaH

> Aplicação mobile e web para avaliação da taxa de sudorese e suporte à tomada de decisão em hidratação esportiva.

Desenvolvida como Trabalho de Conclusão de Curso (TCC) — Sistemas de Informação, Centro Universitário São Camilo.

---

## 📋 Sobre o Projeto

O **DeltaH** auxilia atletas e profissionais de saúde a calcular a taxa de sudorese individual, classificar o nível de hidratação e emitir alertas clínicos de risco, com base em dados coletados antes e após o exercício.

### Funcionalidades principais

- Cálculo da taxa de sudorese (ml/h)
- Recomendação de reposição hídrica personalizada
- Histórico de avaliações com exportação em PDF
- Triagem clínica por **cor de urina** (escala visual com orientação de risco)
- Integração com dados de **clima em tempo real** via Open-Meteo API

---

## 🗂️ Estrutura do Repositório

```
deltah/
├── mobile/          # App React Native (Expo)
├── web/             # Interface web (React + Vite)
├── backend/         # API REST (Node.js + Express)
└── docs/            # Documentação do TCC
```

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Mobile | React Native · Expo · NativeWind |
| Web | React · Vite · Tailwind CSS |
| Backend | Node.js · Express · TypeScript |
| Banco de Dados | Expo SQLite (offline) · PostgreSQL (sync) |
| Autenticação | JWT |
| Testes | Jest |
| Relatórios | react-native-html-to-pdf |

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [PostgreSQL](https://www.postgresql.org/) (para o backend)

---

## 🚀 Como Executar

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/deltah.git
cd deltah
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # configure as variáveis de ambiente
npm run dev
```

### 3. Mobile

```bash
cd mobile
npm install
npx expo start
```

### 4. Web

```bash
cd web
npm install
npm run dev
```

---

## 🌦️ Integração com Clima (Open-Meteo)

O DeltaH consome a [Open-Meteo API](https://open-meteo.com/) para obter dados de temperatura e umidade em tempo real, enriquecendo a análise de hidratação com o contexto ambiental do treino. Nenhuma chave de API é necessária — o serviço é gratuito e open-source.

---

## 🟡 Triagem por Cor de Urina

O módulo de triagem clínica utiliza uma escala visual de 8 níveis de coloração da urina para auxiliar na identificação de estados de hipo ou hiperidratação. A classificação é baseada em literatura científica e orienta o usuário com recomendações de conduta.

> ⚠️ Este módulo tem caráter informativo e de apoio à decisão. Não substitui avaliação médica ou nutricional.

---

## 📁 Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/` com base no `.env.example`:

```env
PORT=3333
DATABASE_URL=postgresql://usuario:senha@localhost:5432/deltah
JWT_SECRET=sua_chave_secreta
```

---

## 🗓️ Roadmap

| Período | Fase |
|---------|------|
| Abril | Setup do projeto e motor de cálculo |
| Maio | Integração com clima e módulo de triagem por cor de urina |
| Junho | Finalização, documentação e defesa do TCC |

---

## 👨‍💻 Autor

**Rafael**
Sistemas de Informação — Centro Universitário São Camilo

---

## 📄 Licença

Este projeto é de uso acadêmico. Todos os direitos reservados ao autor.
