// Serviço para rotação semanal usando smart proxy
import { getWeeklyRotation } from "./smartProxy";

// Interface para campeão da rotação
interface RotationChampion {
  id: number;
  name: string;
  title: string;
  image: string;
  tags: string[];
  difficulty: number;
}

// Interface para rotação completa
interface WeeklyRotationData {
  freeChampionIds: number[];
  freeChampionIdsForNewPlayers: number[];
  maxNewPlayerLevel: number;
  champions: RotationChampion[];
  newPlayerChampions: RotationChampion[];
}

// Função para buscar dados dos campeões com múltiplas estratégias
const fetchChampionData = async () => {
  // Estratégia 1: Tentar direto (Data Dragon não tem CORS)
  try {
    const response = await fetch(
      "https://ddragon.leagueoflegends.com/cdn/14.1.1/data/pt_BR/champion.json"
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    // Continuar para próxima estratégia
  }

  // Estratégia 2: Usar proxy AllOrigins como backup
  try {
    const proxyUrl =
      "https://api.allorigins.win/get?url=" +
      encodeURIComponent(
        "https://ddragon.leagueoflegends.com/cdn/14.1.1/data/pt_BR/champion.json"
      );
    const response = await fetch(proxyUrl);
    if (response.ok) {
      const result = await response.json();
      if (result.contents) {
        const data = JSON.parse(result.contents);
        return data;
      }
    }
  } catch (error) {
    console.error("Erro ao buscar dados dos campeões:", error);
  }

  throw new Error("Não foi possível obter dados dos campeões");
};

export const getRotation = async (): Promise<WeeklyRotationData> => {
  try {
    // Buscar dados da rotação da API
    const rotationData = await getWeeklyRotation();

    // Buscar dados dos campeões da Data Dragon API
    const championData = await fetchChampionData();

    // Mapear IDs para dados dos campeões
    const champions: RotationChampion[] = rotationData.freeChampionIds.map(
      (id: number) => {
        const champion = Object.values(championData.data).find(
          (champ: any) => parseInt(champ.key) === id
        );

        if (!champion) {
          return {
            id,
            name: `Campeão ${id}`,
            title: "Título desconhecido",
            image: `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Unknown.png`,
            tags: [],
            difficulty: 1,
          };
        }

        return {
          id,
          name: (champion as any).name,
          title: (champion as any).title,
          image: `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${
            (champion as any).image.full
          }`,
          tags: (champion as any).tags,
          difficulty: (champion as any).info.difficulty,
        };
      }
    );

    // Mapear campeões para novos jogadores
    const newPlayerChampions: RotationChampion[] =
      rotationData.freeChampionIdsForNewPlayers.map((id: number) => {
        const champion = Object.values(championData.data).find(
          (champ: any) => parseInt(champ.key) === id
        );

        if (!champion) {
          return {
            id,
            name: `Campeão ${id}`,
            title: "Título desconhecido",
            image: `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Unknown.png`,
            tags: [],
            difficulty: 1,
          };
        }

        return {
          id,
          name: (champion as any).name,
          title: (champion as any).title,
          image: `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${
            (champion as any).image.full
          }`,
          tags: (champion as any).tags,
          difficulty: (champion as any).info.difficulty,
        };
      });

    const result: WeeklyRotationData = {
      freeChampionIds: rotationData.freeChampionIds,
      freeChampionIdsForNewPlayers: rotationData.freeChampionIdsForNewPlayers,
      maxNewPlayerLevel: rotationData.maxNewPlayerLevel,
      champions,
      newPlayerChampions,
    };

    return result;
  } catch (error: any) {
    console.error("Erro ao buscar rotação:", error);

    // Melhorar mensagens de erro
    if (error.message.includes("404")) {
      throw new Error("Dados da rotação não encontrados.");
    } else if (error.message.includes("403")) {
      throw new Error("Acesso negado. Verifique a chave da API.");
    } else if (error.message.includes("429")) {
      throw new Error(
        "Muitas requisições. Tente novamente em alguns segundos."
      );
    } else if (error.message.includes("500")) {
      throw new Error(
        "Erro interno da API da Riot. Tente novamente mais tarde."
      );
    }

    throw new Error(
      error.message || "Erro desconhecido ao buscar rotação semanal."
    );
  }
};
