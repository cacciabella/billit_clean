import React, { useState } from "react";
import { auth } from '../firebase/firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { FiLock } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa6";
import { Eye, EyeOff } from "lucide-react";
import './Login.css';
import { useMediaQuery } from 'react-responsive';  // Importa react-responsive

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Usa useMediaQuery per rilevare la larghezza dello schermo
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user.emailVerified) {
        setMsg("Accesso effettuato con successo");
        navigate('./dashboard');
      } else {
        setMsg("Email non verificata. Controlla la casella di posta");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMsg(error.message);  // Imposta il messaggio di errore
      } else {
        setMsg("Si è verificato un errore imprevisto.");
      }
    }
  };

  return (
    <div className={`container ${isMobile ? 'mobile' : ''}`}>
      <div className={`leftside ${isMobile ? 'mobile' : ''}`}>
        <div className="left-text">
          <h1>Benvenuto nel</h1> <h1 className="purple-text">Tuo Portale</h1>
          <p className="p-intestazione">Accedi al tuo account per gestire le tue attività in modo</p>
          <p className="p-intestazione">sicuro ed efficiente.</p>
        </div>
        {!isMobile && (
          <div className="securety-access">
            <div className="accesso-wrapper">
              <div className="background-gradient"></div>
              <div className="accesso-content">
                <div className="icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="icon-lock">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v5m-3-3h6M7 10a5 5 0 015-5v0a5 5 0 015 5v2H7v-2zm2-4h6"/>
                  </svg>
                </div>
                <h3 className="accesso-titolo">Accesso Sicuro</h3>
                <p className="accesso-testo">Connessione protetta con crittografia avanzata</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="LoginDiv">
        <div className="icon-wrapper">
          <div className="outer-circle">
            <div className="inner-circle">
              <FiLock className="icon-lock" />
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="intestazione">
            <h2>Accedi al tuo account</h2>
            <p>Inserisci le tue credenziali per accedere</p>
          </div>
          <div className="formData">
            <label htmlFor="Email">Email</label>
            <div className="input-icon-wrapper2">
              <FaRegUser />
            </div>
            <input type="email" name="email" autoComplete="email" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="formData">
            <label htmlFor="pwd">Password</label>
            <Link className="link-costum" to="/ForgetPwd">Password Dimenticata?</Link>
            <div className="input-icon-pwd2">
              <FiLock />
            </div>
            <input type={showPassword ? "text" : "password"} name="pwd" onChange={(e) => setPassword(e.target.value)} required />
            <div className="toggle-eye" onClick={() => setShowPassword(prev => !prev)}>
              {showPassword ? (
                <EyeOff className="eye-icon" />
              ) : (
                <Eye className="eye-icon" />
              )}
            </div>
          </div>

          <button className="submit" type="submit">Accedi</button>
          <p>{msg}</p>
          <div className="register">
            <p>Non hai un account?</p><Link className="link-costum" to="/Register">Registrati</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
