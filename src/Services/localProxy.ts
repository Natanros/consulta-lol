// Serviço para consulta de invocador usando proxy local
const PROXY_URL = process.env.REACT_APP_PROXY_URL || "http://localhost:3001";

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
  console.log(`🌐 Fazendo requisição para proxy local: ${endpoint}`);

  try {
    const response = await fetch(`${PROXY_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Resposta recebida do proxy local");
    return data;
  } catch (error: any) {
    console.error("❌ Erro ao comunicar com proxy local:", error);
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

  console.log(`🔍 [LOCAL PROXY] Buscando invocador: ${riotId}`);
  console.log(`📍 [LOCAL PROXY] Usando proxy URL: ${PROXY_URL}`);

  try {
    // Passo 1: Buscar dados da conta pelo Riot ID
    console.log("📡 [LOCAL PROXY] Buscando dados da conta...");
    const accountData = await fetchWithLocalProxy(
      `/api/account/${encodeURIComponent(gameName)}/${encodeURIComponent(
        tagLine
      )}`
    );

    if (!accountData || !accountData.puuid) {
      throw new Error("Conta não encontrada. Verifique o Riot ID.");
    }

    console.log("✅ Conta encontrada:", {
      gameName: accountData.gameName,
      tagLine: accountData.tagLine,
      puuid: accountData.puuid,
    });

    // Passo 2: Buscar dados do invocador pelo PUUID
    console.log("📡 Buscando dados do invocador...");
    const summonerData = await fetchWithLocalProxy(
      `/api/summoner/by-puuid/${accountData.puuid}`
    );

    console.log("📦 Raw summonerData recebido:", summonerData);

    if (!summonerData || !summonerData.summonerLevel) {
      console.error("❌ Dados inválidos:", summonerData);
      throw new Error("Dados do invocador não encontrados.");
    }

    console.log("✅ Dados do invocador obtidos:", {
      level: summonerData.summonerLevel,
      icon: summonerData.profileIconId,
      id: summonerData.id,
      accountId: summonerData.accountId,
    });

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

    console.log("🎉 Busca concluída com sucesso!");
    console.log("📦 Dados que serão retornados:", result);
    return result;
  } catch (error: any) {
    console.error("❌ Erro na busca do invocador:", error);

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
  console.log("🔍 Buscando rotação semanal via proxy local");

  try {
    const data = await fetchWithLocalProxy("/api/rotation");

    if (!data || !data.freeChampionIds) {
      throw new Error("Dados de rotação inválidos");
    }

    console.log(`✅ Rotação obtida - ${data.freeChampionIds.length} campeões`);
    return data;
  } catch (error: any) {
    console.error("❌ Erro ao buscar rotação:", error);
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
    console.log(`🔍 Verificando saúde do proxy em: ${PROXY_URL}/health`);
    const response = await fetch(`${PROXY_URL}/health`, {
      method: "GET",
      cache: "no-cache",
    });
    const isHealthy = response.ok;
    console.log(`🏥 Proxy health check: ${isHealthy ? "✅ OK" : "❌ FALHOU"}`);
    return isHealthy;
  } catch (error) {
    console.error("❌ Proxy local não está disponível:", error);
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
