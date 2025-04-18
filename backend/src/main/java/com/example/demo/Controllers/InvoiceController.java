package com.example.demo.Controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.invoices;
import com.example.demo.repository.RepositoryInvoices;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/invoices")

public class InvoiceController {
    

    private final RepositoryInvoices repositoryInvoices;


    public InvoiceController(RepositoryInvoices repositoryInvoices) {
        this.repositoryInvoices = repositoryInvoices;
    }

@GetMapping("/InvoiceList")
public Iterable<invoices> getAllInvoices() {
    return this.repositoryInvoices.findAll();
}


    @PostMapping("/NewInvoices")
    public invoices postMethodName(@RequestBody invoices invoices) {

        if (invoices.getVenditore() == null) {
            invoices.setVenditore("Default Vendor"); 
        }
        
        invoices newInvoices=this.repositoryInvoices.save(invoices);

        return newInvoices;
      
    }


    @PutMapping("/UpdInvoices/{id}")
  public invoices updateInvoices(@PathVariable("id") Integer id, @RequestBody invoices I) {
    Optional<invoices> InvoiceToUpdateOptional = this.repositoryInvoices.findById(id);
    if (!InvoiceToUpdateOptional.isPresent()) {
        return null;
    }

    invoices invoiceToUpdate = InvoiceToUpdateOptional.get();


  if(I.getNfattura()!= null){
    invoiceToUpdate.setNfattura(I.getNfattura());
  }

  if(I.getCliente()!= null){
    invoiceToUpdate.setCliente(I.getCliente());
  }

  if(I.getIndirizzoC()!= null){
    invoiceToUpdate.setIndirizzoC(I.getIndirizzoC());
  }

  if(I.getPivaC()!= null){
    invoiceToUpdate.setPivaC(I.getPivaC());
  }

  if(I.getDescrizione()!= null){
    invoiceToUpdate.setDescrizione(I.getDescrizione());
  }

  if(I.getPrezzo()!= 0){
    invoiceToUpdate.setPrezzo(I.getPrezzo());
  }

  if(I.getState()!= null){
    invoiceToUpdate.setState(I.getState());
  }

  
    // Aggiungi qui la logica per aggiornare i campi
invoices updatedInvoice = this.repositoryInvoices.save(invoiceToUpdate);
    return updatedInvoice; // Assicurati di restituire un valore
}



@DeleteMapping("/deleteInvoices/{id}")
public invoices DeleteInvoices(@PathVariable("id") Integer id) {


    Optional<invoices> InvoiceToDeleteOptional = this.repositoryInvoices.findById(id);

    invoices invoiceToDelete = InvoiceToDeleteOptional.get();

    // Aggiungi qui la logica per aggiornare i campi
repositoryInvoices.delete(invoiceToDelete);
return invoiceToDelete;

    
  
}

}

    


