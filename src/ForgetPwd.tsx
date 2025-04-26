import React, { useState } from "react";
import { auth } from '../firebase/firebaseConfig';
import { sendPasswordResetEmail } from "firebase/auth";

import { FiLock } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa6";



import './Login.css'


export default function LoginForm(){

    const [email,setEmail]= useState("")
 
    const [msg, setMsg] = useState("");



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
        await sendPasswordResetEmail(auth, email);
            setMsg("Recupero Password effettuato con successo");
          // Reindirizza alla dashboard o cambia stato
        } catch (error: unknown) {
          if (error instanceof Error) {
            setMsg(error.message);  // Imposta il messaggio di errore
          } else {
            setMsg("Si è verificato un errore imprevisto.");
          }
        }
      };
    return(
      <div className="container">

      <div className="leftside">
        <div className="left-text">
        
        <h1>Benvenuto  nel</h1> <h1  className="purple-text">Tuo Portale</h1>
        <p className="p-intestazione">Recupera la tue credenziali per gestire le tue attività in modo</p>
        <p  className="p-intestazione"> sicuro ed efficiente.</p>
        </div>
        <div className="securety-access">
        <div className="accesso-wrapper">
<div className="background-gradient"></div>

<div className="accesso-content">
<div className="icon-container">
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    className="icon-lock"
  >
   <path 
strokeLinecap="round" 
strokeLinejoin="round" 
strokeWidth="1.5" 
d="M12 15v5m-3-3h6M7 10a5 5 0 015-5v0a5 5 0 015 5v2H7v-2zm2-4h6"
/>

  </svg>
</div>
<h3 className="accesso-titolo">Accesso Sicuro</h3>
<p className="accesso-testo">Connessione protetta con crittografia avanzata</p>
</div>
</div>

        </div>
      </div>
      <div className="LoginDiv">
          <div className="icon-wrapper">
    <div className="outer-circle">
      <div className="inner-circle">
           <FiLock className="icon-lock" /></div></div></div>
        <form onSubmit={handleSubmit}>
       
        <div className="intestazione">
            <h2>Recupera la Password</h2>
           <p>Inserisci la Mail per Proseguire</p>
           </div>
           <div className="formData">
            
            <label  htmlFor="Email">Email</label>
            <div className="input-icon-wrapper1">
           <FaRegUser/>
</div>

            <input type="email" name="email" autoComplete="email" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} required/>
           </div>
            
            
            <button  className="submit" type="submit">Recupera le Credenziali</button>
            <p>{msg}</p>
         
        </form>
        </div>
      </div>
    );
}