import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.css';
import api from '../../Services/api';

interface Skill {
  id: string;
  name: string;
  description: string;
  tooltip: string;
  leveltip?: {
    label: string[];
    effect: string[];
  };
  maxrank: number;
  cooldown: number[];
  cooldownBurn: string;
  cost: number[];
  costBurn: string;
  datavalues: any;
  effect: (number[] | null)[];
  effectBurn: (string | null)[];
  vars: any[];
  costType: string;
  maxammo: string;
  range: number[];
  rangeBurn: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  resource: string;
}

interface Passive {
  name: string;
  description: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

interface ChampionDetailData {
  id: string;
  key: string;
  name: string;
  title: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  skins: Array<{
    id: string;
    num: number;
    name: string;
    chromas: boolean;
  }>;
  lore: string;
  blurb: string;
  allytips: string[];
  enemytips: string[];
  tags: string[];
  partype: string;
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  stats: any;
  spells: Skill[];
  passive: Passive;
  recommended: any[];
}



export default function ChampionDetail() {
  const { championId } = useParams<{ championId: string }>();
  const navigate = useNavigate();
  const [championData, setChampionData] = useState<ChampionDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSkinIndex, setSelectedSkinIndex] = useState(0);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState<number | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [modalImageAlt, setModalImageAlt] = useState('');

  useEffect(() => {
    const fetchChampionDetail = async () => {
      if (!championId) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/champion/${championId}.json`);
        const championDetail = response.data.data[championId];
        setChampionData(championDetail);
      } catch (error) {
        console.error('Error fetching champion detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChampionDetail();
  }, [championId]);

  const handleGoBack = () => {
    navigate('/');
  };

  const openImageModal = (imageUrl: string, alt: string) => {
    setModalImageUrl(imageUrl);
    setModalImageAlt(alt);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setModalImageUrl('');
    setModalImageAlt('');
  };

  // Fechar modal com tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeImageModal();
      }
    };

    if (imageModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Previne scroll do body
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [imageModalOpen]);

  if (loading) {
    return (
      <div className="champion-detail-loading">
        <div className="loading-spinner"></div>
        <p>Carregando informações do campeão...</p>
      </div>
    );
  }

  if (!championData) {
    return (
      <div className="champion-detail-error">
        <h2>Campeão não encontrado</h2>
        <button onClick={handleGoBack} className="back-button">
          Voltar para Home
        </button>
      </div>
    );
  }

  const currentSkin = championData.skins[selectedSkinIndex];
  const skinImageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championData.id}_${currentSkin.num}.jpg`;

  return (
    <div className="champion-detail-container">
      {/* Header com botão voltar */}
      <div className="champion-detail-header">
        <button onClick={handleGoBack} className="back-button">
          ← Voltar
        </button>
        <h1>{championData.name}</h1>
        <p className="champion-subtitle">{championData.title}</p>
      </div>

      {/* Hero Section com imagem da skin */}
      <div className="champion-hero">
        <div className="champion-splash">
          <div className="splash-image-container">
            <img 
              src={skinImageUrl} 
              alt={`${championData.name} - ${currentSkin.name === 'default' ? 'Padrão' : (currentSkin.name || 'Padrão')}`}
              className="splash-image"
              onClick={() => openImageModal(skinImageUrl, `${championData.name} - ${currentSkin.name === 'default' ? 'Padrão' : (currentSkin.name || 'Padrão')}`)}
            />
            <button 
              className="image-expand-button"
              onClick={() => openImageModal(skinImageUrl, `${championData.name} - ${currentSkin.name === 'default' ? 'Padrão' : (currentSkin.name || 'Padrão')}`)}
              title="Ver imagem em tela cheia"
            >
              🔍
            </button>
          </div>
          <div className="champion-hero-overlay">
            <div className="champion-stats-display">
              <div className="stat-display">
                <span className="stat-icon">⚔️</span>
                <span className="stat-label">Ataque</span>
                <div className="stat-bar">
                  <div 
                    className="stat-fill attack" 
                    style={{ width: `${championData.info.attack * 10}%` }}
                  ></div>
                </div>
                <span className="stat-value">{championData.info.attack}/10</span>
              </div>
              <div className="stat-display">
                <span className="stat-icon">🛡️</span>
                <span className="stat-label">Defesa</span>
                <div className="stat-bar">
                  <div 
                    className="stat-fill defense" 
                    style={{ width: `${championData.info.defense * 10}%` }}
                  ></div>
                </div>
                <span className="stat-value">{championData.info.defense}/10</span>
              </div>
              <div className="stat-display">
                <span className="stat-icon">✨</span>
                <span className="stat-label">Magia</span>
                <div className="stat-bar">
                  <div 
                    className="stat-fill magic" 
                    style={{ width: `${championData.info.magic * 10}%` }}
                  ></div>
                </div>
                <span className="stat-value">{championData.info.magic}/10</span>
              </div>
              <div className="stat-display">
                <span className="stat-icon">⭐</span>
                <span className="stat-label">Dificuldade</span>
                <div className="stat-bar">
                  <div 
                    className="stat-fill difficulty" 
                    style={{ width: `${championData.info.difficulty * 10}%` }}
                  ></div>
                </div>
                <span className="stat-value">{championData.info.difficulty}/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="champion-content">
        {/* Seção de História */}
        <section className="champion-section">
          <h2>📖 História</h2>
          <div className="lore-container">
            <p className="champion-lore">{championData.lore}</p>
            
            <div className="tags-container">
              <h3>🏷️ Classificações</h3>
              <div className="champion-tags">
                {championData.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Habilidades */}
        <section className="champion-section">
          <h2>⚡ Habilidades</h2>
          <div className="abilities-container">
            {/* Passiva */}
            <div className="ability-item passive">
              <div className="ability-icon">
                <img 
                  src={`https://ddragon.leagueoflegends.com/cdn/15.19.1/img/passive/${championData.passive.image.full}`}
                  alt={championData.passive.name}
                />
                <span className="ability-key">P</span>
              </div>
              <div className="ability-info">
                <h4>{championData.passive.name}</h4>
                <p dangerouslySetInnerHTML={{ __html: championData.passive.description }}></p>
              </div>
            </div>

            {/* Habilidades */}
            {championData.spells.map((spell, index) => (
              <div 
                key={spell.id} 
                className={`ability-item ${selectedSkillIndex === index ? 'selected' : ''}`}
                onClick={() => setSelectedSkillIndex(selectedSkillIndex === index ? null : index)}
              >
                <div className="ability-icon">
                  <img 
                    src={`https://ddragon.leagueoflegends.com/cdn/15.19.1/img/spell/${spell.image.full}`}
                    alt={spell.name}
                  />
                  <span className="ability-key">{['Q', 'W', 'E', 'R'][index]}</span>
                </div>
                <div className="ability-info">
                  <h4>{spell.name}</h4>
                  <p dangerouslySetInnerHTML={{ __html: spell.description }}></p>
                  {selectedSkillIndex === index && (
                    <div className="ability-details">
                      <div className="ability-stats">
                        <span><strong>Recarga:</strong> {spell.cooldownBurn}s</span>
                        {spell.costBurn && <span><strong>Custo:</strong> {spell.costBurn} {spell.costType}</span>}
                        {spell.rangeBurn && <span><strong>Alcance:</strong> {spell.rangeBurn}</span>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seção de Skins */}
        <section className="champion-section">
          <h2>👗 Skins</h2>
          <div className="skins-container">
            <div className="skins-grid">
              {championData.skins.map((skin, index) => (
                <div 
                  key={skin.id}
                  className={`skin-item ${selectedSkinIndex === index ? 'selected' : ''}`}
                  onClick={() => setSelectedSkinIndex(index)}
                >
                  <div className="skin-image-container">
                    <img 
                      src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championData.id}_${skin.num}.jpg`}
                      alt={skin.name === 'default' ? 'Padrão' : (skin.name || 'Padrão')}
                      className="skin-image"
                    />
                    <button 
                      className="skin-expand-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openImageModal(
                          `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championData.id}_${skin.num}.jpg`,
                          skin.name === 'default' ? 'Padrão' : (skin.name || 'Padrão')
                        );
                      }}
                      title="Ver splash art em tela cheia"
                    >
                      🔍
                    </button>
                  </div>
                  <div className="skin-info">
                    <h4>{skin.name === 'default' ? 'Padrão' : (skin.name || 'Padrão')}</h4>
                    {skin.chromas && <span className="chromas-badge">Cromas disponíveis</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dicas */}
        <section className="champion-section">
          <h2>💡 Dicas</h2>
          <div className="tips-container">
            <div className="tips-column">
              <h3>🤝 Jogando com {championData.name}</h3>
              <ul className="tips-list ally">
                {championData.allytips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
            <div className="tips-column">
              <h3>⚔️ Jogando contra {championData.name}</h3>
              <ul className="tips-list enemy">
                {championData.enemytips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Modal de imagem em tela cheia */}
      {imageModalOpen && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={closeImageModal}>
              ✕
            </button>
            <img 
              src={modalImageUrl} 
              alt={modalImageAlt}
              className="image-modal-img"
            />
            <div className="image-modal-info">
              <h3>{modalImageAlt}</h3>
              <p>Pressione ESC para fechar ou clique fora da imagem</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}