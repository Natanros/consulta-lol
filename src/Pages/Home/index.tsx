import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import api from '../../Services/api';
import { usePagination } from '../../Interfaces/Pagination';

interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  tags: string[];
  partype: string;
  stats: any;
}

interface ChampionData {
  type: string;
  format: string;
  version: string;
  data: { [key: string]: Champion };
}

export default function Home() {
  const [championData, setChampionData] = useState<ChampionData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('name');
  const navigate = useNavigate();
  const pageSize = 15;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/champion.json');
        setChampionData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const champions = useMemo(() => {
    if (!championData) return [];
    return Object.values(championData.data);
  }, [championData]);

  // Filtros e busca
  const filteredChampions = useMemo(() => {
    let filtered = champions;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(champion => 
        champion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        champion.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por função/role
    if (selectedRole !== 'all') {
      filtered = filtered.filter(champion => 
        champion.tags.some(tag => tag.toLowerCase() === selectedRole.toLowerCase())
      );
    }

    // Filtro por dificuldade
    if (selectedDifficulty > 0) {
      filtered = filtered.filter(champion => 
        champion.info.difficulty === selectedDifficulty
      );
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'difficulty':
          return b.info.difficulty - a.info.difficulty;
        case 'attack':
          return b.info.attack - a.info.attack;
        case 'defense':
          return b.info.defense - a.info.defense;
        case 'magic':
          return b.info.magic - a.info.magic;
        default:
          return 0;
      }
    });

    return filtered;
  }, [champions, searchTerm, selectedRole, selectedDifficulty, sortBy]);

  const totalCount = filteredChampions.length;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount: 1,
    pageSize,
  });

  const currentChampions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredChampions.slice(startIndex, endIndex);
  }, [filteredChampions, currentPage, pageSize]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Reset página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedDifficulty, sortBy]);

  // Funções de filtro
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  const handleDifficultyChange = (difficulty: number) => {
    setSelectedDifficulty(difficulty);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRole('all');
    setSelectedDifficulty(0);
    setSortBy('name');
  };

  const handlePageChange = (page: number | string) => {
    if (typeof page === 'number') {
      setCurrentPage(page);
    }
  };

  const handleChampionClick = (championId: string) => {
    navigate(`/champion/${championId}`);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!championData) {
    return <div className="loading">Carregando campeões...</div>;
  }

  return (
    <div className="home-container">
      <h1>🏆 League of Legends ⚔️</h1>
      
      {/* Ações Rápidas */}
      <div className="quick-actions">
        <button 
          className="quick-action-btn primary"
          onClick={() => navigate('/weekly-rotation')}
        >
          🎮 Rotação Semanal
        </button>
        <button 
          className="quick-action-btn secondary"
          onClick={() => navigate('/summoner-lookup')}
        >
          👤 Buscar Invocador
        </button>
      </div>
      
      {/* Sistema de Filtros */}
      <div className="filters-container">
        <div className="filters-row">
          {/* Busca */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar campeão..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => handleSearchChange('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filtro por Função */}
          <div className="filter-group">
            <label>Função:</label>
            <select 
              value={selectedRole} 
              onChange={(e) => handleRoleChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todas</option>
              <option value="Assassin">Assassino</option>
              <option value="Fighter">Lutador</option>
              <option value="Mage">Mago</option>
              <option value="Marksman">Atirador</option>
              <option value="Support">Suporte</option>
              <option value="Tank">Tanque</option>
            </select>
          </div>

          {/* Filtro por Dificuldade */}
          <div className="filter-group">
            <label>Dificuldade:</label>
            <select 
              value={selectedDifficulty} 
              onChange={(e) => handleDifficultyChange(Number(e.target.value))}
              className="filter-select"
            >
              <option value={0}>Todas</option>
              <option value={1}>⭐ Muito Fácil</option>
              <option value={2}>⭐⭐ Fácil</option>
              <option value={3}>⭐⭐⭐ Médio</option>
              <option value={4}>⭐⭐⭐⭐ Difícil</option>
              <option value={5}>⭐⭐⭐⭐⭐ Muito Difícil</option>
            </select>
          </div>

          {/* Ordenação */}
          <div className="filter-group">
            <label>Ordenar por:</label>
            <select 
              value={sortBy} 
              onChange={(e) => handleSortChange(e.target.value)}
              className="filter-select"
            >
              <option value="name">Nome (A-Z)</option>
              <option value="difficulty">Dificuldade ↓</option>
              <option value="attack">Ataque ↓</option>
              <option value="defense">Defesa ↓</option>
              <option value="magic">Magia ↓</option>
            </select>
          </div>

          {/* Botão Limpar */}
          <button className="clear-filters-btn" onClick={clearFilters}>
            🗑️ Limpar
          </button>
        </div>

        {/* Resultados */}
        <div className="results-info">
          <span className="results-count">
            {totalCount} {totalCount === 1 ? 'campeão encontrado' : 'campeões encontrados'}
          </span>
          {(searchTerm || selectedRole !== 'all' || selectedDifficulty > 0) && (
            <span className="active-filters">
              {searchTerm && <span className="filter-tag">"{searchTerm}"</span>}
              {selectedRole !== 'all' && <span className="filter-tag">{selectedRole}</span>}
              {selectedDifficulty > 0 && <span className="filter-tag">Dificuldade {selectedDifficulty}</span>}
            </span>
          )}
        </div>
      </div>
      
      <div className="champions-grid">
        {currentChampions.length > 0 ? (
          currentChampions.map((champion, index) => (
            <div 
              key={champion.id} 
              className="champion-card"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleChampionClick(champion.id)}
            >
              <div className="champion-image-container">
                <img 
                  src={`https://ddragon.leagueoflegends.com/cdn/15.19.1/img/champion/${champion.image.full}`}
                  alt={champion.name}
                  className="champion-image"
                  loading="lazy"
                />
              </div>
              <div className="champion-meta">
                <div className="difficulty-indicator">
                  {'⭐'.repeat(Math.min(champion.info.difficulty, 5))}
                </div>
                <div className="champion-tags">
                  {champion.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="champion-info">
                <div className="champion-header">
                  <h3>{champion.name}</h3>
                  <p className="champion-title">{champion.title}</p>
                </div>
                <div className="champion-stats">
                  <div className="stat-item">
                    <span className="stat-icon">⚔️</span>
                    <span className="stat-value">{champion.info.attack}/10</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">🛡️</span>
                    <span className="stat-value">{champion.info.defense}/10</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">✨</span>
                    <span className="stat-value">{champion.info.magic}/10</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>Nenhum campeão encontrado</h3>
            <p>Tente ajustar os filtros ou termo de busca para encontrar campeões.</p>
            <button className="clear-filters-btn" onClick={clearFilters} style={{ marginTop: '16px' }}>
              🗑️ Limpar Filtros
            </button>
          </div>
        )}
      </div>

      <div className="pagination-container">
        <div className="pagination-info">
          <span className="info-icon">📊</span>
          Mostrando <strong>{(currentPage - 1) * pageSize + 1}</strong> - <strong>{Math.min(currentPage * pageSize, totalCount)}</strong> de <strong>{totalCount}</strong> campeões
        </div>
        
        <div className="pagination">
          <button 
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="pagination-button prev-next"
            title="Página anterior"
          >
            ← Anterior
          </button>
          
          {paginationRange?.map((pageNumber, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(pageNumber)}
              className={`pagination-button ${
                pageNumber === currentPage ? 'active' : ''
              } ${pageNumber === '...' ? 'dots' : ''}`}
              disabled={pageNumber === '...'}
              title={pageNumber === '...' ? 'Mais páginas' : `Ir para página ${pageNumber}`}
            >
              {pageNumber}
            </button>
          ))}
          
          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="pagination-button prev-next"
            title="Próxima página"
          >
            Próximo →
          </button>
        </div>
        
        <div className="pagination-summary">
          Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
        </div>
      </div>
    </div>
  );
}