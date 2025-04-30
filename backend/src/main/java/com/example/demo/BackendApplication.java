package com.example.demo;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.example.demo.Model")
@EnableJpaRepositories(basePackages = "com.example.demo.repository")
public class BackendApplication {
    public static void main(String[] args) {
        // Carica le variabili dal file .env
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        // Imposta le variabili come System properties per Spring Boot
        System.setProperty("AWS_ACCESS_KEY", dotenv.get("AWS_ACCESS_KEY", ""));
        System.setProperty("AWS_SECRET_KEY", dotenv.get("AWS_SECRET_KEY", ""));

        SpringApplication.run(BackendApplication.class, args);
    }
}
