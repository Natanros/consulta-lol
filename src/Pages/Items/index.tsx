import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import api from '../../Services/api';

interface Item {
  name: string;
  description: string;
  colloq: string;
  plaintext: string;
  into?: string[];
  from?: string[];
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  gold: {
    base: number;
    purchasable: boolean;
    total: number;
    sell: number;
  };
  tags: string[];
  maps: { [key: string]: boolean };
  stats: { [key: string]: number };
}

interface ItemsData {
  type: string;
  version: string;
  data: { [key: string]: Item };
}

export default function Items() {
  const [itemsData, setItemsData] = useState<ItemsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>('name');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await api.get('/item.json');
        setItemsData(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const items = useMemo(() => {
    if (!itemsData) return [];
    return Object.entries(itemsData.data)
      .filter(([_, item]) => item.maps['11'] && item.gold.purchasable) // Apenas itens compráveis no SR
      .map(([id, item]) => ({ id, ...item }));
  }, [itemsData]);

  const categories = useMemo(() => {
    const allTags = new Set<string>();
    items.forEach(item => {
      item.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.plaintext.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item =>
        item.tags.includes(selectedCategory)
      );
    }

    // Filtro por preço
    filtered = filtered.filter(item =>
      item.gold.total >= priceRange[0] && item.gold.total <= priceRange[1]
    );

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.gold.total - b.gold.total;
        case 'price-high':
          return b.gold.total - a.gold.total;
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, searchTerm, selectedCategory, priceRange, sortBy]);

  const handleGoBack = () => {
    navigate('/');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 10000]);
    setSortBy('name');
  };

  if (loading) {
    return (
      <div className="items-loading">
        <div className="loading-spinner"></div>
        <p>Carregando itens...</p>
      </div>
    );
  }

  return (
    <div className="items-container">
      {/* Header */}
      <div className="items-header">
        <button onClick={handleGoBack} className="back-button">
          ← Voltar
        </button>
        <h1>🛡️ Itens do League of Legends</h1>
        <p className="items-subtitle">Descubra todos os itens disponíveis no jogo</p>
      </div>

      {/* Filtros */}
      <div className="items-filters">
        <div className="filters-row">
          {/* Busca */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Categoria */}
          <div className="filter-group">
            <label>Categoria:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todas</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Preço */}
          <div className="filter-group">
            <label>Preço máximo:</label>
            <div className="price-range">
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="price-slider"
              />
              <span className="price-display">{priceRange[1]}g</span>
            </div>
          </div>

          {/* Ordenação */}
          <div className="filter-group">
            <label>Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Nome (A-Z)</option>
              <option value="price-low">Preço (Menor)</option>
              <option value="price-high">Preço (Maior)</option>
            </select>
          </div>

          {/* Limpar */}
          <button className="clear-filters-btn" onClick={clearFilters}>
            🗑️ Limpar
          </button>
        </div>

        {/* Resultados */}
        <div className="results-info">
          <span className="results-count">
            {filteredItems.length} {filteredItems.length === 1 ? 'item encontrado' : 'itens encontrados'}
          </span>
        </div>
      </div>

      {/* Grid de Itens */}
      <div className="items-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="item-card"
              style={{ animationDelay: `${index * 0.02}s` }}
            >
              <div className="item-image-container">
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/15.19.1/img/item/${item.image.full}`}
                  alt={item.name}
                  className="item-image"
                />
                <div className="item-price">
                  {item.gold.total}g
                </div>
              </div>
              
              <div className="item-info">
                <h3>{item.name}</h3>
                <p className="item-description">{item.plaintext}</p>
                
                <div className="item-tags">
                  {item.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span key={tagIndex} className="item-tag">{tag}</span>
                  ))}
                </div>

                {Object.keys(item.stats).length > 0 && (
                  <div className="item-stats">
                    {Object.entries(item.stats).slice(0, 3).map(([stat, value]) => (
                      <div key={stat} className="stat-item">
                        <span className="stat-name">{stat.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="stat-value">+{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>Nenhum item encontrado</h3>
            <p>Tente ajustar os filtros para encontrar itens.</p>
            <button className="clear-filters-btn" onClick={clearFilters}>
              🗑️ Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}