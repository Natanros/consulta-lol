// Serviço para integração com a API da Riot Games
const RIOT_API_KEY = process.env.REACT_APP_API_KEY || "";
const BASE_URL = "https://br1.api.riotgames.com";
const AMERICAS_URL = "https://americas.api.riotgames.com";

// Interfaces para as respostas da API
export interface ChampionRotation {
  freeChampionIds: number[];
  freeChampionIdsForNewPlayers: number[];
  maxNewPlayerLevel: number;
}

export interface SummonerData {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface AccountData {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface MatchData {
  metadata: {
    dataVersion: string;
    matchId: string;
    participants: string[];
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    gameId: number;
    gameMode: string;
    gameType: string;
    queueId: number;
    participants: ParticipantData[];
    teams: TeamData[];
  };
}

export interface ParticipantData {
  puuid: string;
  summonerName: string;
  championId: number;
  championName: string;
  teamId: number;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  totalDamageDealtToChampions: number;
  goldEarned: number;
  totalMinionsKilled: number;
  wardsPlaced: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  summoner1Id: number;
  summoner2Id: number;
  perks: {
    styles: Array<{
      description: string;
      selections: Array<{
        perk: number;
        var1: number;
        var2: number;
        var3: number;
      }>;
      style: number;
    }>;
    statPerks: {
      defense: number;
      flex: number;
      offense: number;
    };
  };
}

export interface TeamData {
  teamId: number;
  win: boolean;
  bans: Array<{
    championId: number;
    pickTurn: number;
  }>;
  objectives: {
    baron: { first: boolean; kills: number };
    champion: { first: boolean; kills: number };
    dragon: { first: boolean; kills: number };
    inhibitor: { first: boolean; kills: number };
    riftHerald: { first: boolean; kills: number };
    tower: { first: boolean; kills: number };
  };
}

export interface ChampionMastery {
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  chestGranted: boolean;
  tokensEarned: number;
}

// Classe principal do serviço
class RiotAPIService {
  private apiKey: string;
  private baseUrl: string;
  private americasUrl: string;

  constructor() {
    this.apiKey = RIOT_API_KEY;
    this.baseUrl = BASE_URL;
    this.americasUrl = AMERICAS_URL;
  }

  // Método auxiliar para fazer requisições
  private async makeRequest(url: string): Promise<any> {
    try {
      // Verificar se a chave da API está configurada
      if (!this.apiKey) {
        throw new Error(
          "Chave da API não configurada. Verifique o arquivo .env"
        );
      }

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-Riot-Token": this.apiKey,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors", // Explicitly set CORS mode
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // Clear timeout if request succeeds

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro na API:", {
          status: response.status,
          statusText: response.statusText,
          url: url,
          response: errorText,
        });

        // Mensagens específicas de erro
        switch (response.status) {
          case 401:
            throw new Error(
              "Chave da API inválida ou expirada. Verifique sua RIOT_API_KEY."
            );
          case 403:
            throw new Error(
              "Acesso negado. Verifique as permissões da sua chave da API."
            );
          case 404:
            throw new Error(
              "Recurso não encontrado. Verifique se o nome/ID está correto."
            );
          case 429:
            throw new Error(
              "Muitas requisições. Aguarde alguns segundos e tente novamente."
            );
          case 500:
            throw new Error(
              "Erro interno do servidor da Riot. Tente novamente mais tarde."
            );
          case 503:
            throw new Error(
              "Serviço temporariamente indisponível. Tente novamente mais tarde."
            );
          default:
            throw new Error(
              `Erro HTTP ${response.status}: ${response.statusText}`
            );
        }
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      // Tratamento específico para erros de rede
      if (
        error instanceof TypeError &&
        error.message.includes("NetworkError")
      ) {
        throw new Error(
          "Erro de rede: Não foi possível conectar com a API da Riot. Verifique sua conexão com a internet."
        );
      }

      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Falha na requisição: Possível problema de CORS ou conectividade. Tente recarregar a página."
        );
      }

      if (error.name === "AbortError") {
        throw new Error(
          "Requisição cancelada: Timeout ou cancelamento da requisição."
        );
      }

      // Re-throw outros erros
      throw error;
    }
  }

  // Buscar rotação semanal de campeões gratuitos
  async getChampionRotation(): Promise<ChampionRotation> {
    const url = `${this.baseUrl}/lol/platform/v3/champion-rotations`;
    return this.makeRequest(url);
  }

  // Buscar dados de um invocador por nome
  async getSummonerByName(summonerName: string): Promise<SummonerData> {
    const encodedName = encodeURIComponent(summonerName);
    const url = `${this.baseUrl}/lol/summoner/v4/summoners/by-name/${encodedName}`;
    return this.makeRequest(url);
  }

  // Buscar dados de um invocador por PUUID
  async getSummonerByPuuid(puuid: string): Promise<SummonerData> {
    const url = `${this.baseUrl}/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    return this.makeRequest(url);
  }

  // Buscar conta por Riot ID (gameName#tagLine)
  async getAccountByRiotId(
    gameName: string,
    tagLine: string
  ): Promise<AccountData> {
    const encodedGameName = encodeURIComponent(gameName);
    const encodedTagLine = encodeURIComponent(tagLine);
    const url = `${this.americasUrl}/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}`;
    return this.makeRequest(url);
  }

  // Buscar invocador por Riot ID (método combinado)
  async getSummonerByRiotId(riotId: string): Promise<SummonerData> {
    // Separar gameName e tagLine
    const [gameName, tagLine] = riotId.split("#");

    if (!gameName || !tagLine) {
      throw new Error("Riot ID deve estar no formato: NomeDoJogador#TAG");
    }

    // Primeiro buscar a conta pelo Riot ID
    const account = await this.getAccountByRiotId(gameName, tagLine);

    // Depois buscar os dados do invocador pelo PUUID
    return this.getSummonerByPuuid(account.puuid);
  }

  // Buscar histórico de partidas de um jogador
  async getMatchHistory(puuid: string, count: number = 10): Promise<string[]> {
    const url = `${this.americasUrl}/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`;
    return this.makeRequest(url);
  }

  // Buscar detalhes de uma partida específica
  async getMatchDetails(matchId: string): Promise<MatchData> {
    const url = `${this.americasUrl}/lol/match/v5/matches/${matchId}`;
    return this.makeRequest(url);
  }

  // Buscar ranking de um jogador (Solo/Duo, Flex, etc.)
  async getRankedStats(summonerId: string): Promise<any[]> {
    const url = `${this.baseUrl}/lol/league/v4/entries/by-summoner/${summonerId}`;
    return this.makeRequest(url);
  }

  // Buscar maestria de campeões de um jogador
  async getChampionMasteries(
    summonerId: string,
    count: number = 10
  ): Promise<ChampionMastery[]> {
    const url = `${this.baseUrl}/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}?count=${count}`;
    return this.makeRequest(url);
  }

  // Buscar maestria de um campeão específico
  async getChampionMastery(
    summonerId: string,
    championId: number
  ): Promise<ChampionMastery> {
    const url = `${this.baseUrl}/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}/by-champion/${championId}`;
    return this.makeRequest(url);
  }

  // Buscar pontos totais de maestria
  async getTotalMasteryScore(summonerId: string): Promise<number> {
    const url = `${this.baseUrl}/lol/champion-mastery/v4/scores/by-summoner/${summonerId}`;
    return this.makeRequest(url);
  }

  // Verificar se jogador está em partida (Live Game)
  async getCurrentGame(summonerId: string): Promise<any> {
    const url = `${this.baseUrl}/lol/spectator/v4/active-games/by-summoner/${summonerId}`;
    return this.makeRequest(url);
  }

  // Buscar dados de uma região específica
  setRegion(region: string): void {
    const regionUrls: { [key: string]: string } = {
      br1: "https://br1.api.riotgames.com",
      na1: "https://na1.api.riotgames.com",
      euw1: "https://euw1.api.riotgames.com",
      eun1: "https://eun1.api.riotgames.com",
      kr: "https://kr.api.riotgames.com",
      jp1: "https://jp1.api.riotgames.com",
      oc1: "https://oc1.api.riotgames.com",
      tr1: "https://tr1.api.riotgames.com",
      ru: "https://ru.api.riotgames.com",
      la1: "https://la1.api.riotgames.com",
      la2: "https://la2.api.riotgames.com",
    };

    this.baseUrl = regionUrls[region] || regionUrls["br1"];
  }

  // Verificar status da API
  async getAPIStatus(): Promise<any> {
    const url = `${this.baseUrl}/lol/status/v4/platform-data`;
    return this.makeRequest(url);
  }

  // Testar se a chave da API está funcionando
  async testAPIKey(): Promise<{ valid: boolean; message: string }> {
    try {
      await this.getAPIStatus();
      return { valid: true, message: "Chave da API está funcionando!" };
    } catch (error: any) {
      return {
        valid: false,
        message: error.message || "Erro desconhecido ao testar a chave da API",
      };
    }
  }
}

// Instância única do serviço
export const riotAPI = new RiotAPIService();

// Função auxiliar para obter dados de campeão do Data Dragon
export const getChampionData = async (championId: number): Promise<any> => {
  try {
    // Cache estático para evitar muitas requisições
    const cacheKey = "champion_data_cache";
    const cached = sessionStorage.getItem(cacheKey);

    let championsData;
    if (cached) {
      championsData = JSON.parse(cached);
    } else {
      // Primeiro busca a versão mais recente
      const versionsResponse = await fetch(
        "https://ddragon.leagueoflegends.com/api/versions.json"
      );

      if (!versionsResponse.ok) {
        throw new Error(`Erro ao buscar versões: ${versionsResponse.status}`);
      }

      const versions = await versionsResponse.json();
      const latestVersion = versions[0];

      // Depois busca os dados dos campeões
      const championsResponse = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/pt_BR/champion.json`
      );

      if (!championsResponse.ok) {
        throw new Error(
          `Erro ao buscar dados de campeões: ${championsResponse.status}`
        );
      }

      championsData = await championsResponse.json();

      // Salvar no cache por 1 hora
      sessionStorage.setItem(cacheKey, JSON.stringify(championsData));
    }

    // Encontra o campeão pelo ID (os dados vêm com key que corresponde ao ID)
    const champion = Object.values(championsData.data).find(
      (champ: any) => parseInt(champ.key) === championId
    );

    return champion || null;
  } catch (error) {
    return null;
  }
};

// Função auxiliar para gerar URL de imagem do campeão
export const getChampionImageUrl = (championName: string): string => {
  return `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${championName}.png`;
};

// Função auxiliar para gerar URL de imagem do ícone do invocador
export const getSummonerIconUrl = (iconId: number): string => {
  return `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${iconId}.png`;
};

// Função auxiliar para gerar URL de item
export const getItemImageUrl = (itemId: number): string => {
  return `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/${itemId}.png`;
};

// Função auxiliar para formatar duração de partida
export const formatMatchDuration = (durationInSeconds: number): string => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Função auxiliar para calcular KDA
export const calculateKDA = (
  kills: number,
  deaths: number,
  assists: number
): number => {
  return deaths === 0
    ? kills + assists
    : Number(((kills + assists) / deaths).toFixed(2));
};

// Função auxiliar para obter nome do modo de jogo
export const getGameModeName = (queueId: number): string => {
  const queueTypes: { [key: number]: string } = {
    400: "Draft Normal",
    420: "Solo/Duo",
    430: "Normal Blind",
    440: "Flex 5v5",
    450: "ARAM",
    700: "Clash",
    830: "Co-op vs IA (Iniciante)",
    840: "Co-op vs IA (Intermediário)",
    850: "Co-op vs IA (Introdução)",
    900: "URF",
    1020: "One for All",
    1300: "Nexus Blitz",
    1400: "Ultimate Spellbook",
    1700: "Arena",
    1900: "Pick URF",
  };

  return queueTypes[queueId] || "Modo Personalizado";
};

// Função auxiliar para formatar tempo relativo
export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days} dia${days > 1 ? "s" : ""} atrás`;
  if (hours > 0) return `${hours} hora${hours > 1 ? "s" : ""} atrás`;
  if (minutes > 0) return `${minutes} minuto${minutes > 1 ? "s" : ""} atrás`;
  return "Agora mesmo";
};

// Função auxiliar para determinar cor do resultado da partida
export const getMatchResultColor = (win: boolean): string => {
  return win ? "#00C851" : "#FF4444";
};
