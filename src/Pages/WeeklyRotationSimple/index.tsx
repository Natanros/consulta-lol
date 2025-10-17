import React, { useState, useEffect } from 'react';
import { ChampionRotation } from '../../Services/riotAPI';
import { getBasicRotationData } from '../../Services/riotAPISimple';
import './styles.css';

const WeeklyRotationSimple: React.FC = () => {
  const [rotation, setRotation] = useState<ChampionRotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRotationData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Carregando rotação semanal (versão simplificada)...');

        const rotationData = await getBasicRotationData();
        console.log('✅ Dados da rotação recebidos:', rotationData);
        setRotation(rotationData);

      } catch (err: any) {
        console.error('❌ Erro ao carregar rotação:', err);
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

      {rotation && (
        <div className="rotation-content">
          {/* Campeões para todos os jogadores */}
          <section className="rotation-section">
            <h2>
              <span className="section-icon">👥</span>
              Campeões Gratuitos (Todos os Jogadores)
            </h2>
            <div className="champions-grid">
              {rotation.freeChampionIds.map((championId) => (
                <div key={championId} className="champion-card-simple">
                  <div className="champion-id">ID: {championId}</div>
                  <div className="champion-placeholder">
                    <span>🏆</span>
                  </div>
                  <div className="champion-note">
                    Dados detalhados em breve
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Campeões para novos jogadores */}
          <section className="rotation-section">
            <h2>
              <span className="section-icon">🌟</span>
              Campeões para Novos Jogadores (Nível ≤ {rotation.maxNewPlayerLevel})
            </h2>
            <div className="champions-grid">
              {rotation.freeChampionIdsForNewPlayers.map((championId) => (
                <div key={championId} className="champion-card-simple">
                  <div className="champion-id">ID: {championId}</div>
                  <div className="champion-placeholder">
                    <span>⭐</span>
                  </div>
                  <div className="champion-note">
                    Para jogadores novos
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="rotation-footer">
            <p>
              🔄 A rotação semanal é atualizada toda terça-feira.
            </p>
            <p>
              ℹ️ Esta é uma versão simplificada. Os nomes e imagens dos campeões serão adicionados em breve.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyRotationSimple;