

import './InvoicePreview.css';
import React, { useRef } from "react";

export interface Invoice {
  Id?: number;
  nfattura: string;
  dataf: string;
  venditore: string;
  indirizzoV: string;
  pivaV: string;
  cliente: string;
  indirizzoC: string;
  pivaC: string;
  descrizione: string;
  quantità: number;
  prezzo: number;
  iva: number;
  note?: string;
  state: 'paid' | 'unpaid';
}

interface InvoicePreviewProps {
  invoice: Invoice;
  
}

function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const subtotal = invoice.quantità * invoice.prezzo;
  const tax = subtotal * (invoice.iva / 100);
  const total = subtotal + tax;
  const invoiceContentRef = useRef<HTMLDivElement | null>(null);
  return (
    <div ref={invoiceContentRef} id='invoice-content'>
    <div className="invoice-container">
      <div className="invoice-header">
        <h1 className="invoice-title">Fattura #{invoice.nfattura}</h1>
        <div className="invoice-date">Data: {invoice.dataf}</div>
      </div>

      <div className="seller-section">
        <h2 className="seller-title">Venditore</h2>
        <p className="seller-name">{invoice.venditore}</p>
        <p>{invoice.indirizzoV}</p>
        <p>P.IVA: {invoice.pivaV}</p>
      </div>

      <div className="client-section">
        <h2 className="client-title">Cliente</h2>
        <p className="client-name">{invoice.cliente}</p>
        <p>{invoice.indirizzoC}</p>
        <p>P.IVA: {invoice.pivaC}</p>
      </div>

      <table className="items-table">
        <thead>
          <tr>
            <th>Descrizione</th>
            <th>Quantità</th>
            <th>Prezzo</th>
            <th>Totale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{invoice.descrizione}</td>
            <td>{invoice.quantità}</td>
            <td>{invoice.prezzo}€</td>
            <td>{subtotal}€</td>
          </tr>
        </tbody>
      </table>

      <div className="totals-section">
        <div className="totals-row">
          <span className="totals-label">Subtotale:</span>
          <span className="totals-value">{subtotal.toFixed(2)}€</span>
        </div>
        <div className="totals-row">
          <span className="totals-label">IVA ({invoice.iva}%):</span>
          <span className="totals-value">{tax.toFixed(2)}€</span>
        </div>
        <div className="totals-row total-final">
          <span>Totale:</span>
          <span>{total.toFixed(2)}€</span>
        </div>
      </div>

      {invoice.note && (
        <div className="note-section">
          <h4>Note:</h4>
          <p>{invoice.note}</p>
        </div>
      )}

      <div className="status-section">
        <span className={`status-badge ${invoice.state === 'paid' ? 'status-paid' : 'status-unpaid'}`}>
          {invoice.state === 'paid' ? 'Pagata' : 'Non Pagata'}
        </span>
      </div>
    </div>
    </div>
  );
}

export default InvoicePreview;
