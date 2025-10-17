import React, { useState, useEffect } from 'react';
import './styles.css';

const TestNetwork: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testNetworkConnectivity = async () => {
    setLoading(true);
    setResults([]);
    
    addResult("🔄 Iniciando testes de conectividade...");

    // Teste 1: Verificar se a chave da API está configurada
    const apiKey = process.env.REACT_APP_API_KEY;
    if (apiKey) {
      addResult(`✅ Chave da API configurada: ${apiKey.slice(0, 10)}...`);
    } else {
      addResult("❌ Chave da API NÃO configurada");
      setLoading(false);
      return;
    }

    // Teste 2: Teste básico de fetch
    try {
      addResult("🌐 Testando conectividade básica...");
      const basicResponse = await fetch('https://httpbin.org/get', { 
        method: 'GET',
        mode: 'cors'
      });
      if (basicResponse.ok) {
        addResult("✅ Conectividade básica funcionando");
      } else {
        addResult(`❌ Conectividade básica falhou: ${basicResponse.status}`);
      }
    } catch (error: any) {
      addResult(`❌ Erro de conectividade básica: ${error.message}`);
    }

    // Teste 3: Teste direto da API da Riot (sem proxy)
    try {
      addResult("🎮 Testando API da Riot diretamente...");
      const riotResponse = await fetch('https://br1.api.riotgames.com/lol/platform/v3/champion-rotations', {
        method: 'GET',
        headers: {
          'X-Riot-Token': apiKey,
          'Accept': 'application/json',
        },
        mode: 'cors',
      });

      if (riotResponse.ok) {
        const data = await riotResponse.json();
        addResult(`✅ API da Riot funcionando: ${data.freeChampionIds.length} campeões gratuitos`);
        addResult(`📊 IDs dos campeões: ${data.freeChampionIds.slice(0, 5).join(', ')}...`);
      } else {
        addResult(`❌ API da Riot falhou: ${riotResponse.status} - ${riotResponse.statusText}`);
        const errorText = await riotResponse.text();
        addResult(`📝 Resposta de erro: ${errorText.slice(0, 200)}`);
      }
    } catch (error: any) {
      addResult(`❌ Erro na API da Riot: ${error.message}`);
      addResult(`🔍 Tipo do erro: ${error.constructor.name}`);
      if (error.stack) {
        addResult(`📚 Stack trace: ${error.stack.split('\n')[0]}`);
      }
    }

    // Teste 4: Headers e CORS
    try {
      addResult("🔒 Verificando headers e CORS...");
      const corsResponse = await fetch('https://br1.api.riotgames.com/lol/platform/v3/champion-rotations', {
        method: 'OPTIONS',
        mode: 'cors',
      });
      addResult(`🔍 Preflight CORS: ${corsResponse.status}`);
    } catch (error: any) {
      addResult(`❌ Erro de CORS: ${error.message}`);
    }

    setLoading(false);
    addResult("🏁 Testes concluídos");
  };

  useEffect(() => {
    testNetworkConnectivity();
  }, []);

  return (
    <div className="test-container">
      <div className="test-header">
        <h1>🔧 Teste de Conectividade</h1>
        <p>Diagnosticando problemas de rede e API</p>
      </div>

      <div className="test-content">
        <div className="test-controls">
          <button 
            onClick={testNetworkConnectivity}
            disabled={loading}
            className="test-button"
          >
            {loading ? "🔄 Testando..." : "🔄 Executar Testes"}
          </button>
        </div>

        <div className="test-results">
          <h3>📋 Resultados dos Testes</h3>
          <div className="results-list">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`result-item ${
                  result.includes('✅') ? 'success' : 
                  result.includes('❌') ? 'error' : 
                  'info'
                }`}
              >
                {result}
              </div>
            ))}
          </div>
        </div>

        <div className="test-info">
          <h3>💡 Informações do Ambiente</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>URL atual:</strong> {window.location.href}
            </div>
            <div className="info-item">
              <strong>User Agent:</strong> {navigator.userAgent.slice(0, 80)}...
            </div>
            <div className="info-item">
              <strong>Protocolo:</strong> {window.location.protocol}
            </div>
            <div className="info-item">
              <strong>Host:</strong> {window.location.host}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestNetwork;