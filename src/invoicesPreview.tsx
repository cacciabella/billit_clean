import './InvoicePreview.css';
import React, { useRef } from "react";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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

const handleDownload = (invoice: Invoice) => {
  // Crea un nuovo documento PDF
  const doc = new jsPDF();
  
  // Calcoli
  const imponibile = invoice.quantità * invoice.prezzo;
  const importoIva = imponibile * (invoice.iva / 100);
  const totale = imponibile + importoIva;
  
  // Imposta font
  doc.setFont("Helvetica");
  
  // Intestazione
  doc.setFontSize(18);
  doc.setFont("Helvetica", "bold");
  doc.text("FATTURA", 14, 20);
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.text(`Numero: ${invoice.nfattura}`, 14, 30);
  doc.text(`Data: ${invoice.dataf}`, 14, 35);
  
  // Stato fattura (con colore)
  const statoText = invoice.state === 'paid' ? 'PAGATA' : 'NON PAGATA';
  doc.setFillColor(invoice.state === 'paid' ? 230 : 255, invoice.state === 'paid' ? 250 : 230, invoice.state === 'paid' ? 230 : 230);
  doc.setTextColor(invoice.state === 'paid' ? 0 : 200, invoice.state === 'paid' ? 150 : 0, 0);
  doc.roundedRect(150, 15, 45, 10, 5, 5, 'F');
  doc.text(statoText, 152, 22);
  doc.setTextColor(0, 0, 0); // Ripristina il colore del testo
  
  // Dati venditore e cliente
  const venditoreY = 50;
  doc.setFontSize(12);
  doc.setFont("Helvetica", "bold");
  doc.text("Venditore", 14, venditoreY);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text(invoice.venditore, 14, venditoreY + 8);
  doc.setFont("Helvetica", "normal");
  doc.text(invoice.indirizzoV, 14, venditoreY + 14);
  doc.text(`P.IVA: ${invoice.pivaV}`, 14, venditoreY + 20);
  
  doc.setFontSize(12);
  doc.setFont("Helvetica", "bold");
  doc.text("Cliente", 110, venditoreY);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text(invoice.cliente, 110, venditoreY + 8);
  doc.setFont("Helvetica", "normal");
  doc.text(invoice.indirizzoC, 110, venditoreY + 14);
  doc.text(`P.IVA: ${invoice.pivaC}`, 110, venditoreY + 20);
  
  // Tabella articoli
  const tableStartY = 85;
  autoTable(doc, {
    startY: tableStartY,
    head: [["Descrizione", "Quantità", "Prezzo Unitario", "Imponibile"]],
    body: [[
      invoice.descrizione,
      invoice.quantità.toString(),
      `€ ${invoice.prezzo.toFixed(2)}`,
      `€ ${imponibile.toFixed(2)}`
    ]],
    theme: "grid",
    headStyles: { 
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    styles: { 
      fontSize: 10,
      cellPadding: 5
    }
  });
  
  // Riepilogo totali
  const finalY = (doc).lastAutoTable.finalY + 10;
  
  // Stile per i totali
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  
  // Tabella riepilogo
  const totalsWidth = 70;
  const totalsX = doc.internal.pageSize.width - totalsWidth - 14;
  
  doc.text("Imponibile:", totalsX, finalY);
  doc.text(`€ ${imponibile.toFixed(2)}`, totalsX + totalsWidth - 20, finalY, { align: "right" });
  
  doc.line(totalsX, finalY + 3, totalsX + totalsWidth, finalY + 3);
  
  doc.text(`IVA (${invoice.iva}%):`, totalsX, finalY + 10);
  doc.text(`€ ${importoIva.toFixed(2)}`, totalsX + totalsWidth - 20, finalY + 10, { align: "right" });
  
  doc.line(totalsX, finalY + 13, totalsX + totalsWidth, finalY + 13);
  
  doc.setFont("Helvetica", "bold");
  doc.text("Totale:", totalsX, finalY + 20);
  doc.text(`€ ${totale.toFixed(2)}`, totalsX + totalsWidth - 20, finalY + 20, { align: "right" });
  
  // Note (se presenti)
  if (invoice.note) {
    const noteY = finalY + 35;
    doc.setFillColor(245, 245, 245);
    doc.rect(14, noteY - 5, doc.internal.pageSize.width - 28, 20, 'F');
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Note", 18, noteY + 2);
    doc.setFont("Helvetica", "normal");
    doc.text(invoice.note, 18, noteY + 10);
  }
  
  // Footer
  const footerY = doc.internal.pageSize.height - 20;
  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  doc.text("Grazie per la fiducia accordataci.", doc.internal.pageSize.width / 2, footerY, { align: "center" });
  
  // Salva il PDF
  doc.save(`Fattura-${invoice.nfattura}.pdf`);
};

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
        <button
          className="download-btnn"
          onClick={ () => handleDownload(invoice)}

        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}



export default InvoicePreview;