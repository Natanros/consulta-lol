const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PROXY_PORT || 3001;
const RIOT_API_KEY = process.env.API_KEY || process.env.REACT_APP_API_KEY;

// Validar se a API key foi carregada
if (!RIOT_API_KEY) {
  console.error("❌ ERRO CRÍTICO: API Key não encontrada!");
  console.error(
    "Certifique-se de que o arquivo .env contém API_KEY ou REACT_APP_API_KEY"
  );
  process.exit(1);
}

// Configurar CORS para permitir requisições do frontend
app.use(cors());
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rota para buscar conta pelo Riot ID
app.get("/api/account/:gameName/:tagLine", async (req, res) => {
  const { gameName, tagLine } = req.params;

  try {
    console.log(`🔍 Buscando conta: ${gameName}#${tagLine}`);

    const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      gameName
    )}/${encodeURIComponent(tagLine)}`;

    const response = await axios.get(url, {
      headers: {
        "X-Riot-Token": RIOT_API_KEY,
      },
      timeout: 10000,
    });

    console.log(
      `✅ Conta encontrada: ${response.data.gameName}#${response.data.tagLine}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(`❌ Erro ao buscar conta:`, error.message);

    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data || "Erro na API da Riot",
        status: error.response.status,
      });
    } else {
      res.status(500).json({
        error: "Erro ao conectar com a API da Riot",
        message: error.message,
      });
    }
  }
});

// Rota para buscar dados do summoner pelo PUUID
app.get("/api/summoner/by-puuid/:puuid", async (req, res) => {
  const { puuid } = req.params;

  try {
    console.log(
      `🔍 Buscando summoner pelo PUUID: ${puuid.substring(0, 20)}...`
    );

    const url = `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;

    const response = await axios.get(url, {
      headers: {
        "X-Riot-Token": RIOT_API_KEY,
      },
      timeout: 10000,
    });

    console.log(
      `✅ Summoner encontrado - Level: ${response.data.summonerLevel}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(`❌ Erro ao buscar summoner:`, error.message);

    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data || "Erro na API da Riot",
        status: error.response.status,
      });
    } else {
      res.status(500).json({
        error: "Erro ao conectar com a API da Riot",
        message: error.message,
      });
    }
  }
});

// Rota para buscar rotação semanal
app.get("/api/rotation", async (req, res) => {
  try {
    console.log(`🔍 Buscando rotação semanal`);

    const url =
      "https://br1.api.riotgames.com/lol/platform/v3/champion-rotations";

    const response = await axios.get(url, {
      headers: {
        "X-Riot-Token": RIOT_API_KEY,
      },
      timeout: 10000,
    });

    console.log(
      `✅ Rotação obtida - ${response.data.freeChampionIds.length} campeões`
    );
    res.json(response.data);
  } catch (error) {
    console.error(`❌ Erro ao buscar rotação:`, error.message);

    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data || "Erro na API da Riot",
        status: error.response.status,
      });
    } else {
      res.status(500).json({
        error: "Erro ao conectar com a API da Riot",
        message: error.message,
      });
    }
  }
});

// Rota para buscar maestrias do campeão
app.get("/api/champion-mastery/:puuid", async (req, res) => {
  const { puuid } = req.params;

  try {
    console.log(
      `🏆 Buscando maestrias do jogador: ${puuid.substring(0, 20)}...`
    );

    const url = `https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`;

    const response = await axios.get(url, {
      headers: {
        "X-Riot-Token": RIOT_API_KEY,
      },
      timeout: 10000,
    });

    console.log(`✅ ${response.data.length} maestrias encontradas`);
    res.json(response.data);
  } catch (error) {
    console.error(`❌ Erro ao buscar maestrias:`, error.message);

    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data || "Erro na API da Riot",
        status: error.response.status,
      });
    } else {
      res.status(500).json({
        error: "Erro ao conectar com a API da Riot",
        message: error.message,
      });
    }
  }
});

// Rota para buscar histórico de partidas
app.get("/api/match-history/:puuid", async (req, res) => {
  const { puuid } = req.params;
  const { count = 10 } = req.query; // Número de partidas (padrão 10)

  try {
    console.log(
      `📜 Buscando histórico de partidas: ${puuid.substring(0, 20)}...`
    );

    // Primeiro, buscar a lista de IDs das partidas
    const matchListUrl = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`;

    const matchListResponse = await axios.get(matchListUrl, {
      headers: {
        "X-Riot-Token": RIOT_API_KEY,
      },
      timeout: 10000,
    });

    console.log(`✅ ${matchListResponse.data.length} partidas encontradas`);
    res.json(matchListResponse.data);
  } catch (error) {
    console.error(`❌ Erro ao buscar histórico:`, error.message);

    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data || "Erro na API da Riot",
        status: error.response.status,
      });
    } else {
      res.status(500).json({
        error: "Erro ao conectar com a API da Riot",
        message: error.message,
      });
    }
  }
});

// Rota para buscar detalhes de uma partida específica
app.get("/api/match/:matchId", async (req, res) => {
  const { matchId } = req.params;

  try {
    console.log(`🎮 Buscando detalhes da partida: ${matchId}`);

    const url = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`;

    const response = await axios.get(url, {
      headers: {
        "X-Riot-Token": RIOT_API_KEY,
      },
      timeout: 10000,
    });

    console.log(`✅ Detalhes da partida obtidos`);
    res.json(response.data);
  } catch (error) {
    console.error(`❌ Erro ao buscar partida:`, error.message);

    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data || "Erro na API da Riot",
        status: error.response.status,
      });
    } else {
      res.status(500).json({
        error: "Erro ao conectar com a API da Riot",
        message: error.message,
      });
    }
  }
});

// Rota de health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!RIOT_API_KEY,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Proxy server rodando em http://localhost:${PORT}`);
  console.log(`🔑 API Key configurada: ${RIOT_API_KEY ? "Sim" : "Não"}`);
  if (RIOT_API_KEY) {
    console.log(
      `🔐 API Key (primeiros 15 chars): ${RIOT_API_KEY.substring(0, 15)}...`
    );
  }
  console.log(`\n📋 Rotas disponíveis:`);
  console.log(`   GET /health - Health check`);
  console.log(`   GET /api/account/:gameName/:tagLine - Buscar conta`);
  console.log(`   GET /api/summoner/by-puuid/:puuid - Buscar summoner`);
  console.log(`   GET /api/rotation - Buscar rotação semanal`);
  console.log(`   GET /api/champion-mastery/:puuid - Buscar maestrias`);
  console.log(`   GET /api/match-history/:puuid?count=10 - Buscar histórico`);
  console.log(`   GET /api/match/:matchId - Buscar detalhes da partida\n`);
});

module.exports = app;
