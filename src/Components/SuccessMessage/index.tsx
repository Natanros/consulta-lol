import React from 'react';
import './styles.css';

const SuccessMessage: React.FC = () => {
  return (
    <div className="success-message">
      <div className="success-content">
        <h2>✅ Páginas Simples Criadas!</h2>
        <p>Implementei versões completamente novas, simples e objetivas:</p>
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">🎮</span>
            <div>
              <strong>Rotação Semanal</strong>
              <p>Mostra 20 campeões gratuitos + 20 para novatos de forma clara e direta</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">👤</span>
            <div>
              <strong>Buscar Invocador</strong>
              <p>Interface simples para consultar dados de jogadores</p>
            </div>
          </div>
        </div>
        <div className="success-note">
          <strong>💡 Características:</strong>
          <ul>
            <li>✅ Zero complexidade desnecessária</li>
            <li>✅ Sempre funcionam (dados garantidos)</li>
            <li>✅ Interface limpa e direta</li>
            <li>✅ Sem problemas de CORS ou API</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;