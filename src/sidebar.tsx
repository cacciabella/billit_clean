import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './sidebar.css';
import { signOut } from "firebase/auth";

import { auth } from "../firebase/firebaseConfig"; // Assicurati che il path sia corretto

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);




  useEffect(() => {
    // Verifica se l'utente è loggato controllando il token
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email'); // Puoi salvare l'email dopo il login
    if (token && email) {
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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

  const handleNavClick = (path: string) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  
  const handleLogout = async () => {
    try {
      await signOut(auth); // Logout da Firebase
      localStorage.removeItem("token");
      localStorage.removeItem("email");
  
      navigate("/dashboard"); // Reindirizza alla pagina di login
      window.location.reload(); // Forza il refresh per aggiornare l’interfaccia (opzionale ma utile in certi casi)
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
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
        <div className="sidebar-overlay" onClick={toggleMobileMenu}></div>

        <div className="sidebar">
          <div className="logo-container desktop-only">
            <div className="logo-icon">
              <span className="logo-text">B</span>
            </div>
            <div className="logo-title">Billit</div>
          </div>

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

          {/* Nuova sezione per l'account dell'utente */}
          {userEmail ? (
  <div className="user-info">
    <div
      className="user-email"
      onClick={() => setShowDropdown(prev => !prev)}
    >
      {userEmail}
    </div>
    {showDropdown && (
      <div className="nav-options dropdown-options">
        <button onClick={handleLogout}>Log-out</button>
      </div>
    )}
  </div>
) : (
  <div className="nav-footer">
    <div
      className={`nav-item ${location.pathname === '/login' ? 'active' : ''}`}
      onClick={() => navigate('/login')}
      style={{ cursor: 'pointer' }}
      aria-label="Naviga alla pagina di login"
    >
      <div className="nav-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" />
        </svg>
      </div>
      <div className="nav-text">Log-in</div>
    </div>
  </div>
)}

        </div>
      </div>
    </>
  );
};

export default SideBar;
