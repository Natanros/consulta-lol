import React, { useState } from 'react';
import { 
  riotAPI, 
  getSummonerIconUrl, 
  getChampionImageUrl,
  getItemImageUrl,
  formatMatchDuration,
  calculateKDA,
  getGameModeName,
  formatTimeAgo,
  getMatchResultColor,
  SummonerData,
  MatchData,
  ChampionMastery,
  getChampionData
} from '../../Services/riotAPI';
import './styles.css';

interface RankedData {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  summonerName: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

interface RegionOption {
  value: string;
  label: string;
  flag: string;
}

const regions: RegionOption[] = [
  { value: 'br1', label: 'Brasil', flag: '🇧🇷' },
  { value: 'na1', label: 'América do Norte', flag: '🇺🇸' },
  { value: 'euw1', label: 'Europa Oeste', flag: '🇪🇺' },
  { value: 'eun1', label: 'Europa Norte/Leste', flag: '🇪🇺' },
  { value: 'kr', label: 'Coreia', flag: '🇰🇷' },
  { value: 'jp1', label: 'Japão', flag: '🇯🇵' },
  { value: 'oc1', label: 'Oceania', flag: '🇦🇺' },
  { value: 'tr1', label: 'Turquia', flag: '🇹🇷' },
  { value: 'ru', label: 'Rússia', flag: '🇷🇺' },
  { value: 'la1', label: 'América Latina Norte', flag: '🌎' },
  { value: 'la2', label: 'América Latina Sul', flag: '🌎' },
];

// Componente para card de maestria
const MasteryCard: React.FC<{ mastery: ChampionMastery }> = ({ mastery }) => {
  const [championData, setChampionData] = useState<any>(null);

  React.useEffect(() => {
    const loadChampionData = async () => {
      const data = await getChampionData(mastery.championId);
      setChampionData(data);
    };
    loadChampionData();
  }, [mastery.championId]);

  const getMasteryColor = (level: number): string => {
    const colors = {
      7: '#F39C12', // Dourado
      6: '#8E44AD', // Roxo
      5: '#E74C3C', // Vermelho
      4: '#3498DB', // Azul
      3: '#2ECC71', // Verde
      2: '#95A5A6', // Cinza
      1: '#BDC3C7'  // Cinza claro
    };
    return colors[level as keyof typeof colors] || '#BDC3C7';
  };

  const formatPoints = (points: number): string => {
    if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`;
    if (points >= 1000) return `${(points / 1000).toFixed(0)}k`;
    return points.toString();
  };

  if (!championData) {
    return (
      <div className="mastery-card loading">
        <div className="loading-placeholder"></div>
      </div>
    );
  }

  return (
    <div className="mastery-card">
      <div className="mastery-header">
        <img
          src={getChampionImageUrl(championData.id)}
          alt={championData.name}
          className="mastery-champion-icon"
        />
        <div 
          className="mastery-level"
          style={{ backgroundColor: getMasteryColor(mastery.championLevel) }}
        >
          {mastery.championLevel}
        </div>
      </div>
      <div className="mastery-info">
        <h4 className="champion-name">{championData.name}</h4>
        <div className="mastery-points">
          <span className="points-value">{formatPoints(mastery.championPoints)}</span>
          <span className="points-label">pontos</span>
        </div>
        {mastery.championLevel < 7 && (
          <div className="progress-info">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(mastery.championPointsSinceLastLevel / (mastery.championPointsSinceLastLevel + mastery.championPointsUntilNextLevel)) * 100}%` 
                }}
              ></div>
            </div>
            <span className="progress-text">
              {mastery.championPointsUntilNextLevel} para nível {mastery.championLevel + 1}
            </span>
          </div>
        )}
        {mastery.chestGranted && (
          <div className="chest-badge">📦 Baú obtido</div>
        )}
        {mastery.tokensEarned > 0 && (
          <div className="tokens-badge">🎯 {mastery.tokensEarned} token{mastery.tokensEarned > 1 ? 's' : ''}</div>
        )}
      </div>
    </div>
  );
};

const SummonerLookup: React.FC = () => {
  const [summonerName, setSummonerName] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('br1');
  const [summonerData, setSummonerData] = useState<SummonerData | null>(null);
  const [rankedData, setRankedData] = useState<RankedData[]>([]);
  const [matchHistory, setMatchHistory] = useState<MatchData[]>([]);
  const [masteries, setMasteries] = useState<ChampionMastery[]>([]);
  const [totalMasteryScore, setTotalMasteryScore] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'ranked' | 'matches' | 'masteries'>('ranked');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!summonerName.trim()) {
      setError('Digite o nome de um invocador');
      return;
    }

    setLoading(true);
    setError(null);
    setSummonerData(null);
    setRankedData([]);
    setMatchHistory([]);
    setMasteries([]);
    setTotalMasteryScore(0);

    try {
      // Configurar região
      riotAPI.setRegion(selectedRegion);

      // Detectar se é Riot ID (contém #) ou nome antigo
      const trimmedName = summonerName.trim();
      let summoner: SummonerData;
      
      if (trimmedName.includes('#')) {
        // É um Riot ID (ex: Natan#9315)
        summoner = await riotAPI.getSummonerByRiotId(trimmedName);
      } else {
        // É um nome antigo (ex: Faker)
        summoner = await riotAPI.getSummonerByName(trimmedName);
      }
      
      setSummonerData(summoner);

      // Buscar dados de ranked, histórico e maestrias em paralelo
      const [ranked, matchIds, masteriesData, totalScore] = await Promise.all([
        riotAPI.getRankedStats(summoner.id),
        riotAPI.getMatchHistory(summoner.puuid, 10),
        riotAPI.getChampionMasteries(summoner.id, 10),
        riotAPI.getTotalMasteryScore(summoner.id)
      ]);

      setRankedData(ranked);
      setMasteries(masteriesData);
      setTotalMasteryScore(totalScore);

      // Buscar detalhes das partidas
      if (matchIds.length > 0) {
        const matchDetails = await Promise.all(
          matchIds.slice(0, 5).map(matchId => riotAPI.getMatchDetails(matchId))
        );
        setMatchHistory(matchDetails);
      }

      // Adicionar ao histórico
      const newHistory = [summonerName.trim(), ...searchHistory.filter(name => name !== summonerName.trim())].slice(0, 5);
      setSearchHistory(newHistory);

    } catch (err: any) {
      console.error('Erro ao buscar invocador:', err);
      if (err.message.includes('404')) {
        setError('Invocador não encontrado. Verifique o nome e a região.');
      } else if (err.message.includes('403')) {
        setError('Erro de autorização da API. Verifique sua chave.');
      } else if (err.message.includes('429')) {
        setError('Muitas requisições. Tente novamente em alguns segundos.');
      } else {
        setError('Erro ao buscar dados do invocador. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string): string => {
    const colors: { [key: string]: string } = {
      'IRON': '#8B4513',
      'BRONZE': '#CD7F32',
      'SILVER': '#C0C0C0',
      'GOLD': '#FFD700',
      'PLATINUM': '#00FFFF',
      'DIAMOND': '#B9F2FF',
      'MASTER': '#8E44AD',
      'GRANDMASTER': '#E74C3C',
      'CHALLENGER': '#F39C12'
    };
    return colors[tier] || '#C89B3C';
  };

  const getQueueTypeName = (queueType: string): string => {
    const names: { [key: string]: string } = {
      'RANKED_SOLO_5x5': 'Solo/Duo',
      'RANKED_FLEX_SR': 'Flex 5v5',
      'RANKED_FLEX_TT': 'Flex 3v3'
    };
    return names[queueType] || queueType;
  };

  const calculateWinRate = (wins: number, losses: number): number => {
    const total = wins + losses;
    return total > 0 ? Math.round((wins / total) * 100) : 0;
  };

  return (
    <div className="summoner-lookup-container">
      <div className="lookup-header">
        <h1>Consulta de Invocador</h1>
        <p className="lookup-subtitle">
          Pesquise estatísticas detalhadas de qualquer invocador
        </p>
      </div>

      {/* Formulário de busca */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-row">
            <div className="search-input-group">
              <input
                type="text"
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                placeholder="Nome do invocador ou Riot ID (ex: Natan#9315)"
                className="summoner-input"
                disabled={loading}
              />
              <button type="submit" className="search-button" disabled={loading}>
                {loading ? (
                  <div className="search-spinner"></div>
                ) : (
                  <span className="search-icon">🔍</span>
                )}
              </button>
            </div>
            
            <div className="region-select-group">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="region-select"
                disabled={loading}
              >
                {regions.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.flag} {region.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {/* Histórico de busca */}
        {searchHistory.length > 0 && (
          <div className="search-history">
            <h3>Buscas recentes:</h3>
            <div className="history-buttons">
              {searchHistory.map((name, index) => (
                <button
                  key={index}
                  onClick={() => setSummonerName(name)}
                  className="history-button"
                  disabled={loading}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Estado de erro */}
      {error && (
        <div className="error-section">
          <div className="error-card">
            <h3>⚠️ Erro na busca</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Resultados da busca */}
      {summonerData && (
        <div className="results-section">
          {/* Perfil do invocador */}
          <div className="summoner-profile">
            <div className="profile-header">
              <div className="profile-icon-container">
                <img
                  src={getSummonerIconUrl(summonerData.profileIconId)}
                  alt="Ícone do invocador"
                  className="profile-icon"
                />
                <div className="summoner-level">{summonerData.summonerLevel}</div>
              </div>
              <div className="profile-info">
                <h2 className="summoner-name">{summonerData.name}</h2>
                <p className="summoner-region">
                  {regions.find(r => r.value === selectedRegion)?.flag} {' '}
                  {regions.find(r => r.value === selectedRegion)?.label}
                </p>
              </div>
            </div>
          </div>

          {/* Sistema de abas */}
          <div className="tabs-section">
            <div className="tabs-header">
              <button
                className={`tab-button ${activeTab === 'ranked' ? 'active' : ''}`}
                onClick={() => setActiveTab('ranked')}
              >
                <span className="tab-icon">🏆</span>
                Ranked
              </button>
              <button
                className={`tab-button ${activeTab === 'matches' ? 'active' : ''}`}
                onClick={() => setActiveTab('matches')}
              >
                <span className="tab-icon">⚔️</span>
                Partidas ({matchHistory.length})
              </button>
              <button
                className={`tab-button ${activeTab === 'masteries' ? 'active' : ''}`}
                onClick={() => setActiveTab('masteries')}
              >
                <span className="tab-icon">👑</span>
                Maestrias ({totalMasteryScore.toLocaleString()})
              </button>
            </div>

            <div className="tab-content">
              {/* Aba Ranked */}
              {activeTab === 'ranked' && (
                <div className="ranked-tab">
                  <h3 className="section-title">
                    <span className="title-icon">🏆</span>
                    Estatísticas Rankeadas
                  </h3>
                  
                  {rankedData.length === 0 ? (
                    <div className="no-data">
                      <p>Nenhum dado de ranked encontrado para esta temporada.</p>
                    </div>
                  ) : (
                    <div className="ranked-grid">
                      {rankedData.map((ranked) => (
                        <div key={ranked.queueType} className="ranked-card">
                          <div className="queue-type">{getQueueTypeName(ranked.queueType)}</div>
                          <div className="tier-info">
                            <div 
                              className="tier-badge"
                              style={{ backgroundColor: getTierColor(ranked.tier) }}
                            >
                              {ranked.tier} {ranked.rank}
                            </div>
                            <div className="league-points">{ranked.leaguePoints} LP</div>
                          </div>
                          <div className="stats-grid">
                            <div className="stat-item">
                              <span className="stat-label">Vitórias</span>
                              <span className="stat-value wins">{ranked.wins}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Derrotas</span>
                              <span className="stat-value losses">{ranked.losses}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Taxa de Vitória</span>
                              <span className="stat-value winrate">
                                {calculateWinRate(ranked.wins, ranked.losses)}%
                              </span>
                            </div>
                          </div>
                          {(ranked.hotStreak || ranked.veteran || ranked.freshBlood) && (
                            <div className="badges">
                              {ranked.hotStreak && <span className="badge hot-streak">🔥 Série</span>}
                              {ranked.veteran && <span className="badge veteran">👑 Veterano</span>}
                              {ranked.freshBlood && <span className="badge fresh-blood">⭐ Novato</span>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Aba Partidas */}
              {activeTab === 'matches' && (
                <div className="matches-tab">
                  <h3 className="section-title">
                    <span className="title-icon">⚔️</span>
                    Histórico de Partidas
                  </h3>
                  
                  {matchHistory.length === 0 ? (
                    <div className="no-data">
                      <p>Nenhuma partida encontrada.</p>
                    </div>
                  ) : (
                    <div className="matches-list">
                      {matchHistory.map((match) => {
                        const participant = match.info.participants.find(p => p.puuid === summonerData.puuid);
                        if (!participant) return null;

                        return (
                          <div key={match.metadata.matchId} className="match-card">
                            <div className="match-header">
                              <div 
                                className="match-result"
                                style={{ backgroundColor: getMatchResultColor(participant.win) }}
                              >
                                {participant.win ? 'VITÓRIA' : 'DERROTA'}
                              </div>
                              <div className="match-info">
                                <span className="game-mode">{getGameModeName(match.info.queueId)}</span>
                                <span className="match-duration">{formatMatchDuration(match.info.gameDuration)}</span>
                                <span className="match-time">{formatTimeAgo(match.info.gameCreation)}</span>
                              </div>
                            </div>
                            <div className="match-details">
                              <div className="champion-info">
                                <img
                                  src={getChampionImageUrl(participant.championName)}
                                  alt={participant.championName}
                                  className="champion-icon"
                                />
                                <div className="kda">
                                  <span className="kda-numbers">
                                    {participant.kills}/{participant.deaths}/{participant.assists}
                                  </span>
                                  <span className="kda-ratio">
                                    KDA: {calculateKDA(participant.kills, participant.deaths, participant.assists)}
                                  </span>
                                </div>
                              </div>
                              <div className="items">
                                {[participant.item0, participant.item1, participant.item2, participant.item3, participant.item4, participant.item5, participant.item6].map((itemId, index) => (
                                  <div key={index} className="item-slot">
                                    {itemId > 0 ? (
                                      <img
                                        src={getItemImageUrl(itemId)}
                                        alt={`Item ${itemId}`}
                                        className="item-icon"
                                      />
                                    ) : (
                                      <div className="empty-item"></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="match-stats">
                                <div className="stat">
                                  <span className="stat-label">CS</span>
                                  <span className="stat-value">{participant.totalMinionsKilled}</span>
                                </div>
                                <div className="stat">
                                  <span className="stat-label">Ouro</span>
                                  <span className="stat-value">{(participant.goldEarned / 1000).toFixed(1)}k</span>
                                </div>
                                <div className="stat">
                                  <span className="stat-label">Dano</span>
                                  <span className="stat-value">{(participant.totalDamageDealtToChampions / 1000).toFixed(0)}k</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Aba Maestrias */}
              {activeTab === 'masteries' && (
                <div className="masteries-tab">
                  <h3 className="section-title">
                    <span className="title-icon">👑</span>
                    Maestrias de Campeões
                    <span className="total-score">Total: {totalMasteryScore.toLocaleString()} pontos</span>
                  </h3>
                  
                  {masteries.length === 0 ? (
                    <div className="no-data">
                      <p>Nenhuma maestria encontrada.</p>
                    </div>
                  ) : (
                    <div className="masteries-grid">
                      {masteries.map((mastery) => (
                        <MasteryCard key={mastery.championId} mastery={mastery} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummonerLookup;