package com.example.demo.firebase;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import io.github.cdimascio.dotenv.Dotenv;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

@Component
public class firebaseService {

    private S3Client s3Client;

    // Carica le credenziali dal file .env
    private final Dotenv dotenv = Dotenv.configure()
            .directory("/Users/cacciabella12/invoices-generation/backend")
            .filename(".env")
            .load();

    private final String accessKeyId = dotenv.get("AWS_ACCESS_KEY_ID");
    private final String secretKey = dotenv.get("AWS_SECRET_ACCESS_KEY");
    private final String region = dotenv.get("AWS_REGION");
    private final String googleCloudCredentialsUrl = dotenv.get("GOOGLE_CLOUD_CREDENTIALS");

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

    // Metodo per scaricare la configurazione di Firebase da S3
    public void loadFirebaseConfig() throws IOException {
        if (googleCloudCredentialsUrl == null || googleCloudCredentialsUrl.isEmpty()) {
            throw new IllegalStateException("URL per le credenziali Firebase non trovato nel file .env");
        }

        try {
            // Parse the S3 URL to extract bucket and key
            URL url = new URL(googleCloudCredentialsUrl);
            String path = url.getPath();
            if (path.startsWith("/")) {
                path = path.substring(1);
            }
            
            String host = url.getHost();
            String bucket = host.split("\\.")[0]; // Estrai il nome del bucket dalla prima parte dell'host
            String key = path; // Il percorso è la chiave
            
            System.out.println("Caricamento del file Firebase da S3 - Bucket: " + bucket + ", Key: " + key);
            
            // Usa il client S3 per ottenere l'oggetto dal bucket
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .build();
            
            ResponseInputStream<GetObjectResponse> s3Object = s3Client.getObject(getObjectRequest);
            
            // Inizializza Firebase con il contenuto del file
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(s3Object))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase inizializzato con successo");
            }
        } catch (Exception e) {
            throw new IOException("Errore nel caricamento delle credenziali Firebase da S3: " + e.getMessage(), e);
        }
    }
}
