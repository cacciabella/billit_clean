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
import autoTable from "jspdf-autotable";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';


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
   venditore: string; indirizzoV: string; pivaV: string ;
  cliente: string; indirizzoC: string; pivaC: string ;
   descrizione: string;
    quantità: number; 
    prezzo: number ;
  iva: number;
  note?: string;
  state: "paid" | "unpaid";
}

interface RawInvoice {
  id?: number;
  Id?: number;
  nfattura: string;
  dataf: string;
   venditore: string; indirizzoV: string; pivaV: string ;
  cliente: string; indirizzoC: string; pivaC: string ;
   descrizione: string;
    quantità: number; 
    prezzo: number ;
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
 

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/invoices/InvoiceList', {
        method: 'GET',
      });

      if (response.ok) {
        console.log('Fattura recuperata con successo');
        const data: RawInvoice[] = await response.json();
        const transformedData = data.map((item: RawInvoice) => ({
          Id: item.id || item.Id || Math.random(), // Ensure each invoice has an Id
          nfattura: item.nfattura,
          cliente: item.cliente,
          indirizzoC: item.indirizzoC,
          pivaC: item.pivaC,
          descrizione: item.descrizione,
          prezzo: item.prezzo,
          state: item.state,
          dataf: item.dataf,
          venditore:item.venditore,
          indirizzoV:item.indirizzoV,
          quantità:item.quantità,
          pivaV:item.pivaV,
          iva:item.iva

        }));
        setInvoice(transformedData);
        setLoading(false);
      } else {
        console.error('Errore nel recupero:', await response.text());
        setError('Errore nel recupero dei dati');
        setLoading(false);
      }
    } catch (error) {
      console.error('Errore nella richiesta:', error);
      setError('Errore nella richiesta al server');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleUpdate = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setFormData(invoice);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      const response = await fetch(`/invoices/deleteInvoices/${id}`, {
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
  
    // Imposta font
    doc.setFont("Helvetica");
    doc.setFontSize(12);
  
    // Intestazione
    doc.setFontSize(16);
    doc.text("FATTURA", 10, 20);
    doc.setFontSize(12);
    doc.text(`Numero: ${invoice.nfattura}`, 10, 30);
    doc.text(`Data: ${invoice.dataf}`, 10, 40);
    doc.text(`Stato: ${invoice.state}`, 10, 50);
  
    // Dati venditore
    doc.text("Venditore:", 10, 70);
    doc.text(invoice.venditore, 10, 80);
    doc.text(invoice.indirizzoV, 10, 90);
    doc.text(`P.IVA: ${invoice.pivaV}`, 10, 100);
  
    // Dati cliente
    doc.text("Cliente:", 100, 70);
    doc.text(invoice.cliente, 100, 80);
    doc.text(invoice.indirizzoC, 100, 90);
    doc.text(`P.IVA: ${invoice.pivaC}`, 100, 100);
  
    // Tabella articoli (con autotable)
    const tableStartY = 120;
    const subtotal = invoice.prezzo * invoice.quantità;
    const ivaAmount = subtotal * (invoice.iva / 100);
    const total = subtotal + ivaAmount;
  
    autoTable(doc, {
      startY: tableStartY,
      head: [["Descrizione", "Quantità", "Prezzo Unitario", "IVA", "Totale"]],
      body: [[
        invoice.descrizione,
        invoice.quantità,
        `€ ${invoice.prezzo.toFixed(2)}`,
        `${invoice.iva}%`,
        `€ ${subtotal.toFixed(2)}`
      ]],
      theme: "grid",
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 30 }
      }
    });
  
    // Totale
    const finalY = doc .lastAutoTable.finalY || tableStartY; // Tipizzazione per autotable
    doc.setFontSize(12);
    doc.text(`Subtotale: € ${subtotal.toFixed(2)}`, 150, finalY + 10);
    doc.text(`IVA (${invoice.iva}%): € ${ivaAmount.toFixed(2)}`, 150, finalY + 20);
    doc.text(`Totale: € ${total.toFixed(2)}`, 150, finalY + 30);
  
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
      const response = await fetch(`/invoices/UpdInvoices/${selectedInvoice.Id}`, {
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
        alert('Invoice updated successfully');
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
      header: 'Update',
      cell: ({ row }) => (
        <button
          className="action-btn update"
          onClick={() => handleUpdate(row.original)}
        >
          Update
        </button>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'nfattura',
      header: 'nFattura',
      enableSorting: true,
    },
    {
      accessorKey: 'cliente',
      header: 'Cliente',
      enableSorting: true,
      enableGlobalFilter: true,
    },
    {
      accessorKey: 'descrizione',
      header: 'Descrizione',
      enableSorting: true,
      enableGlobalFilter: true,
    },
    {
      accessorKey: 'prezzo',
      header: 'Prezzo',
      enableSorting: true,
    },
    {
      accessorKey: 'state',
      header: 'Stato',
      enableSorting: true,
    },
    {
      accessorKey: 'Delete',
      header: 'Delete',
      cell: ({ row }) => (
        <button
          className="action-btn delete"
          onClick={() => handleDelete(row.original.Id!)}
        >
          Delete
        </button>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'Download',
      header: 'Download',
      cell: ({ row }) => (
       <>
 {/* {selectedInvoice && (
        <InvoicePreview
          invoice={selectedInvoice}
          invoiceContentRef={invoiceContentRef} // Passa il ref come prop
        />
      )} */}
        <button
          className="action-btn download"
          onClick={() => handleDownload(row.original)}
        >
          Download
        </button>
     
        
    </>
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
    initialState: {
      pagination: {
        pageSize: 3,
      },
    },
  });

  if (loading) {
    return <p className="status-message">Loading...</p>;
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  console.log('invoice data:', JSON.stringify(invoice, null, 2));
  const paidCount = invoice.filter(inv => inv.state === 'paid').length;
  const unpaidCount = invoice.filter(inv => inv.state === 'unpaid').length;
  const data=[
    {name:"paid", value: paidCount},
    {name:"unpaid", value:unpaidCount}
  ]
  
  const COLORS = ['#4CAF50', '#F44336'];
  return (
    <div className="dashboard-container">

      <div className='analitiche'>
       
        <div className='paid'>
        <PieChart width={1130} height={400}>
  <Pie
    data={data}
    cx="50%"
    cy="50%" 
    label
    outerRadius={140}
    dataKey="value"
  >
    {data.map((entry, index) => (
      <Cell key={`slice-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend verticalAlign="bottom" height={34} />
</PieChart>


        </div>
       
      </div>
      {/* Global filter input */}
      
      <input
        type="text"
        placeholder="Search invoices..."
        value={(table.getState().globalFilter ?? '') as string}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        className="search-input"
      />

       {/* Pagination Controls */}
       <div className="pagination">
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
        <span className="pagination-info">
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="pagination-select"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      

      {/* Table */}
      <table className="invoice-table">
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="invoice-row">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

   
     

      {/* Update Modal */}
      {isModalOpen && (
        <div className="popup-overlay">
          <div className="modal">
            <h2 className="form-title">Update Invoice</h2>
            <form onSubmit={handleUpdateSubmit} className="modal-form">
            <div className="form-row">
            <div className="form-column">
              <label>
                nFattura:
                <input
                  type="text"
                  name="nfattura"
                  value={formData.nfattura || ''}
                  onChange={handleFormChange}
                  required
                />
              </label>
              </div>
              <div className="form-column"></div>
              <label>
                Cliente:
                <input
                  type="text"
                  name="cliente"
                  value={formData.cliente || ''}
                  onChange={handleFormChange}
                  required
                />
                </label>
              </div>
              <div className="form-column">
              <label>
                Indirizzo Cliente:
                <input
                  type="text"
                  name="indirizzoC"
                  value={formData.indirizzoC || ''}
                  onChange={handleFormChange}
                  required
                />
              </label>
              </div>
              <div className="form-column">
              <label>
                Partita IVA:
                <input
                  type="text"
                  name="pivaC"
                  value={formData.pivaC || ''}
                  onChange={handleFormChange}
                  required
                />
              </label>
              </div>
              <div className="form-column">
              <label>
                Descrizione:
                <input
                  type="text"
                  name="descrizione"
                  value={formData.descrizione || ''}
                  onChange={handleFormChange}
                  required
                />
              </label>
              </div>
              <div className="form-column">
              <label>
                Prezzo:
                <input
                  type="number"
                  name="prezzo"
                  value={formData.prezzo || 0}
                  onChange={handleFormChange}
                  required
                />
              </label>
              </div>
              <div className="form-column">
              <label>
                Stato:
                <select
                  name="state"
                  value={formData.state || 'unpaid'}
                  onChange={handleFormChange}
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </label>
              </div>
              <div className="form-column">
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
              </div>
            </form>
          </div>
 

        </div>
        
      )}
    </div>
  );
};

export default Dashboard;