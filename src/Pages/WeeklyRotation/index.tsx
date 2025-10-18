import React, { useState, useEffect } from 'react';
import { riotAPI, getChampionData, getChampionImageUrl, ChampionRotation } from '../../Services/riotAPI';
import './styles.css';

interface Champion {
  id: string;
  name: string;
  title: string;
  key: string;
  blurb: string;
  tags: string[];
}

const WeeklyRotation: React.FC = () => {
  const [rotation, setRotation] = useState<ChampionRotation | null>(null);
  const [champions, setChampions] = useState<Champion[]>([]);
  const [newPlayerChampions, setNewPlayerChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRotationData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const rotationData = await riotAPI.getChampionRotation();
        setRotation(rotationData);

        // Buscar dados detalhados dos campeões
        const championPromises = rotationData.freeChampionIds.map(async (id) => {
          try {
            const champData = await getChampionData(id);
            return champData;
          } catch (error) {
            console.error(`Erro ao buscar campeão ID ${id}:`, error);
            return null;
          }
        });
        
        const newPlayerPromises = rotationData.freeChampionIdsForNewPlayers.map(async (id) => {
          try {
            const champData = await getChampionData(id);
            return champData;
          } catch (error) {
            console.error(`Erro ao buscar campeão novato ID ${id}:`, error);
            return null;
          }
        });

        const [championData, newPlayerData] = await Promise.all([
          Promise.all(championPromises),
          Promise.all(newPlayerPromises)
        ]);

        // Filtrar resultados válidos
        const validChampions = championData.filter(champ => champ !== null);
        const validNewPlayerChampions = newPlayerData.filter(champ => champ !== null);
        
        setChampions(validChampions);
        setNewPlayerChampions(validNewPlayerChampions);

      } catch (err: any) {
        console.error('Erro ao carregar rotação:', err);
        setError(`Erro ao carregar a rotação semanal: ${err.message || 'Erro desconhecido'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRotationData();
  }, []);

  if (loading) {
    return (
      <div className="rotation-loading">
        <div className="loading-spinner"></div>
        <p>Carregando rotação semanal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rotation-error">
        <h2>Ops! Algo deu errado</h2>
        <p>{error}</p>
        <div className="error-details">
          <h3>Debug Info:</h3>
          <p><strong>Chave da API:</strong> {process.env.REACT_APP_API_KEY ? 'Configurada' : 'Não configurada'}</p>
          <p><strong>Endpoint:</strong> https://br1.api.riotgames.com/lol/platform/v3/champion-rotations</p>
          <p><strong>Data Dragon:</strong> https://ddragon.leagueoflegends.com/</p>
        </div>
        <div className="error-actions">
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            🔄 Tentar novamente
          </button>
          <button 
            className="debug-button"
            onClick={() => window.open('/api-debug', '_blank')}
          >
            🔧 Página de Debug
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rotation-container">
      <div className="rotation-header">
        <h1>Rotação Semanal Gratuita</h1>
        <p className="rotation-subtitle">
          Confira os campeões disponíveis gratuitamente esta semana
        </p>
        {rotation && (
          <div className="rotation-info">
            <span className="champion-count">
              {rotation.freeChampionIds.length} campeões disponíveis
            </span>
          </div>
        )}
      </div>

      {/* Campeões para todos os jogadores */}
      <section className="rotation-section">
        <h2 className="section-title">
          <span className="title-icon">⚔️</span>
          Campeões Gratuitos
        </h2>
        <div className="champions-grid">
          {champions.map((champion) => (
            <div key={champion.id} className="champion-card">
              <div className="champion-image-container">
                <img
                  src={getChampionImageUrl(champion.id)}
                  alt={champion.name}
                  className="champion-image"
                  loading="lazy"
                />
              </div>
              <div className="champion-meta">
                <div className="difficulty-indicator">
                  {/* Dificuldade não disponível na API de rotação */}
                </div>
                <div className="champion-tags">
                  {champion.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="champion-info">
                <div className="champion-header">
                  <h3>{champion.name}</h3>
                  <p className="champion-title">{champion.title}</p>
                </div>
                <p className="champion-description">{champion.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Campeões para novos jogadores */}
      {newPlayerChampions.length > 0 && (
        <section className="rotation-section">
          <h2 className="section-title">
            <span className="title-icon">🌟</span>
            Campeões para Novos Jogadores
            <span className="level-badge">Nível ≤ {rotation?.maxNewPlayerLevel}</span>
          </h2>
          <div className="champions-grid">
            {newPlayerChampions.map((champion) => (
              <div key={champion.id} className="champion-card newbie-card">
                <div className="champion-image-container">
                  <img
                    src={getChampionImageUrl(champion.id)}
                    alt={champion.name}
                    className="champion-image"
                    loading="lazy"
                  />
                </div>
                <div className="champion-meta">
                  <div className="difficulty-indicator">
                    {/* Dificuldade não disponível */}
                  </div>
                  <div className="champion-tags">
                    {champion.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="champion-info">
                  <div className="champion-header">
                    <h3>{champion.name}</h3>
                    <p className="champion-title">{champion.title}</p>
                  </div>
                  <p className="champion-description">{champion.blurb}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="rotation-footer">
        <p className="update-info">
          <span className="info-icon">🔄</span>
          A rotação de campeões é atualizada semanalmente às terças-feiras
        </p>
      </div>
    </div>
  );
};

export default WeeklyRotation;