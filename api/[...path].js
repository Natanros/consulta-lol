const axios = require("axios");

const RIOT_API_KEY = process.env.API_KEY || process.env.REACT_APP_API_KEY;

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Validar API Key
  if (!RIOT_API_KEY) {
    return res.status(500).json({
      error: "API Key não configurada",
      message: "Configure a variável de ambiente API_KEY no Vercel",
    });
  }

  const { path } = req.query;
  const endpoint = path ? path.join("/") : "";

  try {
    // Health check
    if (endpoint === "health") {
      return res.json({
        status: "ok",
        message: "Proxy funcionando!",
        timestamp: new Date().toISOString(),
      });
    }

    // Buscar conta por Riot ID
    if (endpoint.startsWith("account/")) {
      const parts = endpoint.split("/");
      const gameName = parts[1];
      const tagLine = parts[2];

      const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
        gameName
      )}/${encodeURIComponent(tagLine)}`;

      const response = await axios.get(url, {
        headers: { "X-Riot-Token": RIOT_API_KEY },
        timeout: 10000,
      });

      return res.json(response.data);
    }

    // Dados do invocador por PUUID
    if (endpoint.startsWith("summoner/by-puuid/")) {
      const puuid = endpoint.replace("summoner/by-puuid/", "");
      const url = `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;

      const response = await axios.get(url, {
        headers: { "X-Riot-Token": RIOT_API_KEY },
        timeout: 10000,
      });

      return res.json(response.data);
    }

    // Rotação semanal
    if (endpoint === "rotation") {
      const url = `https://br1.api.riotgames.com/lol/platform/v3/champion-rotations`;

      const response = await axios.get(url, {
        headers: { "X-Riot-Token": RIOT_API_KEY },
        timeout: 10000,
      });

      return res.json(response.data);
    }

    // Maestrias do campeão
    if (endpoint.startsWith("champion-mastery/")) {
      const puuid = endpoint.replace("champion-mastery/", "");
      const url = `https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`;

      const response = await axios.get(url, {
        headers: { "X-Riot-Token": RIOT_API_KEY },
        timeout: 10000,
      });

      return res.json(response.data);
    }

    // Histórico de partidas
    if (endpoint.startsWith("match-history/")) {
      const puuid = endpoint.replace("match-history/", "");
      const url = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`;

      const response = await axios.get(url, {
        headers: { "X-Riot-Token": RIOT_API_KEY },
        timeout: 10000,
      });

      return res.json(response.data);
    }

    // Detalhes da partida
    if (endpoint.startsWith("match/")) {
      const matchId = endpoint.replace("match/", "");
      const url = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`;

      const response = await axios.get(url, {
        headers: { "X-Riot-Token": RIOT_API_KEY },
        timeout: 10000,
      });

      return res.json(response.data);
    }

    // Endpoint não encontrado
    return res.status(404).json({
      error: "Endpoint não encontrado",
      path: endpoint,
    });
  } catch (error) {
    console.error("Erro no proxy:", error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data,
        status: error.response.status,
      });
    }

    return res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message,
    });
  }
};
