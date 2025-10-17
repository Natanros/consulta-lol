import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css';

interface SidebarItem {
  path: string;
  icon: string;
  label: string;
  description: string;
}

const sidebarItems: SidebarItem[] = [
  {
    path: '/',
    icon: '👥',
    label: 'Campeões',
    description: 'Explore todos os campeões disponíveis'
  },
  {
    path: '/weekly-rotation',
    icon: '🎮',
    label: 'Rotação Semanal',
    description: 'Campeões gratuitos - Versão Simples'
  },
  {
    path: '/summoner-lookup',
    icon: '👤',
    label: 'Buscar Invocador',
    description: 'Consulte jogadores - Versão Simples'
  },
  {
    path: '/items',
    icon: '⚔️',
    label: 'Itens',
    description: 'Descubra itens e suas estatísticas'
  },
  {
    path: '/dashboard',
    icon: '📊',
    label: 'Dashboard',
    description: 'Estatísticas e análises gerais'
  }
];

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    // Fecha o menu mobile após navegação
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isMobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleMobile}
        />
      )}

      {/* Botão hambúrguer para mobile */}
      <button 
        className="mobile-menu-btn"
        onClick={toggleMobile}
        aria-label="Toggle menu"
      >
        <span className={`hamburger ${isMobileOpen ? 'active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Sidebar */}
      <nav className={`sidebar ${isExpanded ? 'expanded' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Header da sidebar */}
        <div className="sidebar-header">
          <div className="logo-container">
            <span className="logo-icon">⚔️</span>
            {isExpanded && <span className="logo-text">LoL Consulta</span>}
          </div>
          
          {/* Botão de expansão (apenas desktop) */}
          <button 
            className="expand-btn"
            onClick={toggleExpanded}
            aria-label={isExpanded ? 'Recolher menu' : 'Expandir menu'}
          >
            <span className={`expand-icon ${isExpanded ? 'rotated' : ''}`}>
              ▶️
            </span>
          </button>
        </div>

        {/* Lista de navegação */}
        <ul className="sidebar-menu">
          {sidebarItems.map((item) => (
            <li key={item.path} className="sidebar-item">
              <button
                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
                title={!isExpanded ? item.label : ''}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {isExpanded && (
                  <div className="sidebar-content">
                    <span className="sidebar-label">{item.label}</span>
                    <span className="sidebar-description">{item.description}</span>
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Footer da sidebar */}
        {isExpanded && (
          <div className="sidebar-footer">
            <div className="footer-info">
              <span className="footer-icon">🎮</span>
              <div className="footer-text">
                <span className="footer-title">League of Legends</span>
                <span className="footer-subtitle">Consulta de Dados</span>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Sidebar;