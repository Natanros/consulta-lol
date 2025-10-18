// Serviço inteligente que escolhe automaticamente entre proxy local, API Vercel ou proxies públicos
import {
  searchSummonerLocal,
  getWeeklyRotationLocal,
  checkProxyHealth,
} from "./localProxy";
import {
  searchSummonerVercel,
  getWeeklyRotationVercel,
  checkVercelAPIHealth,
} from "./vercelAPI";
import { searchSummoner as searchSummonerPublic } from "./simpleSummoner";
import { getWeeklyRotationSimple as getWeeklyRotationPublic } from "./riotAPISimple";

// Cache para verificação de disponibilidade do proxy
let proxyAvailable: boolean | null = null;
let lastProxyCheck = 0;
const PROXY_CHECK_INTERVAL = 30000; // 30 segundos

// Detectar ambiente
const isProduction =
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1";
const isLocalDevelopment = !isProduction;

// Função para verificar disponibilidade do proxy local
const isProxyAvailable = async (): Promise<boolean> => {
  // Em produção (Vercel), NUNCA usar proxy local
  if (isProduction) {
    return false;
  }

  const now = Date.now();

  // Se já verificamos recentemente, usar cache
  if (proxyAvailable !== null && now - lastProxyCheck < PROXY_CHECK_INTERVAL) {
    return proxyAvailable;
  }

  // Verificar disponibilidade do proxy local apenas em desenvolvimento
  try {
    proxyAvailable = await checkProxyHealth();
    lastProxyCheck = now;
    return proxyAvailable;
  } catch (error) {
    proxyAvailable = false;
    lastProxyCheck = now;
    return false;
  }
};

// Função inteligente para buscar invocador
export const searchSummoner = async (riotId: string) => {
  // Em produção (Vercel), usar API Vercel
  if (isProduction) {
    try {
      return await searchSummonerVercel(riotId);
    } catch (error) {
      return await searchSummonerPublic(riotId);
    }
  }

  // Em desenvolvimento, tentar proxy local primeiro
  const useLocalProxy = await isProxyAvailable();

  if (useLocalProxy) {
    return await searchSummonerLocal(riotId);
  } else {
    return await searchSummonerPublic(riotId);
  }
};

// Função inteligente para buscar rotação semanal
export const getWeeklyRotation = async () => {
  // Em produção (Vercel), usar API Vercel
  if (isProduction) {
    try {
      return await getWeeklyRotationVercel();
    } catch (error) {
      return await getWeeklyRotationPublic();
    }
  }

  // Em desenvolvimento, tentar proxy local primeiro
  const useLocalProxy = await isProxyAvailable();

  if (useLocalProxy) {
    return await getWeeklyRotationLocal();
  } else {
    return await getWeeklyRotationPublic();
  }
};

// Exportar outras funções úteis
export { getSummonerIconUrl, isValidRiotId } from "./localProxy";
