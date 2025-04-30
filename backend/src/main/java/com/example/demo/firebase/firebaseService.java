package com.example.demo.firebase;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Paths;

@Component
public class firebaseService {

    private final S3Client s3Client;
    
    @Value("${aws.accessKeyId}")
    private String accessKeyId;
    
    @Value("${aws.secretKey}")
    private String secretKey;
    
    @Value("${aws.region:us-east-1}")
    private String region;

    public firebaseService(@Value("${aws.accessKeyId}") String accessKeyId, 
                          @Value("${aws.secretKey}") String secretKey,
                          @Value("${aws.region:us-east-1}") String region) {
        // Crea credenziali AWS esplicite
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKeyId, secretKey);
        
        // Crea il client S3 con le credenziali
        this.s3Client = S3Client.builder()
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .region(Region.of(region))
                .build();
    }

    @PostConstruct
    public void init() {
        try {
            loadFirebaseConfig();
        } catch (IOException e) {
            System.err.println("Errore nell'inizializzazione di Firebase: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void loadFirebaseConfig() throws IOException {
        String bucketName = "billitapikey";
        String fileKey = "billit-89312-firebase-adminsdk-fbsvc-bec60e754b.json";
        File file = new File("firebase-config.json");

        // Scarica da S3
        s3Client.getObject(GetObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build(), Paths.get(file.getAbsolutePath()));

        System.out.println("File Firebase scaricato da S3: " + file.getAbsolutePath());

        // Inizializza Firebase
        try (FileInputStream serviceAccount = new FileInputStream(file)) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase inizializzato.");
            } else {
                System.out.println("Firebase già inizializzato.");
            }
        }
    }
}