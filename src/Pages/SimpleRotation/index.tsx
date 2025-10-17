import React, { useState, useEffect } from 'react';
import { getRotation } from '../../Services/simpleRotation';
import './styles.css';

const SimpleRotation: React.FC = () => {
  const [rotation, setRotation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRotation = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const rotationData = await getRotation();
        setRotation(rotationData);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar rotação semanal');
      } finally {
        setLoading(false);
      }
    };

    fetchRotation();
  }, []);

  const renderChampionCard = (champion: any) => {
    return (
      <div key={champion.id} className="champion-card">
        <div className="champion-image-container">
          <img 
            src={champion.image} 
            alt={champion.name}
            className="champion-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Annie.png';
            }}
          />
        </div>
        
        <div className="champion-info">
          <h3>{champion.name}</h3>
          <p className="champion-title">{champion.title}</p>
          <div className="champion-tags">
            {champion.tags.map((tag: string, index: number) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
          <div className="champion-difficulty">
            <span className="difficulty-label">Dificuldade:</span>
            <div className="difficulty-stars">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`star ${i < champion.difficulty ? 'filled' : ''}`}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="simple-rotation">
        <div className="rotation-header">
          <h1>⚔️ Rotação Semanal</h1>
        </div>
        <div className="loading-message">
          <div className="spinner"></div>
          <p>Carregando rotação semanal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="simple-rotation">
        <div className="rotation-header">
          <h1>⚔️ Rotação Semanal</h1>
        </div>
        <div className="error-message">
          <h2>❌ Erro ao carregar rotação</h2>
          <p>{error}</p>
          <p>Verifique sua conexão com a internet ou tente novamente mais tarde.</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="simple-rotation">
      <div className="rotation-header">
        <h1>⚔️ Rotação Semanal Gratuita</h1>
        <p className="rotation-description">
          Campeões disponíveis gratuitamente esta semana. Aproveite para experimentar novos estilos de jogo!
        </p>
      </div>
      
      <div className="rotation-content">
        <div className="rotation-section">
          <h2 className="section-title">
            🏆 Rotação Geral ({rotation?.champions?.length || 0} campeões)
          </h2>
          <div className="champions-grid">
            {rotation?.champions?.map((champion: any) => renderChampionCard(champion))}
          </div>
        </div>

        {rotation?.newPlayerChampions?.length > 0 && (
          <div className="rotation-section">
            <h2 className="section-title">
              🆕 Para Novos Jogadores (Nível ≤ {rotation.maxNewPlayerLevel})
            </h2>
            <div className="champions-grid">
              {rotation.newPlayerChampions.map((champion: any) => renderChampionCard(champion))}
            </div>
          </div>
        )}

        <div className="rotation-info">
          <div className="info-card">
            <h3>ℹ️ Informações da Rotação</h3>
            <p>A rotação semanal de campeões gratuitos é atualizada toda terça-feira.</p>
            <p>Total de campeões na rotação: <strong>{rotation?.champions?.length || 0}</strong></p>
            <p>Campeões para novos jogadores: <strong>{rotation?.newPlayerChampions?.length || 0}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleRotation;
