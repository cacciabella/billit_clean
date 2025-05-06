package com.example.demo.Controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.invoices;
import com.example.demo.repository.RepositoryInvoices;

import jakarta.servlet.http.HttpServletRequest;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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
    public ResponseEntity<?> getInvoicesByUser(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        System.out.println("Richiesta ricevuta per /invoices/InvoiceList con Authorization: " + authorizationHeader);
        try {
            if (!isFirebaseInitialized()) {
                System.err.println("Firebase non inizializzato");
                return ResponseEntity
                        .status(HttpStatus.SERVICE_UNAVAILABLE)
                        .header("Retry-After", "60")
                        .body("Servizio di autenticazione non disponibile. Riprova più tardi.");
            }
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                System.out.println("Token mancante o non valido");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token di autorizzazione mancante o non valido");
            }
            String token = authorizationHeader.substring(7);
            System.out.println("Verifica token: " + token);
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            String userIdFromToken = decodedToken.getUid();
            System.out.println("User ID: " + userIdFromToken);
            List<invoices> userInvoices = repositoryInvoices.findByUserId(userIdFromToken);
            System.out.println("Fatt nere recuperate: " + userInvoices.size());
            return ResponseEntity.ok(userInvoices);
        } catch (FirebaseAuthException e) {
            System.err.println("Errore Firebase: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token non valido: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Errore generico: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore del server: " + e.getMessage());
        }
    }
// Helper method to check if Firebase is initialized
private boolean isFirebaseInitialized() {
    try {
        // If this doesn't throw an exception, Firebase is initialized
        FirebaseApp defaultApp = FirebaseApp.getInstance();
        return defaultApp != null;
    } catch (IllegalStateException e) {
        // FirebaseApp.getInstance() throws IllegalStateException if no app has been initialized
        return false;
    }
}
    @PostMapping("/NewInvoices")
    public ResponseEntity<invoices> postMethodName(@RequestBody invoices invoice, HttpServletRequest request) {
        try {
            // Verifica il token nell'header della richiesta
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            String token = authorizationHeader.substring(7); // Estrae il token
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            String userIdFromToken = decodedToken.getUid();

            // Aggiungi l'ID utente al modello della fattura
            invoice.setUserId(userIdFromToken); // Imposta l'ID utente sulla fattura

            // Se il venditore non è specificato, metti un valore di default
            if (invoice.getVenditore() == null) {
                invoice.setVenditore("Default Vendor");
            }

            // Salva la fattura nel database
            invoices savedInvoice = repositoryInvoices.save(invoice);

            return ResponseEntity.ok(savedInvoice);

        } catch (Exception e) {
          e.printStackTrace(); // Log dell'errore
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
      }
      
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

    


