// Serviço inteligente que escolhe automaticamente entre proxy local ou proxies públicos
import {
  searchSummonerLocal,
  getWeeklyRotationLocal,
  checkProxyHealth,
} from "./localProxy";
import { searchSummoner as searchSummonerPublic } from "./simpleSummoner";
import { getWeeklyRotation as getWeeklyRotationPublic } from "./riotAPICORS";

// Cache para verificação de disponibilidade do proxy
let proxyAvailable: boolean | null = null;
let lastProxyCheck = 0;
const PROXY_CHECK_INTERVAL = 30000; // 30 segundos

// Função para verificar disponibilidade do proxy local
const isProxyAvailable = async (): Promise<boolean> => {
  const now = Date.now();

  // Se já verificamos recentemente, usar cache
  if (proxyAvailable !== null && now - lastProxyCheck < PROXY_CHECK_INTERVAL) {
    return proxyAvailable;
  }

  // Verificar disponibilidade do proxy
  try {
    proxyAvailable = await checkProxyHealth();
    lastProxyCheck = now;

    if (proxyAvailable) {
      console.log("✅ Proxy local disponível - usando proxy local");
    } else {
      console.log("⚠️ Proxy local não disponível - usando proxies públicos");
    }

    return proxyAvailable;
  } catch (error) {
    console.log("⚠️ Erro ao verificar proxy local - usando proxies públicos");
    proxyAvailable = false;
    lastProxyCheck = now;
    return false;
  }
};

// Função inteligente para buscar invocador
export const searchSummoner = async (riotId: string) => {
  const useLocalProxy = await isProxyAvailable();

  if (useLocalProxy) {
    console.log("🚀 Usando proxy local para buscar invocador");
    return await searchSummonerLocal(riotId);
  } else {
    console.log("🌐 Usando proxies públicos para buscar invocador");
    return await searchSummonerPublic(riotId);
  }
};

// Função inteligente para buscar rotação semanal
export const getWeeklyRotation = async () => {
  const useLocalProxy = await isProxyAvailable();

  if (useLocalProxy) {
    console.log("🚀 Usando proxy local para buscar rotação");
    return await getWeeklyRotationLocal();
  } else {
    console.log("🌐 Usando proxies públicos para buscar rotação");
    return await getWeeklyRotationPublic();
  }
};

// Exportar outras funções úteis
export { getSummonerIconUrl, isValidRiotId } from "./localProxy";
