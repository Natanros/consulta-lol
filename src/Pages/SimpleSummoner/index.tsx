import React, { useState, useEffect } from 'react';
import { searchSummoner } from '../../Services/smartProxy';
import { getChampionMasteries, getMatchHistory, getMatchDetails } from '../../Services/localProxy';
import { getSummonerIconUrl } from '../../Services/simpleSummoner';
import { initializeChampionCache, getChampionById, getChampionImageUrl } from '../../Services/championData';
import './styles.css';

interface MatchDetail {
  matchId: string;
  gameMode: string;
  gameDuration: number;
  gameCreation: number;
  championId: number;
  championName: string;
  championImageName: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  loading?: boolean;
}

// Função para formatar tempo decorrido
const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d atrás`;
  if (hours > 0) return `${hours}h atrás`;
  if (minutes > 0) return `${minutes}min atrás`;
  return 'Agora';
};

const SimpleSummoner: React.FC = () => {
  const [riotId, setRiotId] = useState('');
  const [summoner, setSummoner] = useState<any>(null);
  const [masteries, setMasteries] = useState<any[]>([]);
  const [matchHistory, setMatchHistory] = useState<MatchDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingExtra, setLoadingExtra] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar cache de campeões ao montar o componente
  useEffect(() => {
    initializeChampionCache();
  }, []);

  const handleSearch = async () => {
    if (!riotId.trim()) {
      setError('Por favor, digite um Riot ID válido');
      return;
    }
    
    setLoading(true);
    setError(null);
    setMasteries([]);
    setMatchHistory([]);
    
    try {
      const result = await searchSummoner(riotId);
      setSummoner(result);
      
      // Buscar maestrias e histórico em paralelo
      setLoadingExtra(true);
      try {
        const [masteriesData, matchIds] = await Promise.all([
          getChampionMasteries(result.puuid),
          getMatchHistory(result.puuid, 5)
        ]);
        
        // Processar maestrias com informações dos campeões
        console.log('📊 Maestrias brutas:', masteriesData.slice(0, 5));
        
        const masteriesWithChampions = await Promise.all(
          masteriesData.slice(0, 5).map(async (mastery: any) => {
            console.log(`🔍 Buscando campeão ID: ${mastery.championId}`);
            const champion = await getChampionById(mastery.championId);
            console.log(`✅ Resultado:`, champion);
            return {
              ...mastery,
              championName: champion?.name || `Campeão #${mastery.championId}`,
              championImageName: champion?.id || 'Aatrox'
            };
          })
        );
        
        console.log('🏆 Maestrias processadas:', masteriesWithChampions);
        setMasteries(masteriesWithChampions);
        
        // Buscar detalhes de cada partida
        const matchDetailsPromises = matchIds.map(async (matchId: string) => {
          try {
            const matchData = await getMatchDetails(matchId);
            const participant = matchData.info.participants.find(
              (p: any) => p.puuid === result.puuid
            );
            
            if (!participant) return null;
            
            const champion = await getChampionById(participant.championId);
            
            return {
              matchId,
              gameMode: matchData.info.gameMode,
              gameDuration: Math.floor(matchData.info.gameDuration / 60),
              gameCreation: matchData.info.gameCreation,
              championId: participant.championId,
              championName: champion?.name || `Campeão #${participant.championId}`,
              championImageName: champion?.id || 'Aatrox',
              kills: participant.kills,
              deaths: participant.deaths,
              assists: participant.assists,
              win: participant.win
            };
          } catch (err) {
            console.error(`Erro ao buscar detalhes da partida ${matchId}:`, err);
            return null;
          }
        });
        
        const matchDetails = (await Promise.all(matchDetailsPromises)).filter(Boolean) as MatchDetail[];
        setMatchHistory(matchDetails);
        
      } catch (extraError) {
        console.error('Erro ao buscar dados extras:', extraError);
      } finally {
        setLoadingExtra(false);
      }
    } catch (error: any) {
      setError(error.message || 'Erro ao buscar invocador. Verifique se o Riot ID está correto e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simple-summoner">
      <div className="summoner-header">
        <h1>👤 Consulta de Invocador</h1>
        <p className="summoner-description">
          Digite o Riot ID para consultar informações básicas do jogador
        </p>
      </div>
      
      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Digite o Riot ID (ex: Natan#9315)"
            value={riotId}
            onChange={(e) => setRiotId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            disabled={loading}
          />
          <button onClick={handleSearch} disabled={loading || !riotId.trim()}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Buscando...
              </>
            ) : (
              <>
                🔍 Buscar
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <div className="error-content">
              {error.split('\n').map((line, index) => (
                <div key={index} className="error-line">
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {summoner && (
        <div className="summoner-profile">
          {/* Hero Section com Campeão Principal */}
          {masteries.length > 0 && (
            <div className="hero-section">
              <div className="hero-content">
                <div className="hero-left">
                  <div className="profile-avatar">
                    <img 
                      src={getSummonerIconUrl(summoner.icon)} 
                      alt="Ícone do Invocador"
                      className="summoner-icon"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getSummonerIconUrl(1);
                      }}
                    />
                  </div>
                  <div className="hero-text">
                    <h1 className="hero-name">{summoner.name}</h1>
                    <div className="hero-stats">
                      <span className="hero-level">Nível {summoner.level}</span>
                      <span className="hero-divider">•</span>
                      <span className="hero-mastery-count">{masteries.length} Campeões com Maestria</span>
                    </div>
                    <div className="hero-champion-info">
                      <p className="hero-label">🏆 Campeão com Maior Maestria</p>
                      <h2 className="hero-champion-name">{masteries[0].championName}</h2>
                      <div className="hero-champion-stats">
                        <div className="hero-stat">
                          <span className="hero-stat-value">{masteries[0].championLevel}</span>
                          <span className="hero-stat-label">Nível</span>
                        </div>
                        <div className="hero-stat">
                          <span className="hero-stat-value">{(masteries[0].championPoints / 1000).toFixed(0)}K</span>
                          <span className="hero-stat-label">Pontos</span>
                        </div>
                        <div className="hero-stat">
                          <span className="hero-stat-value">
                            {masteries[0].championLevel >= 7 ? '👑' : '⭐'}
                          </span>
                          <span className="hero-stat-label">
                            {masteries[0].championLevel >= 7 ? 'Máxima' : 'Em Progresso'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hero-right">
                  <div className="hero-champion-image">
                    <img 
                      src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${masteries[0].championImageName}_0.jpg`}
                      alt={masteries[0].championName}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getChampionImageUrl(masteries[0].championImageName);
                      }}
                    />
                    <div className="hero-champion-overlay"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loadingExtra && (
            <div className="loading-extra">
              <span className="spinner"></span>
              <p>Carregando maestrias e histórico...</p>
            </div>
          )}

          {masteries.length > 1 && (
            <div className="masteries-section">
              <h3>🏆 Outros Campeões Favoritos</h3>
              <div className="masteries-grid">
                {masteries.slice(1).map((mastery, index) => (
                  <div key={mastery.championId} className="mastery-card">
                    <div className="mastery-rank">#{index + 1}</div>
                    <div className="mastery-champion-img">
                      <img 
                        src={getChampionImageUrl(mastery.championImageName)}
                        alt={mastery.championName}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getChampionImageUrl('Aatrox');
                        }}
                      />
                    </div>
                    <div className="mastery-info">
                      <div className="mastery-champion-name">{mastery.championName}</div>
                      <div className="mastery-level">Nível {mastery.championLevel}</div>
                      <div className="mastery-points">
                        {mastery.championPoints.toLocaleString('pt-BR')} pontos
                      </div>
                      <div className="mastery-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{
                              width: `${Math.min((mastery.championPointsSinceLastLevel / (mastery.championPointsUntilNextLevel || 1)) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                        <div className="progress-text">
                          {mastery.championLevel < 7 && mastery.championPointsUntilNextLevel > 0 ? (
                            `${mastery.championPointsUntilNextLevel.toLocaleString('pt-BR')} até próximo nível`
                          ) : (
                            'Maestria Máxima'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchHistory.length > 0 && (
            <div className="match-history-section">
              <h3>📜 Últimas 5 Partidas</h3>
              <div className="match-list">
                {matchHistory.map((match, index) => (
                  <div key={match.matchId} className={`match-item ${match.win ? 'victory' : 'defeat'}`}>
                    <div className="match-result">
                      {match.win ? '✓ VITÓRIA' : '✗ DERROTA'}
                    </div>
                    <div className="match-champion">
                      <img 
                        src={getChampionImageUrl(match.championImageName)}
                        alt={match.championName}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getChampionImageUrl('Aatrox');
                        }}
                      />
                      <span className="champion-name">{match.championName}</span>
                    </div>
                    <div className="match-stats">
                      <span className="kda">
                        <span className="kills">{match.kills}</span>
                        <span className="separator">/</span>
                        <span className="deaths">{match.deaths}</span>
                        <span className="separator">/</span>
                        <span className="assists">{match.assists}</span>
                      </span>
                      <span className="kda-ratio">
                        KDA: {match.deaths === 0 ? 'Perfect' : ((match.kills + match.assists) / match.deaths).toFixed(2)}
                      </span>
                    </div>
                    <div className="match-info">
                      <span className="game-mode">{match.gameMode}</span>
                      <span className="duration">{match.gameDuration} min</span>
                      <span className="time-ago">
                        {formatTimeAgo(match.gameCreation)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimpleSummoner;
