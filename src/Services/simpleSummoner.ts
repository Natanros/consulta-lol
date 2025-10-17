// Serviço para consulta de invocador usando API funcional
const API_KEY = process.env.REACT_APP_API_KEY || "";
const BASE_URL_AMERICAS = "https://americas.api.riotgames.com";
const BASE_URL_BR = "https://br1.api.riotgames.com";

// Interface para dados do invocador
interface SummonerData {
  name: string;
  level: number;
  icon: number;
  puuid: string;
  summonerId: string;
  accountId: string;
}

// Lista de proxies CORS para tentar
const CORS_PROXIES = [
  {
    name: "API AllOrigins (JSON)",
    buildUrl: (url: string) => {
      const urlWithKey = `${url}?api_key=${API_KEY}`;
      return `https://api.allorigins.win/get?url=${encodeURIComponent(
        urlWithKey
      )}`;
    },
    parseResponse: async (response: Response) => {
      const result = await response.json();
      if (result.contents) {
        return JSON.parse(result.contents);
      }
      throw new Error("Resposta vazia do proxy");
    },
    headers: {},
  },
  {
    name: "AllOrigins Raw",
    buildUrl: (url: string) => {
      const urlWithKey = `${url}?api_key=${API_KEY}`;
      return `https://api.allorigins.win/raw?url=${encodeURIComponent(
        urlWithKey
      )}`;
    },
    parseResponse: (response: Response) => response.json(),
    headers: {},
  },
  {
    name: "Proxy via Thingproxy",
    buildUrl: (url: string) => {
      const urlWithKey = `${url}?api_key=${API_KEY}`;
      return `https://thingproxy.freeboard.io/fetch/${urlWithKey}`;
    },
    parseResponse: (response: Response) => response.json(),
    headers: {},
  },
  {
    name: "Corsproxy.io",
    buildUrl: (url: string) => {
      const urlWithKey = `${url}?api_key=${API_KEY}`;
      return `https://corsproxy.io/?${encodeURIComponent(urlWithKey)}`;
    },
    parseResponse: (response: Response) => response.json(),
    headers: {},
  },
];

// Função auxiliar para adicionar timeout em promises
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout = 8000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Timeout: requisição demorou muito");
    }
    throw error;
  }
};

// Função para buscar dados usando uma API proxy funcional
const fetchWithProxy = async (url: string) => {
  console.log(`🌐 Fazendo requisição para: ${url}`);

  // Tentar cada proxy em sequência
  for (const proxy of CORS_PROXIES) {
    try {
      console.log(`🔄 Tentando proxy: ${proxy.name}`);
      const proxyUrl = proxy.buildUrl(url);

      const response = await fetchWithTimeout(
        proxyUrl,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...proxy.headers,
          },
        },
        8000 // 8 segundos de timeout
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.log(`Resposta do ${proxy.name}:`, errorText.substring(0, 200));
        throw new Error(`${proxy.name} retornou status ${response.status}`);
      }

      const data = await proxy.parseResponse(response);

      // Validar se os dados são válidos
      if (!data || typeof data !== "object") {
        throw new Error(`${proxy.name} retornou dados inválidos`);
      }

      console.log(`✅ Sucesso com ${proxy.name}`, data);
      return data;
    } catch (error: any) {
      console.log(`⚠️ ${proxy.name} falhou:`, error.message);
      // Pequena pausa antes de tentar o próximo proxy
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  // Se todos os proxies falharem, tentar requisição direta (pode funcionar em alguns ambientes)
  try {
    console.log("🔄 Tentando requisição direta (sem proxy)...");
    const urlWithKey = `${url}?api_key=${API_KEY}`;
    const response = await fetchWithTimeout(
      urlWithKey,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      5000
    );

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Sucesso com requisição direta");
      return data;
    }
  } catch (error) {
    console.log("⚠️ Requisição direta falhou:", error);
  }

  throw new Error(
    "Não foi possível acessar a API da Riot. Todos os métodos falharam. Verifique sua conexão com a internet ou tente novamente em alguns minutos."
  );
};

export const searchSummoner = async (riotId: string): Promise<SummonerData> => {
  // Validar formato do Riot ID
  const [gameName, tagLine] = riotId.split("#");

  if (!gameName || !tagLine) {
    throw new Error("Formato do Riot ID inválido. Use o formato: Nome#Tag");
  }

  if (!API_KEY) {
    throw new Error(
      "Chave da API não configurada. Verifique as variáveis de ambiente."
    );
  }

  console.log(`�� Buscando invocador: ${riotId}`);

  try {
    // Passo 1: Buscar dados da conta pelo Riot ID
    console.log("📡 Buscando dados da conta...");
    const accountUrl = `${BASE_URL_AMERICAS}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      gameName
    )}/${encodeURIComponent(tagLine)}`;
    const accountData = await fetchWithProxy(accountUrl);

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
    const summonerUrl = `${BASE_URL_BR}/lol/summoner/v4/summoners/by-puuid/${accountData.puuid}`;
    const summonerData = await fetchWithProxy(summonerUrl);

    if (!summonerData || !summonerData.id) {
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
      summonerId: summonerData.id,
      accountId: summonerData.accountId,
    };

    console.log("🎉 Busca concluída com sucesso!");
    return result;
  } catch (error: any) {
    console.error("❌ Erro na busca do invocador:", error);

    // Melhorar mensagens de erro para o usuário
    const errorMessage = error.message || error.toString();

    if (errorMessage.includes("404")) {
      throw new Error(
        "Invocador não encontrado. Verifique se o Riot ID está correto."
      );
    } else if (errorMessage.includes("403")) {
      throw new Error("Acesso negado. Verifique a chave da API.");
    } else if (errorMessage.includes("429")) {
      throw new Error(
        "Muitas requisições. Tente novamente em alguns segundos."
      );
    } else if (errorMessage.includes("500")) {
      throw new Error(
        "Erro interno da API da Riot. Tente novamente mais tarde."
      );
    } else if (
      errorMessage.includes("proxy") ||
      errorMessage.includes("CORS")
    ) {
      throw new Error(
        "Erro de conectividade. Tente novamente em alguns instantes."
      );
    }

    throw new Error(errorMessage || "Erro desconhecido ao buscar invocador.");
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
