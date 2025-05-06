import React, { useEffect, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import './Dashboard.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { toast } from 'react-hot-toast';

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

// Define the Invoice interface
interface Invoice {
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
  state: "paid" | "unpaid";
}

interface RawInvoice {
  id?: number;
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
  state: "paid" | "unpaid";
}

const Dashboard: React.FC = () => {
  const [invoice, setInvoice] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState<Partial<Invoice>>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token mancante');
        setLoading(false);
        return;
      }
  
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch('/invoices/InvoiceList', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
  
      if (response.ok) {
        const text = await response.text();
  
        if (!text || text.trim() === '') {
          console.warn("Risposta vuota dal server.");
          setInvoice([]); // mostra tabella vuota
          return;
        }
  
        try {
          const data: RawInvoice[] = JSON.parse(text);
  
          // Verifica che data sia un array prima di usare map
          if (!Array.isArray(data)) {
            console.error("La risposta non è un array:", data);
            setInvoice([]);
            setError("Formato dati non valido");
            return;
          }
  
          const transformedData = data.map((item: RawInvoice) => ({
            Id: item.id || item.Id || Math.random(),
            nfattura: item.nfattura,
            cliente: item.cliente,
            indirizzoC: item.indirizzoC,
            pivaC: item.pivaC,
            descrizione: item.descrizione,
            prezzo: item.prezzo,
            state: item.state,
            dataf: item.dataf,
            venditore: item.venditore,
            indirizzoV: item.indirizzoV,
            quantità: item.quantità,
            pivaV: item.pivaV,
            iva: item.iva,
          }));
  
          setInvoice(transformedData);
        } catch (err) {
          console.error("Errore nel parsing della risposta JSON:", err, "Contenuto:", text);
          setInvoice([]);
          setError("Errore nel parsing dei dati");
        }
      } else {
        // Gestisci specificamente l'errore 508
        if (response.status === 508) {
          console.error('Errore 508: Loop Detected nella richiesta API');
          setError('Errore di loop rilevato dal server. Contatta l\'amministratore.');
        } else {
          const errorText = await response.text();
          console.error(`Errore ${response.status} nel recupero:`, errorText);
          setError(`Errore ${response.status}: ${response.statusText}`);
        }
        setInvoice([]);
      }
    } catch (error) {
      // Controlla se è un errore di timeout
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.error('Timeout nella richiesta al server');
        setError('Timeout nella richiesta. Il server non risponde.');
      } else {
        console.error('Errore nella richiesta:', error);
        setError('Errore nella connessione al server');
      }
      setInvoice([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await fetchInvoices();
      }
    };
    
    loadData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdate = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setFormData(invoice);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      const response = await fetch(`https://billit-clean.onrender.com/invoices/deleteInvoices/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setInvoice(invoice.filter((inv) => inv.Id !== id));
        alert('Invoice deleted successfully');
      } else {
        alert('Failed to delete invoice');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Error deleting invoice');
    }
  };

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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice?.Id) return;

    try {
      const response = await fetch(`https://billit-clean.onrender.com/invoices/UpdInvoices/${selectedInvoice.Id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setInvoice(
          invoice.map((inv) =>
            inv.Id === selectedInvoice.Id ? { ...inv, ...formData } : inv
          )
        );
        setIsModalOpen(false);
        setSelectedInvoice(null);
       
        toast.success('Invoice updated successfully!', {
          duration: 1000,
          icon: '✅',
          style: {
            fontSize: '18px',
            padding: '20px',
            minWidth: '300px',
          },
        });
      } else {
        alert('Failed to update invoice');
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert('Error updating invoice');
    }
  };

  // Define the columns for React-Table
  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'Update',
      header: 'UPDATE',
      cell: ({ row }) => (
        <button
          className="edit-btn"
          onClick={() => handleUpdate(row.original)}
          disabled={invoice.length === 0}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'nfattura',
      header: 'NFATURA',
      enableSorting: true,
    },
    {
      accessorKey: 'cliente',
      header: 'CLIENTE',
      enableSorting: true,
      enableGlobalFilter: true,
    },
    {
      accessorKey: 'descrizione',
      header: 'DESCRIZIONE',
      enableSorting: true,
      enableGlobalFilter: true,
    },
    {
      accessorKey: 'prezzo',
      header: 'PREZZO',
      cell: ({ row }) => {
        return `€${row.original.prezzo}`;
      },
      enableSorting: true,
    },
    {
      accessorKey: 'state',
      header: 'STATO',
      cell: ({ row }) => {
        return (
          <div className={`status-badge ${row.original.state}`}>
            {row.original.state === 'paid' ? 'paid' : 'unpaid'}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'Delete',
      header: 'DELETE',
      cell: ({ row }) => (
        <button
          className="delete-btn"
          onClick={() => handleDelete(row.original.Id!)}
          disabled={invoice.length === 0}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'Download',
      header: 'DOWNLOAD',
      cell: ({ row }) => (
        <button
          className="download-btn"
          onClick={() => handleDownload(row.original)}
          disabled={invoice.length === 0}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ),
      enableSorting: false,
    },
  ];

  // Initialize React-Table
  const table = useReactTable({
    data: invoice,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: {
        pageSize: 10,
        pageIndex: 0
      },
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (loading) {
    return <p className="status-message">Loading...</p>;
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  // Sempre preparare dati per il grafico, anche quando l'array è vuoto
  const paidCount = invoice.filter(inv => inv.state === 'paid').length;
  const unpaidCount = invoice.filter(inv => inv.state === 'unpaid').length;
  const paidPercentage = invoice.length > 0 ? Math.round((paidCount / invoice.length) * 100) : 0;
  const unpaidPercentage = invoice.length > 0 ? Math.round((unpaidCount / invoice.length) * 100) : 0;

  // Creare dati per il grafico anche quando non ci sono fatture
  const data = [
    { name: 'Paid', value: paidCount || 0 },
    { name: 'Unpaid', value: unpaidCount || 0 },
  ];
  
  const COLORS = ['#9367FD', '#F44336'];

  return (
    <div className="dashboard-container">
      <div className="stat-card">
        <h2>Stato Fatture</h2>
        <div className="chart-container">
          <PieChart width={250} height={250}>
            {/* Nel caso non ci siano dati, mostriamo comunque il grafico vuoto */}
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              // Se non ci sono dati, possiamo aggiungere un padding più ampio
              minAngle={invoice.length === 0 ? 0 : 5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value) => (value === "Paid" ? "Pagate" : "Non Pagate")}
            />
            <Tooltip 
              formatter={(value, name) => {
                return [`${value} fatture`, name === "Paid" ? "Pagate" : "Non Pagate"];
              }}
            />
          </PieChart>
          <div className="stats-text">
            <div className="stat-item">
              <span className="stat-color" style={{ backgroundColor: COLORS[0] }}></span>
              <span className="stat-label">Pagate: {paidPercentage}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-color" style={{ backgroundColor: COLORS[1] }}></span>
              <span className="stat-label">Non Pagate: {unpaidPercentage}%</span>
            </div>
          </div>
          {invoice.length === 0 && (
            <div className="no-data-message">
              Nessuna fattura presente
            </div>
          )}
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="search-container">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="search-icon">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search invoices..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="pagination">
            <span className="pagination-info">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </span>
            <div className="pagination-controls">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="pagination-btn"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <table className="table-section">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={header.column.getCanSort() ? 'sortable' : ''}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === 'asc' ? (
                        <span className="sort-icon">↑</span>
                      ) : (
                        <span className="sort-icon">↓</span>
                      )
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="invoice-row">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="no-data-cell">
                  Nessuna fattura trovata
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {isModalOpen && (
        <div className="popup-overlay">
          <div className="modal">
            <h2 className="form-title">Update Invoice</h2>
            <form onSubmit={handleUpdateSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nfattura">Numero Fattura</label>
                  <input
                    id="nfattura"
                    type="text"
                    name="nfattura"
                    value={formData.nfattura || ''}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cliente">Cliente</label>
                  <input
                    id="cliente"
                    type="text"
                    name="cliente"
                    value={formData.cliente || ''}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="indirizzoC">Indirizzo Cliente</label>
                  <input
                    id="indirizzoC"
                    type="text"
                    name="indirizzoC"
                    value={formData.indirizzoC || ''}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pivaC">Partita IVA Cliente</label>
                  <input
                    id="pivaC"
                    type="text"
                    name="pivaC"
                    value={formData.pivaC || ''}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="descrizione">Descrizione</label>
                  <input
                    id="descrizione"
                    type="text"
                    name="descrizione"
                    value={formData.descrizione || ''}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prezzo">Prezzo</label>
                  <input
                    id="prezzo"
                    type="number"
                    name="prezzo"
                    value={formData.prezzo || 0}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">Stato</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state || 'unpaid'}
                    onChange={handleFormChange}
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="modal-btn save">
                  Save
                </button>
                <button
                  type="button"
                  className="modal-btn cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;