// Serviço para buscar dados de campeões do Data Dragon
const DATA_DRAGON_VERSION = "15.19.1";
const DATA_DRAGON_BASE_URL = `https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}`;

interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  image: {
    full: string;
  };
}

interface ChampionData {
  data: {
    [key: string]: Champion;
  };
}

// Cache para dados de campeões
let championCache: Map<string, Champion> | null = null;
let championIdToKeyMap: Map<number, string> | null = null;

// Buscar todos os campeões
export const fetchAllChampions = async (): Promise<ChampionData> => {
  try {
    const response = await fetch(
      `${DATA_DRAGON_BASE_URL}/data/pt_BR/champion.json`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar dados dos campeões");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Erro ao buscar campeões:", error);
    throw error;
  }
};

// Inicializar cache de campeões
export const initializeChampionCache = async () => {
  if (championCache) {
    return; // Já inicializado
  }

  try {
    console.log("🔄 Inicializando cache de campeões...");
    const data = await fetchAllChampions();

    championCache = new Map();
    championIdToKeyMap = new Map();

    // O "key" no Data Dragon é o ID numérico como string
    // Precisamos mapear: ID numérico -> dados do campeão
    Object.values(data.data).forEach((champion) => {
      const numericKey = parseInt(champion.key);
      championCache!.set(champion.key, champion);
      championIdToKeyMap!.set(numericKey, champion.key); // Mapeia ID numérico para key
    });

    console.log(`✅ Cache inicializado com ${championCache.size} campeões`);
    console.log(`📊 Exemplo de mapeamento - ID 1:`, championIdToKeyMap!.get(1));
  } catch (error) {
    console.error("❌ Erro ao inicializar cache:", error);
  }
};

// Obter campeão por ID numérico
export const getChampionById = async (
  championId: number
): Promise<Champion | null> => {
  if (!championCache) {
    await initializeChampionCache();
  }

  // Busca o key do campeão pelo ID numérico
  const championKey = championIdToKeyMap?.get(championId);
  if (!championKey) {
    console.warn(`⚠️ Campeão não encontrado para ID: ${championId}`);
    console.log(
      `📋 IDs disponíveis:`,
      Array.from(championIdToKeyMap?.keys() || []).slice(0, 10)
    );
    return null;
  }

  // Usa o key para buscar os dados completos do campeão
  const champion = championCache?.get(championKey);
  if (champion) {
    console.log(
      `✅ Campeão encontrado - ID: ${championId}, Nome: ${champion.name}, Key: ${championKey}`
    );
  }
  return champion || null;
};

// Obter URL da imagem do campeão
export const getChampionImageUrl = (championName: string): string => {
  return `${DATA_DRAGON_BASE_URL}/img/champion/${championName}.png`;
};

// Obter URL do splash art do campeão
export const getChampionSplashUrl = (
  championName: string,
  skinNum: number = 0
): string => {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_${skinNum}.jpg`;
};

// Obter nome do campeão por ID
export const getChampionNameById = async (
  championId: number
): Promise<string> => {
  const champion = await getChampionById(championId);
  return champion?.name || `Campeão #${championId}`;
};
