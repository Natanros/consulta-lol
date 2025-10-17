// Serviço para usar a API Serverless do Vercel
// Este serviço faz requisições para /api/* que são processadas pelas serverless functions

const VERCEL_API_BASE = "/api"; // Relativo ao domínio atual

// Interface para dados do invocador
interface SummonerData {
  name: string;
  level: number;
  icon: number;
  puuid: string;
  summonerId: string;
  accountId: string;
}

// Função para buscar dados com a API Vercel
const fetchWithVercelAPI = async (endpoint: string) => {
  console.log(`🌐 Fazendo requisição para API Vercel: ${endpoint}`);

  try {
    const url = `${VERCEL_API_BASE}${endpoint}`;
    console.log(`📍 URL completa: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Timeout para evitar espera infinita
      signal: AbortSignal.timeout(10000), // 10 segundos
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Resposta recebida da API Vercel");
    return data;
  } catch (error: any) {
    console.error("❌ Erro ao comunicar com API Vercel:", error);

    // Se for erro de timeout
    if (error.name === "AbortError" || error.name === "TimeoutError") {
      throw new Error("Timeout ao buscar dados. Tente novamente.");
    }

    throw error;
  }
};

// Função para buscar invocador via API Vercel
export const searchSummonerVercel = async (
  riotId: string
): Promise<SummonerData> => {
  // Validar formato do Riot ID
  const [gameName, tagLine] = riotId.split("#");

  if (!gameName || !tagLine) {
    throw new Error("Formato do Riot ID inválido. Use o formato: Nome#Tag");
  }

  console.log(`🔍 [VERCEL API] Buscando invocador: ${riotId}`);

  try {
    // Passo 1: Buscar dados da conta pelo Riot ID
    console.log("📡 [VERCEL API] Buscando dados da conta...");
    const accountData = await fetchWithVercelAPI(
      `/account/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
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
    console.log("📡 [VERCEL API] Buscando dados do invocador...");
    const summonerData = await fetchWithVercelAPI(
      `/summoner/by-puuid/${accountData.puuid}`
    );

    if (!summonerData || !summonerData.summonerLevel) {
      console.error("❌ Dados inválidos:", summonerData);
      throw new Error("Dados do invocador não encontrados.");
    }

    console.log("✅ Dados do invocador obtidos:", {
      level: summonerData.summonerLevel,
      icon: summonerData.profileIconId,
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

    console.log("🎉 Busca concluída com sucesso via API Vercel!");
    return result;
  } catch (error: any) {
    console.error("❌ Erro na busca do invocador via Vercel:", error);
    throw error;
  }
};

// Função para buscar rotação semanal via API Vercel
export const getWeeklyRotationVercel = async () => {
  console.log("🔍 [VERCEL API] Buscando rotação semanal");

  try {
    const data = await fetchWithVercelAPI("/rotation");

    if (!data || !data.freeChampionIds) {
      throw new Error("Dados de rotação inválidos");
    }

    console.log(`✅ Rotação obtida - ${data.freeChampionIds.length} campeões`);
    return data;
  } catch (error: any) {
    console.error("❌ Erro ao buscar rotação via Vercel:", error);
    throw error;
  }
};

// Função para verificar se a API Vercel está disponível
export const checkVercelAPIHealth = async (): Promise<boolean> => {
  try {
    console.log(`🔍 Verificando saúde da API Vercel...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout

    const response = await fetch(`${VERCEL_API_BASE}/health`, {
      method: "GET",
      cache: "no-cache",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const isHealthy = response.ok;
    console.log(
      `🏥 Vercel API health check: ${isHealthy ? "✅ OK" : "❌ FALHOU"}`
    );
    return isHealthy;
  } catch (error: any) {
    console.error("❌ API Vercel não está disponível:", error.message);
    return false;
  }
};
