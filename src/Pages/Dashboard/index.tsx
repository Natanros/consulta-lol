import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

interface Champion {
  id: string;
  name: string;
  title: string;
  image: {
    full: string;
  };
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  stats: {
    hp: number;
    hpperlevel: number;
    mp: number;
    mpperlevel: number;
    movespeed: number;
    armor: number;
    armorperlevel: number;
    spellblock: number;
    spellblockperlevel: number;
    attackrange: number;
    hpregen: number;
    hpregenperlevel: number;
    mpregen: number;
    mpregenperlevel: number;
    crit: number;
    critperlevel: number;
    attackdamage: number;
    attackdamageperlevel: number;
    attackspeedperlevel: number;
    attackspeed: number;
  };
  tags: string[];
}

interface ChampionData {
  data: { [key: string]: Champion };
}

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  description: string;
  color: string;
}

const Dashboard: React.FC = () => {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const response = await fetch('https://ddragon.leagueoflegends.com/cdn/15.19.1/data/pt_BR/champion.json');
        const data: ChampionData = await response.json();
        const championList = Object.values(data.data);
        setChampions(championList);
        calculateStats(championList);
      } catch (error) {
        console.error('Erro ao carregar campeões:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChampions();
  }, []);

  const calculateStats = (championList: Champion[]) => {
    const totalChampions = championList.length;
    
    // Campeão mais tanque (maior HP)
    const tankiest = championList.reduce((prev, curr) => 
      prev.stats.hp > curr.stats.hp ? prev : curr
    );
    
    // Campeão mais rápido
    const fastest = championList.reduce((prev, curr) => 
      prev.stats.movespeed > curr.stats.movespeed ? prev : curr
    );
    
    // Maior dano de ataque base
    const strongestAD = championList.reduce((prev, curr) => 
      prev.stats.attackdamage > curr.stats.attackdamage ? prev : curr
    );
    
    // Maior alcance de ataque
    const longestRange = championList.reduce((prev, curr) => 
      prev.stats.attackrange > curr.stats.attackrange ? prev : curr
    );
    
    // Contagem por roles
    const roleCount = championList.reduce((acc, champion) => {
      champion.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as { [key: string]: number });
    
    const mostCommonRole = Object.entries(roleCount).reduce((prev, curr) => 
      curr[1] > prev[1] ? curr : prev
    );
    
    // Dificuldade média
    const avgDifficulty = championList.reduce((sum, champion) => 
      sum + champion.info.difficulty, 0
    ) / totalChampions;

    const statsData: StatCard[] = [
      {
        title: 'Total de Campeões',
        value: totalChampions,
        icon: '👥',
        description: 'Campeões únicos disponíveis',
        color: '#C89B3C'
      },
      {
        title: 'Mais Resistente',
        value: `${tankiest.name}`,
        icon: '🛡️',
        description: `${tankiest.stats.hp} HP base`,
        color: '#0F8B8D'
      },
      {
        title: 'Mais Rápido',
        value: `${fastest.name}`,
        icon: '💨',
        description: `${fastest.stats.movespeed} de velocidade`,
        color: '#A8DADC'
      },
      {
        title: 'Maior Dano AD',
        value: `${strongestAD.name}`,
        icon: '⚔️',
        description: `${strongestAD.stats.attackdamage} de dano base`,
        color: '#E63946'
      },
      {
        title: 'Maior Alcance',
        value: `${longestRange.name}`,
        icon: '🏹',
        description: `${longestRange.stats.attackrange} de alcance`,
        color: '#F77F00'
      },
      {
        title: 'Role Mais Comum',
        value: mostCommonRole[0],
        icon: '📊',
        description: `${mostCommonRole[1]} campeões`,
        color: '#FCBF49'
      },
      {
        title: 'Dificuldade Média',
        value: avgDifficulty.toFixed(1),
        icon: '🎯',
        description: 'De 1 a 10 pontos',
        color: '#143642'
      },
      {
        title: 'Versão da API',
        value: '15.19.1',
        icon: '🔄',
        description: 'Data Dragon API',
        color: '#C89B3C'
      }
    ];

    setStats(statsData);
  };

  const getRoleTranslation = (role: string) => {
    const translations: { [key: string]: string } = {
      'Assassin': 'Assassino',
      'Fighter': 'Lutador',
      'Mage': 'Mago',
      'Marksman': 'Atirador',
      'Support': 'Suporte',
      'Tank': 'Tanque'
    };
    return translations[role] || role;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>
        <span className="dashboard-icon">📊</span>
        <span className="dashboard-title">Dashboard - Estatísticas do League of Legends</span>
      </h1>
      
      {/* Grid de estatísticas */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="stat-card"
            style={{ '--accent-color': stat.color } as React.CSSProperties}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <div className="stat-value">
                {typeof stat.value === 'string' && stat.value.length > 15 
                  ? `${stat.value.substring(0, 15)}...` 
                  : stat.value
                }
              </div>
              <p className="stat-description">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Seção de análise por roles */}
      <div className="analysis-section">
        <h2>🎭 Análise por Função</h2>
        <div className="role-analysis">
          {Object.entries(
            champions.reduce((acc, champion) => {
              champion.tags.forEach(tag => {
                acc[tag] = (acc[tag] || 0) + 1;
              });
              return acc;
            }, {} as { [key: string]: number })
          )
          .sort((a, b) => b[1] - a[1])
          .map(([role, count]) => (
            <div key={role} className="role-bar">
              <div className="role-info">
                <span className="role-name">{getRoleTranslation(role)}</span>
                <span className="role-count">{count} campeões</span>
              </div>
              <div className="role-progress">
                <div 
                  className="role-fill"
                  style={{ 
                    width: `${(count / champions.length) * 100}%`,
                    background: `linear-gradient(135deg, var(--primary-gold), var(--secondary-gold))`
                  }}
                ></div>
              </div>
              <span className="role-percentage">
                {((count / champions.length) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top campeões por categoria */}
      <div className="top-champions">
        <h2>🏆 Top Campeões por Categoria</h2>
        <div className="top-grid">
          <div className="top-card">
            <h3>💪 Maior HP</h3>
            <div className="champion-highlight">
              {champions
                .sort((a, b) => b.stats.hp - a.stats.hp)
                .slice(0, 3)
                .map((champion, index) => (
                  <div 
                    key={champion.id} 
                    className="champion-mini"
                    onClick={() => navigate(`/champion/${champion.id}`)}
                  >
                    <img 
                      src={`https://ddragon.leagueoflegends.com/cdn/15.19.1/img/champion/${champion.image.full}`}
                      alt={champion.name}
                    />
                    <div className="champion-info">
                      <span className="champion-name">{champion.name}</span>
                      <span className="champion-stat">{champion.stats.hp} HP</span>
                    </div>
                    <span className="champion-rank">#{index + 1}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="top-card">
            <h3>⚡ Maior Velocidade</h3>
            <div className="champion-highlight">
              {champions
                .sort((a, b) => b.stats.movespeed - a.stats.movespeed)
                .slice(0, 3)
                .map((champion, index) => (
                  <div 
                    key={champion.id} 
                    className="champion-mini"
                    onClick={() => navigate(`/champion/${champion.id}`)}
                  >
                    <img 
                      src={`https://ddragon.leagueoflegends.com/cdn/15.19.1/img/champion/${champion.image.full}`}
                      alt={champion.name}
                    />
                    <div className="champion-info">
                      <span className="champion-name">{champion.name}</span>
                      <span className="champion-stat">{champion.stats.movespeed} MS</span>
                    </div>
                    <span className="champion-rank">#{index + 1}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="top-card">
            <h3>⚔️ Maior Dano AD</h3>
            <div className="champion-highlight">
              {champions
                .sort((a, b) => b.stats.attackdamage - a.stats.attackdamage)
                .slice(0, 3)
                .map((champion, index) => (
                  <div 
                    key={champion.id} 
                    className="champion-mini"
                    onClick={() => navigate(`/champion/${champion.id}`)}
                  >
                    <img 
                      src={`https://ddragon.leagueoflegends.com/cdn/15.19.1/img/champion/${champion.image.full}`}
                      alt={champion.name}
                    />
                    <div className="champion-info">
                      <span className="champion-name">{champion.name}</span>
                      <span className="champion-stat">{champion.stats.attackdamage} AD</span>
                    </div>
                    <span className="champion-rank">#{index + 1}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;