# 🎮 LoL Consulta# 🏆 Consulta LoL - League of Legends Stats App

[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)](https://reactjs.org/)Uma aplicação React para consultar estatísticas e dados do League of Legends usando a API oficial da Riot Games.

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178c6?logo=typescript)](https://www.typescriptlang.org/)

[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com/)## 🚀 Funcionalidades

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

- 🔍 **Busca de Invocadores**: Pesquise por nome legacy ou Riot ID (ex: `Natan#9315`)

> Uma aplicação web moderna para consulta de dados do League of Legends, incluindo campeões, rotação semanal, invocadores e estatísticas de partidas.- 📅 **Rotação Semanal**: Veja os campeões gratuitos da semana

- 👥 **Informações de Campeões**: Dados detalhados dos campeões

![LoL Consulta Banner](https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg)- 🛡️ **Sistema de Itens**: Consulte itens e suas estatísticas

- 📊 **Dashboard**: Análises e estatísticas gerais

## 📋 Índice- 🔧 **Debug da API**: Ferramenta para diagnosticar problemas

- [Sobre o Projeto](#-sobre-o-projeto)## ⚙️ Configuração

- [Funcionalidades](#-funcionalidades)

- [Tecnologias](#-tecnologias)### 1. Clone o repositório

- [Pré-requisitos](#-pré-requisitos)

- [Instalação](#-instalação)```bash

- [Configuração](#-configuração)git clone <url-do-repositorio>

- [Como Usar](#-como-usar)cd consulta-lol

- [Estrutura do Projeto](#-estrutura-do-projeto)```

- [API Riot Games](#-api-riot-games)

- [Contribuindo](#-contribuindo)### 2. Instale as dependências

- [Licença](#-licença)

```bash

## 🎯 Sobre o Projetopnpm install

# ou

**LoL Consulta** é uma aplicação web que permite aos jogadores de League of Legends consultar informações detalhadas sobre:npm install

```

- 🏆 **Campeões**: Visualize todos os campeões com filtros por função, dificuldade e estatísticas

- 🎮 **Rotação Semanal**: Veja os campeões gratuitos da semana### 3. Configure a API da Riot

- 👤 **Perfil de Invocadores**: Busque jogadores e visualize maestrias e histórico de partidas

- ⚔️ **Detalhes de Campeões**: Informações completas sobre habilidades, skins e estatísticas1. Acesse [Riot Developer Portal](https://developer.riotgames.com/)

- 📊 **Dashboard**: Estatísticas gerais e análises2. Faça login e obtenha sua chave da API

3. Copie o arquivo `.env.example` para `.env`:

### ✨ Destaques ```bash

cp .env.example .env

- **Interface Moderna**: Design inspirado no universo de League of Legends com animações fluidas ```

- **Hero Section**: Destaque visual do campeão com maior maestria do invocador4. Edite o arquivo `.env` e adicione sua chave:

- **Responsivo**: Experiência otimizada para desktop, tablet e mobile ```env

- **Sistema de Proxy Local**: Solução definitiva para problemas de CORS com a API da Riot REACT_APP_API_KEY=SUA_CHAVE_DA_API_AQUI

- **Cache Inteligente**: Sistema de cache para melhor performance ```

## 🚀 Funcionalidades### 4. Execute o projeto

### 🏠 Página Principal```bash

- Listagem completa de campeões com paginaçãopnpm start

- Sistema de busca por nome ou título# ou

- Filtros por:npm start

  - Função (Assassino, Lutador, Mago, Atirador, Suporte, Tanque)```

  - Dificuldade (1 a 5 estrelas)

- Ordenação por nome, dificuldade ou atributosAbra [http://localhost:3000](http://localhost:3000) para ver a aplicação.

- Cards com informações visuais e estatísticas

## 🔐 Segurança da API

### 👤 Busca de Invocador

- **Hero Section**: Design tipo portfólio com:- ❗ **NUNCA** commite arquivos `.env` no Git

  - Splash art do campeão com maior maestria- ✅ Use sempre variáveis de ambiente para chaves da API

  - Informações do invocador (nome, nível)- ✅ O arquivo `.env` está incluído no `.gitignore`

  - Estatísticas do campeão principal- ✅ Use o arquivo `.env.example` como referência

- **Maestrias**: Top 5 campeões mais jogados com:

  - Imagens dos campeões## 🐛 Problemas Comuns

  - Nível de maestria

  - Pontos acumulados### API Key Expirada

  - Status (última vez jogado)

- **Histórico de Partidas**: Últimas 10 partidas com:Se você vir erros 401, sua chave pode estar expirada:

  - Campeão utilizado

  - KDA (Abates/Mortes/Assistências)1. Acesse `/api-debug` na aplicação

  - Modo de jogo2. Clique em "Como Renovar Chave da API"

  - Duração da partida3. Siga o guia passo-a-passo

  - Tempo decorrido

### Problemas de CORS

### 🎮 Rotação Semanal

- Visualização dos campeões gratuitos da semanaA aplicação está configurada para a região BR1. Para outras regiões, edite o arquivo `src/Services/riotAPI.ts`.

- Informações detalhadas de cada campeão

- Design de cards elegante## 🛠️ Scripts Disponíveis

### 📊 DashboardIn the project directory, you can run:

- Estatísticas gerais

- Análises de dados### `pnpm start` ou `npm start`

- Visualizações gráficas

Executa a aplicação em modo de desenvolvimento.\

## 🛠 TecnologiasAbra [http://localhost:3000](http://localhost:3000) para visualizar no navegador.

### FrontendA página recarregará automaticamente quando você fizer edições.\

- **React** 19.1.1 - Biblioteca JavaScript para interfacesVocê também verá erros de lint no console.

- **TypeScript** 4.9.5 - Superset tipado de JavaScript

- **React Router DOM** - Navegação entre páginas### `pnpm test` ou `npm test`

- **Axios** - Cliente HTTP para requisições

- **CSS3** - Estilização com Grid, Flexbox e animaçõesLaunches the test runner in the interactive watch mode.\

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### Backend

- **Node.js** - Ambiente de execução JavaScript### `npm run build`

- **Express.js** 4.x - Framework web minimalista

- **CORS** - Middleware para Cross-Origin Resource SharingBuilds the app for production to the `build` folder.\

- **dotenv** - Gerenciamento de variáveis de ambienteIt correctly bundles React in production mode and optimizes the build for the best performance.

### APIs ExternasThe build is minified and the filenames include the hashes.\

- **Riot Games API** - Dados oficiais de League of LegendsYour app is ready to be deployed!

- **Data Dragon** - CDN de assets do jogo (imagens, dados estáticos)

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Ferramentas de Desenvolvimento

- **pnpm** - Gerenciador de pacotes rápido e eficiente### `npm run eject`

- **Concurrently** - Execução simultânea de processos

- **React Scripts** - Scripts de build do Create React App**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

## 📦 Pré-requisitos

Antes de começar, você precisará ter instalado:Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

- [Node.js](https://nodejs.org/) (versão 16 ou superior)You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

- [pnpm](https://pnpm.io/) (ou npm/yarn)

- Chave de API da Riot Games## Learn More

## 🔧 InstalaçãoYou can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

1. **Clone o repositório**To learn React, check out the [React documentation](https://reactjs.org/).

```bash
git clone https://github.com/seu-usuario/consulta-lol.git
cd consulta-lol
```

2. **Instale as dependências**

```bash
pnpm install
# ou
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione sua chave da API:

```env
REACT_APP_API_KEY=sua_chave_aqui
API_KEY=sua_chave_aqui
```

> 💡 **Como obter uma API Key:**
>
> 1. Acesse [developer.riotgames.com](https://developer.riotgames.com/)
> 2. Faça login com sua conta Riot
> 3. Copie sua Development API Key
> 4. **Importante**: Chaves de desenvolvimento expiram em 24 horas

## ⚙️ Configuração

### Estrutura de Pastas

```
consulta-lol/
├── public/               # Arquivos públicos estáticos
│   ├── index.html
│   └── manifest.json
├── server/              # Servidor proxy Express
│   └── proxy.js         # Proxy para API da Riot
├── src/
│   ├── Components/      # Componentes reutilizáveis
│   │   ├── Layout/      # Layout principal da aplicação
│   │   ├── Sidebar/     # Menu lateral de navegação
│   │   └── ...
│   ├── Pages/          # Páginas da aplicação
│   │   ├── Home/        # Listagem de campeões
│   │   ├── SimpleSummoner/  # Perfil do invocador
│   │   ├── SimpleRotation/  # Rotação semanal
│   │   └── ...
│   ├── Routes/         # Configuração de rotas
│   ├── Services/       # Serviços e APIs
│   │   ├── api.ts      # Cliente Axios base
│   │   ├── localProxy.ts   # Integração com proxy
│   │   ├── championData.ts # Cache de campeões
│   │   └── ...
│   ├── Interfaces/     # TypeScript interfaces
│   ├── index.tsx       # Ponto de entrada
│   └── index.css       # Estilos globais
├── .env               # Variáveis de ambiente (não comitar!)
├── .env.example       # Exemplo de variáveis
├── package.json       # Dependências e scripts
└── tsconfig.json      # Configuração TypeScript
```

## 🚀 Como Usar

### Modo Desenvolvimento

Execute o servidor proxy e a aplicação React simultaneamente:

```bash
pnpm run dev
# ou
npm run dev
```

Isso irá:

- Iniciar o servidor proxy na porta `3001`
- Iniciar a aplicação React na porta `3000`
- Abrir automaticamente no navegador

### Executar Separadamente

**Apenas o proxy:**

```bash
pnpm run proxy
```

**Apenas o frontend:**

```bash
pnpm start
```

### Build para Produção

```bash
pnpm run build
# ou
npm run build
```

Os arquivos otimizados serão gerados na pasta `build/`.

## 🌐 Estrutura do Projeto

### Componentes Principais

#### Layout & Navegação

- **Layout**: Container principal da aplicação
- **Sidebar**: Menu lateral com navegação entre páginas

#### Páginas

- **Home**: Listagem e busca de campeões
- **SimpleSummoner**: Perfil detalhado do invocador
- **SimpleRotation**: Rotação semanal de campeões gratuitos
- **ChampionDetail**: Detalhes de um campeão específico
- **Dashboard**: Estatísticas e análises

#### Serviços

##### `localProxy.ts`

Gerencia comunicação com o servidor proxy local:

- `searchSummonerLocal()` - Busca invocador por Riot ID
- `getChampionMasteries()` - Maestrias do invocador
- `getMatchHistory()` - Histórico de partidas
- `getMatchDetails()` - Detalhes de uma partida

##### `championData.ts`

Sistema de cache de dados de campeões:

- `fetchAllChampions()` - Busca todos os campeões
- `getChampionById()` - Mapeia ID numérico para dados do campeão
- `getChampionImageUrl()` - URL da imagem do campeão
- `getChampionSplashUrl()` - URL da splash art

##### `smartProxy.ts`

Sistema inteligente de proxy com fallback:

- Tenta primeiro o proxy local
- Fallback para proxies públicos se necessário

### Servidor Proxy (`server/proxy.js`)

O servidor Express implementa 7 rotas principais:

1. `GET /health` - Health check do servidor
2. `GET /api/account/:gameName/:tagLine` - Buscar conta por Riot ID
3. `GET /api/summoner/by-puuid/:puuid` - Dados do invocador
4. `GET /api/rotation` - Rotação semanal
5. `GET /api/champion-mastery/:puuid` - Maestrias do invocador
6. `GET /api/match-history/:puuid` - Histórico de partidas
7. `GET /api/match/:matchId` - Detalhes de uma partida

**Propósito**: Resolver problemas de CORS fazendo requisições server-side para a API da Riot.

## 🔌 API Riot Games

### Endpoints Utilizados

#### Americas (Região)

- `riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}` - Dados da conta
- `match/v5/matches/by-puuid/{puuid}/ids` - IDs das partidas
- `match/v5/matches/{matchId}` - Detalhes da partida

#### BR1 (Plataforma)

- `lol/platform/v3/champion-rotations` - Rotação semanal
- `lol/summoner/v4/summoners/by-puuid/{puuid}` - Dados do invocador
- `lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}` - Maestrias

### Data Dragon (CDN)

- Versão: `15.19.1`
- Champion Data: `https://ddragon.leagueoflegends.com/cdn/{version}/data/pt_BR/champion.json`
- Imagens: `https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{name}.png`
- Splash Arts: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/{name}_0.jpg`

### Limitações da API

⚠️ **Development API Key**:

- Expira em 24 horas
- Limite de 20 requisições/segundo
- Limite de 100 requisições/2 minutos

🔥 **Production API Key**:

- Para projetos em produção
- Limites maiores
- Requer aprovação da Riot

## 🎨 Design e Estilos

### Paleta de Cores

- **Primário (Dourado)**: `#C89B3C`
- **Background Escuro**: `#0a0e12`, `#1a1e25`
- **Cards**: `rgba(30, 35, 40, 0.95)`
- **Borders**: `rgba(200, 155, 60, 0.3)`
- **Texto**: `#f0e6d2` (off-white)

### Animações

- Gradientes com shimmer effect
- Hover transitions suaves
- Fade-in para cards
- Scale transform em imagens

### Responsividade

- **Desktop**: Layout completo com sidebar expandida
- **Tablet (≤1024px)**: Grid adaptativo
- **Mobile (≤768px)**: Menu hambúrguer, single column

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**Nataniel**

- GitHub: [@seu-usuario](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- [Riot Games](https://www.riotgames.com/) pela API e Data Dragon
- Comunidade React pela documentação
- League of Legends pelos assets visuais

---

<p align="center">
  Feito com ❤️ e ☕ por <a href="https://github.com/seu-usuario">Nataniel</a>
</p>

<p align="center">
  ⚔️ <strong>League of Legends</strong> e <strong>Riot Games</strong> são marcas registradas da Riot Games, Inc.
</p>
