// Serviço inteligente que escolhe automaticamente entre proxy local, API Vercel ou proxies públicos
import {
  searchSummonerLocal,
  getWeeklyRotationLocal,
  checkProxyHealth,
} from "./localProxy";
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

console.log(
  `🌍 Ambiente detectado: ${
    isProduction ? "PRODUÇÃO (Vercel)" : "DESENVOLVIMENTO (Localhost)"
  }`
);

// Função para verificar disponibilidade do proxy local
const isProxyAvailable = async (): Promise<boolean> => {
  // Em produção (Vercel), NUNCA usar proxy local
  if (isProduction) {
    console.log("🌐 Ambiente de produção detectado - usando APIs públicas");
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

    if (proxyAvailable) {
      console.log("✅ Proxy local disponível - usando proxy local");
    } else {
      console.log("⚠️ Proxy local não disponível - usando APIs públicas");
    }

    return proxyAvailable;
  } catch (error) {
    console.log("⚠️ Erro ao verificar proxy local - usando APIs públicas");
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
