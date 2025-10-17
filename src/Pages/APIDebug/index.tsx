import React, { useState, useEffect } from 'react';
import { riotAPI } from '../../Services/riotAPI';
import APIKeyGuide from '../../Components/APIKeyGuide';
import './styles.css';

const APIDebug: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<{ valid: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Carregar chave da API atual
    const currentKey = process.env.REACT_APP_API_KEY || '';
    setApiKey(currentKey);
    
    // Testar automaticamente ao carregar
    // eslint-disable-next-line react-hooks/exhaustive-deps
    testAPI();
  }, []);

  const testAPI = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      // Teste 1: Status da API
      console.log('🧪 Iniciando testes da API...');
      addTestResult('Testando status da API...', 'info');
      
      const status = await riotAPI.testAPIKey();
      setApiStatus(status);
      
      if (status.valid) {
        addTestResult('✅ Chave da API válida!', 'success');
        
        // Teste 2: Rotação de campeões
        addTestResult('Testando rotação de campeões...', 'info');
        try {
          const rotation = await riotAPI.getChampionRotation();
          addTestResult(`✅ Rotação carregada: ${rotation.freeChampionIds.length} campeões gratuitos`, 'success');
        } catch (error: any) {
          addTestResult(`❌ Erro na rotação: ${error.message}`, 'error');
        }
        
        // Teste 3: Busca por nome
        addTestResult('Testando busca por nome (Faker)...', 'info');
        try {
          riotAPI.setRegion('kr');
          const summoner = await riotAPI.getSummonerByName('Faker');
          addTestResult(`✅ Invocador encontrado: ${summoner.name} (Nível ${summoner.summonerLevel})`, 'success');
        } catch (error: any) {
          addTestResult(`⚠️ Erro na busca por nome: ${error.message}`, 'warning');
        }
        
        // Teste 4: Busca por Riot ID específico (Natan#9315)
        addTestResult('Testando busca por Riot ID (Natan#9315)...', 'info');
        try {
          const summoner = await riotAPI.getSummonerByRiotId('Natan#9315');
          addTestResult(`✅ Riot ID encontrado: ${summoner.name} (Nível ${summoner.summonerLevel})`, 'success');
        } catch (error: any) {
          addTestResult(`⚠️ Erro na busca por Riot ID: ${error.message}`, 'warning');
        }

        // Teste 5: Rotação Semanal
        addTestResult('Testando rotação semanal...', 'info');
        try {
          const rotation = await riotAPI.getChampionRotation();
          addTestResult(`✅ Rotação semanal: ${rotation.freeChampionIds.length} campeões gratuitos`, 'success');
          
          // Teste 6: Data Dragon (função getChampionData)
          addTestResult('Testando Data Dragon...', 'info');
          try {
            const { getChampionData } = await import('../../Services/riotAPI');
            const firstChampionId = rotation.freeChampionIds[0];
            const championData = await getChampionData(firstChampionId);
            
            if (championData) {
              addTestResult(`✅ Data Dragon: Campeão ID ${firstChampionId} = ${championData.name}`, 'success');
            } else {
              addTestResult(`❌ Data Dragon: Não foi possível obter dados do campeão ID ${firstChampionId}`, 'error');
            }
          } catch (ddError: any) {
            addTestResult(`❌ Data Dragon falhou: ${ddError.message}`, 'error');
          }
        } catch (error: any) {
          addTestResult(`❌ Rotação semanal falhou: ${error.message}`, 'error');
        }
        
      } else {
        addTestResult(`❌ ${status.message}`, 'error');
      }
      
    } catch (error: any) {
      addTestResult(`💥 Erro geral: ${error.message}`, 'error');
      setApiStatus({ valid: false, message: error.message });
    }
    
    setLoading(false);
  };

  const addTestResult = (message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, { message, type, timestamp }]);
  };

  const copyNewKeyInstructions = () => {
    setShowGuide(true);
  };

  return (
    <div className="api-debug-container">
      <div className="debug-header">
        <h1>🔧 Debug da API</h1>
        <p>Teste e diagnostique problemas com a API da Riot Games</p>
      </div>

      <div className="debug-content">
        {/* Problemas Reportados */}
        <div className="reported-issues-section">
          <h2>🚨 Problemas Reportados</h2>
          <div className="issue-list">
            <div className="issue-item">
              <span className="issue-icon">❌</span>
              <div className="issue-details">
                <strong>Rotação Semanal não funcionando</strong>
                <p>A página de rotação semanal não está carregando os campeões gratuitos</p>
              </div>
            </div>
            <div className="issue-item">
              <span className="issue-icon">❌</span>
              <div className="issue-details">
                <strong>Busca por Riot ID falhando</strong>
                <p>Pesquisa pelo usuário "Natan#9315" não está retornando resultados</p>
              </div>
            </div>
          </div>
          <p className="diagnosis-note">
            <strong>Diagnóstico Provável:</strong> Chave da API expirada (erro 401). As chaves da Riot expiram a cada 24 horas.
          </p>
          
          <div className="quick-solutions">
            <h3>🚀 Soluções Rápidas</h3>
            <div className="solution-buttons">
              <button 
                className="solution-button primary"
                onClick={() => setShowGuide(true)}
              >
                🔑 Renovar Chave da API
              </button>
              <button 
                className="solution-button secondary"
                onClick={testAPI}
                disabled={loading}
              >
                🔄 Testar Novamente
              </button>
            </div>
          </div>
        </div>

        {/* Status da API */}
        <div className="status-section">
          <h2>Status da Chave da API</h2>
          <div className={`status-card ${apiStatus?.valid ? 'valid' : 'invalid'}`}>
            <div className="status-icon">
              {apiStatus?.valid ? '✅' : '❌'}
            </div>
            <div className="status-info">
              <h3>{apiStatus?.valid ? 'API Funcionando' : 'Problema na API'}</h3>
              <p>{apiStatus?.message}</p>
            </div>
          </div>
          
          <div className="api-key-info">
            <h3>Chave Atual:</h3>
            <code className="api-key-display">
              {apiKey.slice(0, 10)}...{apiKey.slice(-4)}
            </code>
            
            {!apiStatus?.valid && (
                            <button 
                className="help-button"
                onClick={copyNewKeyInstructions}
              >
                📋 Como Renovar Chave da API
              </button>
            )}
          </div>
        </div>

        {/* Controles de teste */}
        <div className="test-controls">
          <button 
            className="test-button" 
            onClick={testAPI}
            disabled={loading}
          >
            {loading ? '🔄 Testando...' : '🧪 Executar Testes'}
          </button>
        </div>

        {/* Resultados dos testes */}
        <div className="test-results">
          <h2>Resultados dos Testes</h2>
          <div className="results-list">
            {testResults.map((result, index) => (
              <div key={index} className={`result-item ${result.type}`}>
                <span className="result-time">{result.timestamp}</span>
                <span className="result-message">{result.message}</span>
              </div>
            ))}
            {testResults.length === 0 && !loading && (
              <p className="no-results">Nenhum teste executado ainda.</p>
            )}
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="info-section">
          <h2>ℹ️ Informações Importantes</h2>
          <div className="info-cards">
            <div className="info-card">
              <h3>🔑 Chaves da API</h3>
              <p>As chaves da Riot API expiram a cada 24 horas e precisam ser renovadas diariamente.</p>
            </div>
            <div className="info-card">
              <h3>🌎 Regiões</h3>
              <p>Certifique-se de usar a região correta para cada jogador (BR1, NA1, EUW1, etc.)</p>
            </div>
            <div className="info-card">
              <h3>🎮 Riot ID</h3>
              <p>Use o novo formato NomeDoJogador#TAG para buscar jogadores com Riot ID.</p>
            </div>
          </div>
        </div>

        {/* Informações Úteis */}
        <div className="info-section">
          <h2>💡 Informações Importantes</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">⏰</div>
              <div className="info-content">
                <h3>Expiração da Chave</h3>
                <p>As chaves pessoais da API da Riot expiram automaticamente a cada 24 horas.</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">🔄</div>
              <div className="info-content">
                <h3>Renovação Automática</h3>
                <p>Não existe renovação automática. Você deve gerar uma nova chave manualmente.</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">🌐</div>
              <div className="info-content">
                <h3>Região BR1</h3>
                <p>Esta aplicação está configurada para a região BR1 (Brasil).</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">📊</div>
              <div className="info-content">
                <h3>Rate Limits</h3>
                <p>Chaves pessoais têm limite de 100 requisições por 2 minutos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showGuide && (
        <APIKeyGuide onClose={() => setShowGuide(false)} />
      )}
    </div>
  );
};

export default APIDebug;