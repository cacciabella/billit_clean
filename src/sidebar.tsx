import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './sidebar.css';

// Definiamo un'interfaccia per tipizzare gli elementi di navigazione
interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Chiudi il menu quando cambia la rotta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Chiudi il menu se la finestra viene ridimensionata a uno stato più grande
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const navItems: NavItem[] = [
    { 
      name: 'Dashboard', 
      path: '/dashboard',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22L12 3Z" />
        </svg>
      ),
    },
    { 
      name: 'Invoices', 
      path: '/invoices',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
        </svg>
      ),
    },
  ];
  
  const footerItems: NavItem[] = [
    { 
      name: 'Log-in', 
      path: '/Login',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" />
        </svg>
      ),
    },
  ];
  
  const handleNavClick = (path: string) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Navbar superiore mobile visibile solo su schermi piccoli */}
      <div className="mobile-top-navbar">
        <div className="mobile-logo-container">
          <div className="logo-icon">
            <span className="logo-text">B</span>
          </div>
          <div className="logo-title">Billit</div>
        </div>
        <button 
          className="navbar-toggler" 
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      <div className={`sidebar-container ${isMobileMenuOpen ? 'sidebar-open' : ''}`}>
        {/* Overlay per sfondo scuro quando il menu è aperto */}
        <div className="sidebar-overlay" onClick={toggleMobileMenu}></div>

        <div className="sidebar">
          {/* Logo - visibile solo su desktop */}
          <div className="logo-container desktop-only">
            <div className="logo-icon">
              <span className="logo-text">B</span>
            </div>
            <div className="logo-title">Billit</div>
          </div>
          
          {/* Main Navigation */}
          <div className="nav-main">
            {navItems.map((item) => (
              <div
                key={item.name}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path)}
                style={{ cursor: 'pointer' }}
                aria-label={`Naviga a ${item.path}`}
              >
                <div className="nav-icon">{item.icon}</div>
                <div className="nav-text">{item.name}</div>
              </div>
            ))}
          </div>

          {/* Footer Navigation */}
          <div className="nav-footer">
            {footerItems.map((item) => (
              <div
                key={item.name}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path)}
                style={{ cursor: 'pointer' }}
                aria-label={`Naviga a ${item.name}`}
              >
                <div className="nav-icon">{item.icon}</div>
                <div className="nav-text">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;