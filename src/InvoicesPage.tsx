// src/InvoicesPage.tsx
import { useState } from "react";
import Invoices from "./invoicesForm";
import SideBar from "./sidebar";
import InvoicePreview from "./invoicesPreview";
import { Invoice } from "./invoices";

export default function InvoicesPage() {
  const [invoice, setInvoice] = useState<Invoice>({
    nfattura: "001/2025",
    dataf: new Date().toISOString().split("T")[0],
    venditore: "", indirizzoV: "", pivaV: "",
    cliente: "", indirizzoC: "", pivaC: "",
    descrizione: "", quantità: 1, prezzo: 0,
    iva: 0,
    note: "",
    state: "unpaid",
  });

  const handleFormSubmit = (data: Invoice) => {
    setInvoice(data);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SideBar />
      <div className="flex-1">
        <Invoices onSubmit={handleFormSubmit} />
      </div>
      <div className="md:w-1/4 p-4">
        <InvoicePreview   invoice={invoice} />
      </div>
    </div>
  );
}
