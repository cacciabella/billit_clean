"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { auth } from '../firebase/firebaseConfig';
import { zodResolver } from "@hookform/resolvers/zod";
import { Invoice } from "./invoices";
import { IoAddOutline } from "react-icons/io5";
import { useState } from "react";
import './invoiceForm.css';
import { Link } from "react-router-dom";

const schema = z.object({
  nfattura: z.string().min(1, "Invoice number is required"),
  dataf: z.string().min(1, "Date is required"),

    venditore: z.string().min(1, "Seller name is required"),
    indirizzoV: z.string(),
    pivaV: z.string(),
  

    cliente: z.string().min(1, "Client name is required"),
    indirizzoC: z.string(),
    pivaC: z.string(),
 
  
    
      descrizione: z.string().min(1, "Description is required"),
      quantità: z.number().min(1, "Quantity must be greater than 0"),
      prezzo: z.number().min(0, "Price cannot be negative"),
  iva: z.number().min(0, "Tax rate cannot be negative"),
  note: z.string().optional(),
  state: z.enum(["paid", "unpaid"]),
});




type InvoiceFormData = z.infer<typeof schema>;

interface InvoiceFormProps {
  onSubmit: (data: Invoice) => void;
}

export default function InvoiceForm({ onSubmit }: InvoiceFormProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

 



//questa costante fa una richiewsta con il metodo fetch al backend spring  e fa una specie di chiamata ajax per inseirr i dati nel DB
const handleFormSubmit = async (data: InvoiceFormData, event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault(); // Previene il comportamento predefinito del form

  try {
    // Verifica se l'utente è autenticato
    const user = auth.currentUser;

    if (!user) {
      console.error("Errore: l'utente non è autenticato.");
      return;
    }

    // 🔥 Qui recuperi il token di autenticazione dell'utente
    const token = await user.getIdToken();

    // Aggiungi l'UID dell'utente ai dati della fattura
    const invoiceDataWithUserId = {
      ...data,
      userId: user.uid, // Associa l'UID dell'utente alla fattura
    };

    // Funzione React per gestioni interne (tipo inviare dati al parent component se necessario)
    onSubmit(invoiceDataWithUserId);

    // Chiamata al backend con il token
    const response = await fetch("https://billitclean-production.up.railway.app/invoices/NewInvoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // ✔️ Adesso `token` esiste correttamente
      },
      body: JSON.stringify(invoiceDataWithUserId),
    });

    if (response.ok) {
      console.log("Fattura salvata con successo");
      setIsFormVisible(false); // Chiudi il form
      reset(); // Resetta i campi del form
    } else {
      console.error("Errore nel salvataggio:", await response.text());
    }
  } catch (error) {
    console.error("Errore nella richiesta:", error);
  }
};

  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Aggiungi reset per pulire il form
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nfattura: "001/2025",
      dataf: new Date().toISOString().split("T")[0],
       venditore: "",
        indirizzoV: "",
         pivaV: "" ,

       cliente: "", indirizzoC: "", 
       pivaC: "" ,

       descrizione: "",
        quantità: 1,
        prezzo: 0 ,
      iva: 0,
      note: "",
      state: "unpaid",
    },
  });

  const toggleFormVisibility = () => {
    const user = auth.currentUser;
  if (!user) {
    setShowLoginPopup(true); // Mostra popup se non loggato
    return;
  }
    setIsFormVisible((prev) => !prev);
    if (isFormVisible) {
      reset(); // Resetta il form quando si chiude
    }
  };

  

  return (
    <div>
      
      <button className="AddInvoices" onClick={toggleFormVisibility}>
        <IoAddOutline />
      </button>

      {isFormVisible && (
        <div className="popup-overlay">
          

          <div className={`popup-content ${isFormVisible ? 'popup-open' : 'popup-closed'}`}>
            <button className="close-button" onClick={toggleFormVisibility}>
              Chiudi
            </button>
            <div className="invoice-form-container">
              <h2 className="form-title">Nuova Fattura</h2>
              <form onSubmit={handleSubmit((data, event) => handleFormSubmit(data, event as React.FormEvent<HTMLFormElement>))} className="invoice-form">
                <div className="form-row">
                  <div className="form-column">
                    <label>Numero Fattura</label>
                    <input {...register("nfattura")} placeholder="es. 001/2025" />
                    {errors.nfattura && <p className="error-message">{errors.nfattura.message}</p>}
                  </div>
                  <div className="form-column">
                    <label>Data</label>
                    <input {...register("dataf")} type="date" />
                    {errors.dataf && <p className="error-message">{errors.dataf.message}</p>}
                  </div>
                  <div className="form-column">
                    <label>Stato</label>
                    <select {...register("state")}>
                      <option value="unpaid">Non Pagata</option>
                      <option value="paid">Pagata</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-column">
                    <label>Venditore</label>
                    <input {...register("venditore")} placeholder="Nome Azienda" />
                    {errors.venditore && <p className="error-message">{errors.venditore.message}</p>}
                  </div>
                  <div className="form-column">
                    <label>Indirizzo Venditore</label>
                    <input {...register("indirizzoV")} placeholder="Via, Città, CAP" />
                  </div>
                  <div className="form-column">
                    <label>P.IVA Venditore</label>
                    <input {...register("pivaV")} placeholder="IT12345678901" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-column">
                    <label>Cliente</label>
                    <input {...register("cliente")} placeholder="Nome Cliente" />
                    {errors.cliente && <p className="error-message">{errors.cliente.message}</p>}
                  </div>
                  <div className="form-column">
                    <label>Indirizzo Cliente</label>
                    <input {...register("indirizzoC")} placeholder="Via, Città, CAP" />
                  </div>
                  <div className="form-column">
                    <label>P.IVA Cliente</label>
                    <input {...register("pivaC")} placeholder="IT12345678901" />
                  </div>
                </div>

                <div className="form-row items-row">
                  <div className="form-column item-description">
                    <label>Descrizione</label>
                    <input
                      {...register("descrizione")}
                      placeholder="Descrizione articolo/servizio"
                    />
                    {errors.descrizione && (
                      <p className="error-message">{errors.descrizione.message}</p>
                    )}
                  </div>
                  <div className="form-column item-quantity">
                    <label>Quantità</label>
                    <input
                      {...register("quantità", { valueAsNumber: true })}
                      type="number"
                      placeholder="1"
                    />
                    {errors.quantità && (
                      <p className="error-message">{errors.quantità.message}</p>
                    )}
                  </div>
                  <div className="form-column item-price">
                    <label>Prezzo (€)</label>
                    <input
                      {...register("prezzo", { valueAsNumber: true })}
                      type="number"
                      placeholder="0.00"
                    />
                    {errors.prezzo && (
                      <p className="error-message">{errors.prezzo.message}</p>
                    )}
                  </div>
                  <div className="form-column item-tax">
                    <label>IVA (%)</label>
                    <input
                      {...register("iva", { valueAsNumber: true })}
                      type="number"
                      placeholder="22"
                    />
                    {errors.iva && <p className="error-message">{errors.iva.message}</p>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-column full-width">
                    <label>Note</label>
                    <textarea {...register("note")} placeholder="Note aggiuntive per la fattura..." />
                  </div>
                </div>

                <div className="form-row submit-row">
                  <button type="submit" className="submit-button">
                    Genera Fattura
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )
      }

{showLoginPopup && (
  <div className="popup-warm">
    <div className="popup-contentWarm">
      
      <p>⚠️ Devi accedere per poter creare una fattura.</p>
      <Link className="Log_foruse" to="/Login">clicca qui per accedere!</Link>
      <button onClick={() => setShowLoginPopup(false)}>Chiudi</button>
    </div>
  </div>
)}

    </div>
  );
}