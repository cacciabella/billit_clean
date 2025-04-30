package com.example.demo.firebase;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import io.github.cdimascio.dotenv.Dotenv;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

@Component
public class firebaseService {

    private S3Client s3Client;

    // Carica le credenziali dal file .env
    private final Dotenv dotenv = Dotenv.configure()
            .directory("/Users/cacciabella12/invoices-generation/backend")
            .filename(".env")
            .load();

    private final String accessKeyId = dotenv.get("AWS_ACCESS_KEY");
    private final String secretKey = dotenv.get("AWS_SECRET_KEY");
    private final String region = dotenv.get("AWS_REGION");

    // Metodo di inizializzazione
    @PostConstruct
    public void init() {
        // Validazione delle credenziali AWS
        if (accessKeyId == null || secretKey == null || region == null) {
            throw new IllegalStateException("AWS credentials or region not found in .env file");
        }

        // Inizializzazione delle credenziali AWS
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKeyId, secretKey);

        // Crea il client S3 con le credenziali
        this.s3Client = S3Client.builder()
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .region(Region.of(region))
                .build();

        // Carica la configurazione di Firebase
        try {
            loadFirebaseConfig();
        } catch (IOException e) {
            System.err.println("Errore nell'inizializzazione di Firebase: " + e.getMessage());
            throw new RuntimeException("Impossibile inizializzare Firebase", e);
        }
    }

    // Metodo per scaricare la configurazione di Firebase da S3 e inizializzare Firebase
    public void loadFirebaseConfig() throws IOException {
        String bucketName = "billitapikey";
        String fileKey = "billit-89312-firebase-adminsdk-fbsvc-bec60e754b.json";
        Path filePath = Paths.get("/Users/cacciabella12/invoices-generation/backend/firebase-config.json");

        // Crea la directory se non esiste
        Files.createDirectories(filePath.getParent());

        // Scarica il file da S3, sovrascrivendo se esiste
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .build();

            s3Client.getObject(getObjectRequest, ResponseTransformer.toOutputStream(
                    Files.newOutputStream(filePath, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING)
            ));
            System.out.println("File Firebase scaricato da S3: " + filePath.toAbsolutePath());
        } catch (Exception e) {
            System.err.println("Errore nel download del file da S3: " + e.getMessage());
            throw new IOException("Impossibile scaricare il file di configurazione Firebase da S3", e);
        }

        // Inizializza Firebase
        try (FileInputStream serviceAccount = new FileInputStream(filePath.toFile())) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            // Se Firebase non è già stato inizializzato, procedi con l'inizializzazione
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase inizializzato.");
            } else {
                System.out.println("Firebase già inizializzato.");
            }
        } catch (IOException e) {
            System.err.println("Errore nell'inizializzazione di Firebase con il file di servizio: " + e.getMessage());
            throw new IOException("Impossibile inizializzare Firebase", e);
        }
    }
}