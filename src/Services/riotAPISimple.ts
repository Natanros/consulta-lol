// Versão alternativa da API da Riot usando fetch com configurações otimizadas
const RIOT_API_KEY = process.env.REACT_APP_API_KEY || "";

// Função para fazer requisições com retry automático
const makeRequestWithRetry = async (
  url: string,
  maxRetries = 3
): Promise<any> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-Riot-Token": RIOT_API_KEY,
        },
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      lastError = error;

      // Se não é a última tentativa, aguarda antes de tentar novamente
      if (attempt < maxRetries) {
        const delay = attempt * 1000; // 1s, 2s, 3s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
};

// Função simplificada para buscar rotação semanal
export const getWeeklyRotationSimple = async () => {
  const url = `https://br1.api.riotgames.com/lol/platform/v3/champion-rotations`;
  return makeRequestWithRetry(url);
};

// Função de teste para verificar conectividade
export const testRiotAPIConnectivity = async () => {
  try {
    if (!RIOT_API_KEY) {
      throw new Error("Chave da API não configurada");
    }

    const data = await getWeeklyRotationSimple();

    return {
      success: true,
      message: `Conectividade OK - ${data.freeChampionIds.length} campeões gratuitos encontrados`,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Erro de conectividade: ${error.message}`,
      data: null,
    };
  }
};

// Função para buscar dados básicos sem dependências externas
export const getBasicRotationData = async () => {
  try {
    const response = await fetch(
      "https://br1.api.riotgames.com/lol/platform/v3/champion-rotations",
      {
        headers: {
          "X-Riot-Token": RIOT_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    throw error;
  }
};
