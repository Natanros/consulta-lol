// Serviço para consulta de invocador usando proxy local
// Em produção (Vercel), usar o próprio domínio. Em desenvolvimento, localhost
const PROXY_URL =
  process.env.REACT_APP_PROXY_URL ||
  (process.env.NODE_ENV === "production"
    ? "" // Em produção, usar o mesmo domínio (rotas relativas)
    : "http://localhost:3001"); // Em desenvolvimento, usar proxy local

// Interface para dados do invocador
interface SummonerData {
  name: string;
  level: number;
  icon: number;
  puuid: string;
  summonerId: string;
  accountId: string;
}

// Função para buscar dados com o proxy local
const fetchWithLocalProxy = async (endpoint: string) => {
  try {
    const response = await fetch(`${PROXY_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Timeout para evitar espera infinita
      signal: AbortSignal.timeout(5000), // 5 segundos
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Erro ao comunicar com proxy local:", error);

    // Se for erro de conexão recusada, mensagem mais clara
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Proxy local não está rodando. Execute: pnpm run proxy");
    }

    throw error;
  }
};

export const searchSummonerLocal = async (
  riotId: string
): Promise<SummonerData> => {
  // Validar formato do Riot ID
  const [gameName, tagLine] = riotId.split("#");

  if (!gameName || !tagLine) {
    throw new Error("Formato do Riot ID inválido. Use o formato: Nome#Tag");
  }

  try {
    // Passo 1: Buscar dados da conta pelo Riot ID
    const accountData = await fetchWithLocalProxy(
      `/api/account/${encodeURIComponent(gameName)}/${encodeURIComponent(
        tagLine
      )}`
    );

    if (!accountData || !accountData.puuid) {
      throw new Error("Conta não encontrada. Verifique o Riot ID.");
    }

    // Passo 2: Buscar dados do invocador pelo PUUID
    const summonerData = await fetchWithLocalProxy(
      `/api/summoner/by-puuid/${accountData.puuid}`
    );

    if (!summonerData || !summonerData.summonerLevel) {
      console.error("Dados inválidos recebidos:", summonerData);
      throw new Error("Dados do invocador não encontrados.");
    }

    // Retornar dados estruturados
    const result: SummonerData = {
      name: `${accountData.gameName}#${accountData.tagLine}`,
      level: summonerData.summonerLevel,
      icon: summonerData.profileIconId,
      puuid: accountData.puuid,
      summonerId: summonerData.id || summonerData.puuid,
      accountId:
        summonerData.accountId || summonerData.id || summonerData.puuid,
    };

    return result;
  } catch (error: any) {
    console.error("Erro na busca do invocador:", error);

    // Melhorar mensagens de erro para o usuário
    const errorMessage = error.message || error.toString();
    const errorResponse = error.response;

    // Erro de resposta HTTP
    if (errorResponse) {
      const status = errorResponse.status;

      if (status === 404) {
        const customError: any = new Error("Invocador não encontrado");
        customError.type = "NOT_FOUND";
        customError.suggestions = [
          "Verifique se o nome do invocador está correto",
          "Certifique-se de incluir a tag (ex: Nome#TAG)",
          "Confirme se o invocador está na região BR1",
        ];
        throw customError;
      } else if (status === 403) {
        const customError: any = new Error("Acesso negado pela API da Riot");
        customError.type = "FORBIDDEN";
        customError.suggestions = [
          "A chave da API pode estar inválida ou expirada",
          "Chaves de desenvolvimento expiram em 24 horas",
          "Verifique se a API key está configurada corretamente",
        ];
        throw customError;
      } else if (status === 429) {
        const customError: any = new Error("Limite de requisições excedido");
        customError.type = "RATE_LIMIT";
        customError.suggestions = [
          "Aguarde alguns segundos antes de tentar novamente",
          "A API da Riot tem limite de 20 req/segundo",
          "Tente novamente em 1-2 minutos",
        ];
        throw customError;
      } else if (status >= 500) {
        const customError: any = new Error("Erro nos servidores da Riot Games");
        customError.type = "SERVER_ERROR";
        customError.suggestions = [
          "Os servidores da Riot estão com problemas",
          "Tente novamente em alguns minutos",
          "Verifique o status em: status.riotgames.com",
        ];
        throw customError;
      }
    }

    // Erro de conexão
    if (
      errorMessage.includes("Failed to fetch") ||
      errorMessage.includes("NetworkError") ||
      errorMessage.includes("Network Error") ||
      errorMessage.includes("ECONNREFUSED")
    ) {
      const customError: any = new Error(
        "Não foi possível conectar ao servidor proxy"
      );
      customError.type = "CONNECTION_ERROR";
      customError.suggestions = [
        `Verifique se o servidor proxy está rodando em ${PROXY_URL}`,
        "Execute: npm run proxy",
        "Ou: npm run dev (para iniciar proxy + frontend)",
      ];
      throw customError;
    }

    // Erro genérico
    const customError: any = new Error(
      errorMessage || "Erro desconhecido ao buscar invocador"
    );
    customError.type = "UNKNOWN";
    throw customError;
  }
};

// Função para buscar rotação semanal via proxy local
export const getWeeklyRotationLocal = async () => {
  try {
    const data = await fetchWithLocalProxy("/api/rotation");

    if (!data || !data.freeChampionIds) {
      throw new Error("Dados de rotação inválidos");
    }

    return data;
  } catch (error: any) {
    console.error("Erro ao buscar rotação:", error);
    throw error;
  }
};

// Função auxiliar para obter URL do ícone do invocador
export const getSummonerIconUrl = (iconId: number): string => {
  return `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${iconId}.png`;
};

// Função para validar Riot ID
export const isValidRiotId = (riotId: string): boolean => {
  const pattern = /^.+#.+$/;
  return (
    pattern.test(riotId) &&
    riotId.includes("#") &&
    riotId.split("#").length === 2
  );
};

// Função para verificar se o proxy local está disponível
export const checkProxyHealth = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 segundos timeout

    const response = await fetch(`${PROXY_URL}/health`, {
      method: "GET",
      cache: "no-cache",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error: any) {
    if (error.name !== "AbortError") {
      console.error("Proxy local não está disponível:", error.message);
    }
    return false;
  }
};

// Buscar maestrias do jogador
export const getChampionMasteries = async (puuid: string) => {
  try {
    console.log(
      `🏆 Buscando maestrias para PUUID: ${puuid.substring(0, 20)}...`
    );
    const masteries = await fetchWithLocalProxy(
      `/api/champion-mastery/${puuid}`
    );
    console.log(`✅ ${masteries.length} maestrias encontradas`);
    return masteries;
  } catch (error: any) {
    console.error("❌ Erro ao buscar maestrias:", error);
    throw new Error("Não foi possível buscar as maestrias do jogador.");
  }
};

// Buscar histórico de partidas
export const getMatchHistory = async (puuid: string, count: number = 10) => {
  try {
    console.log(
      `📜 Buscando histórico de partidas para PUUID: ${puuid.substring(
        0,
        20
      )}...`
    );
    const matchIds = await fetchWithLocalProxy(
      `/api/match-history/${puuid}?count=${count}`
    );
    console.log(`✅ ${matchIds.length} partidas encontradas`);
    return matchIds;
  } catch (error: any) {
    console.error("❌ Erro ao buscar histórico:", error);
    throw new Error("Não foi possível buscar o histórico de partidas.");
  }
};

// Buscar detalhes de uma partida
export const getMatchDetails = async (matchId: string) => {
  try {
    console.log(`🎮 Buscando detalhes da partida: ${matchId}`);
    const matchData = await fetchWithLocalProxy(`/api/match/${matchId}`);
    console.log(`✅ Detalhes da partida obtidos`);
    return matchData;
  } catch (error: any) {
    console.error("❌ Erro ao buscar detalhes da partida:", error);
    throw new Error("Não foi possível buscar os detalhes da partida.");
  }
};
