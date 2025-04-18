
// Defines the structure of an Invoice object used across components
export interface Invoice {
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