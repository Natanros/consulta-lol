import React, { useState } from 'react';
import './styles.css';

interface APIKeyGuideProps {
  onClose: () => void;
}

const APIKeyGuide: React.FC<APIKeyGuideProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const steps = [
    {
      title: "1. Acesse o Portal de Desenvolvedores da Riot",
      content: (
        <div>
          <p>Abra seu navegador e vá para:</p>
          <div className="code-block">
            <code>https://developer.riotgames.com/</code>
            <button onClick={() => window.open('https://developer.riotgames.com/', '_blank')}>
              🔗 Abrir Link
            </button>
          </div>
        </div>
      )
    },
    {
      title: "2. Faça Login",
      content: (
        <div>
          <p>Clique em "SIGN IN" no canto superior direito e faça login com sua conta da Riot Games.</p>
          <p><strong>Nota:</strong> Use a mesma conta que você usa para jogar League of Legends.</p>
        </div>
      )
    },
    {
      title: "3. Navegue para Apps",
      content: (
        <div>
          <p>Após fazer login, clique em <strong>"Apps"</strong> no menu superior.</p>
          <p>Se esta é sua primeira vez, você pode ver uma página vazia. Isso é normal!</p>
        </div>
      )
    },
    {
      title: "4. Regenere ou Crie uma Chave",
      content: (
        <div>
          <p>Procure por:</p>
          <ul>
            <li><strong>"Personal API Key"</strong> na seção Development</li>
            <li>Se você já tem uma chave, clique em <strong>"REGENERATE API KEY"</strong></li>
            <li>Se não tem nenhuma, clique em <strong>"CREATE PERSONAL API KEY"</strong></li>
          </ul>
          <div className="warning-box">
            ⚠️ <strong>Importante:</strong> As chaves pessoais expiram a cada 24 horas!
          </div>
        </div>
      )
    },
    {
      title: "5. Copie a Nova Chave",
      content: (
        <div>
          <p>Sua nova chave da API aparecerá. Ela terá o formato:</p>
          <div className="code-block">
            <code>RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code>
          </div>
          <p><strong>IMPORTANTE:</strong> Copie esta chave completamente! Ela só aparece uma vez.</p>
        </div>
      )
    },
    {
      title: "6. Configure no Projeto",
      content: (
        <div>
          <p>Agora você precisa atualizar a chave no projeto:</p>
          <div className="options">
            <div className="option">
              <h4>Opção 1: Arquivo .env (Recomendado)</h4>
              <p>Crie/edite o arquivo <code>.env</code> na raiz do projeto:</p>
              <div className="code-block">
                <code>REACT_APP_API_KEY=SUA_CHAVE_AQUI</code>
              </div>
            </div>
            <div className="option">
              <h4>Opção 2: Editar Diretamente</h4>
              <p>Edite o arquivo <code>src/Services/riotAPI.ts</code> e substitua a chave na linha 2-3.</p>
            </div>
          </div>
          <div className="success-box">
            ✅ Após configurar, reinicie o servidor de desenvolvimento!
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="api-guide-overlay">
      <div className="api-guide-modal">
        <div className="guide-header">
          <h2>🔑 Como Renovar sua Chave da API da Riot</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="guide-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">Passo {currentStep} de {totalSteps}</span>
        </div>

        <div className="guide-content">
          <h3>{steps[currentStep - 1].title}</h3>
          <div className="step-content">
            {steps[currentStep - 1].content}
          </div>
        </div>

        <div className="guide-navigation">
          <button 
            className="nav-button prev" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            ← Anterior
          </button>
          
          <div className="step-indicators">
            {Array.from({ length: totalSteps }, (_, i) => (
              <button
                key={i}
                className={`step-indicator ${i + 1 === currentStep ? 'active' : ''} ${i + 1 < currentStep ? 'completed' : ''}`}
                onClick={() => setCurrentStep(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentStep < totalSteps ? (
            <button className="nav-button next" onClick={nextStep}>
              Próximo →
            </button>
          ) : (
            <button className="nav-button finish" onClick={onClose}>
              Finalizar ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default APIKeyGuide;