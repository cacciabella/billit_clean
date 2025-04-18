import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './sidebar.css';

// Definiamo un'interfaccia per tipizzare gli elementi di navigazione
interface NavItem {
  name: string;
  path: string; // Rendi path obbligatorio per gli elementi attivi
  icon: React.ReactNode;
}

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', // Corretto il percorso (era '/Dashboard', ma è meglio usare minuscolo per coerenza)
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22L12 3Z" />
        </svg>
      ),
    },
    // { 
    //   name: 'Transactions', 
    //   icon: (
    //     <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    //       <path d="M3.5,18.5L9.5,12.5L13.5,16.5L22,8L23.25,9.25L13.5,19L9.5,15L4.75,19.75L3.5,18.5M6,6H15V7.5H6V6M6,3H18V4.5H6V3M6,10.5H12V9H6V10.5Z" />
    //     </svg>
    //   )
    // },
    { 
      name: 'Invoices', 
      path: '/invoices',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
        </svg>
      ),
    },
    // { 
    //   name: 'My Wallets', 
    //   icon: (
    //     <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    //       <path d="M21,18V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18M12,16H22V8H12M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z" />
    //     </svg>
    //   )
    // },
    { 
      name: 'Settings', 
      path: '/settings',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
        </svg>
      ),
    },
  ];
  
  const footerItems: NavItem[] = [
    // { 
    //   name: 'Help', 
    //   icon: (
    //     <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    //       <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" />
    //     </svg>
    //   )
    // },
    { 
      name: 'Log-in', 
      path: '/login',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" />
        </svg>
      ),
    },
  ];
  

  const handleNavClick = (path: string) => {
    console.log(`Navigating to: ${path}`);
    navigate(path); // Usa navigate invece di Link
  };
  return (
    <div className="sidebar-container">
      <div className="sidebar">
        {/* Logo */}
        <div className="logo-container">
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
  );
};

export default SideBar;