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
  const imponibile = invoice.quantità * invoice.prezzo;
  const importoIva = imponibile * (invoice.iva / 100);
  const totale = imponibile + importoIva;
  const invoiceContentRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={invoiceContentRef} id='invoice-content'>
      <div className="invoice-container">
        {/* Intestazione fattura */}
        <div className="invoice-header">
          <div className="invoice-title-section">
            <h1 className="invoice-title">FATTURA</h1>
            <div className="invoice-info">
              <p><span className="label">Numero:</span> {invoice.nfattura}</p>
              <p><span className="label">Data:</span> {invoice.dataf}</p>
            </div>
          </div>
          <div className="invoice-status">
            <div className={`status-badge ${invoice.state === 'paid' ? 'status-paid' : 'status-unpaid'}`}>
              {invoice.state === 'paid' ? 'PAGATA' : 'NON PAGATA'}
            </div>
          </div>
        </div>

        {/* Sezione Venditore e Cliente */}
        <div className="entity-section">
          <div className="seller-section">
            <h2 className="entity-title">Venditore</h2>
            <p className="entity-name">{invoice.venditore}</p>
            <p>{invoice.indirizzoV}</p>
            <p>P.IVA: {invoice.pivaV}</p>
          </div>
          
          <div className="client-section">
            <h2 className="entity-title">Cliente</h2>
            <p className="entity-name">{invoice.cliente}</p>
            <p>{invoice.indirizzoC}</p>
            <p>P.IVA: {invoice.pivaC}</p>
          </div>
        </div>

        {/* Tabella articoli */}
        <div className="items-table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Descrizione</th>
                <th>Quantità</th>
                <th>Prezzo Unitario</th>
                <th>Imponibile</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{invoice.descrizione}</td>
                <td>{invoice.quantità}</td>
                <td>{invoice.prezzo.toFixed(2)} €</td>
                <td>{imponibile.toFixed(2)} €</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Riepilogo totali */}
        <div className="totals-section">
          <div className="totals-row">
            <span className="totals-label">Imponibile:</span>
            <span className="totals-value">{imponibile.toFixed(2)} €</span>
          </div>
          <div className="totals-row">
            <span className="totals-label">IVA ({invoice.iva}%):</span>
            <span className="totals-value">{importoIva.toFixed(2)} €</span>
          </div>
          <div className="totals-row total-final">
            <span>Totale:</span>
            <span>{totale.toFixed(2)} €</span>
          </div>
        </div>

        {/* Note */}
        {invoice.note && (
          <div className="note-section">
            <h4>Note</h4>
            <p>{invoice.note}</p>
          </div>
        )}

        {/* Footer */}
        <div className="invoice-footer">
          <p>Grazie per la fiducia accordataci.</p>
        </div>
      </div>
    </div>
  );
}



export default InvoicePreview;