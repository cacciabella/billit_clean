package com.example.demo;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("https://billit-clean.onrender.com") // Specifica il tuo dominio esatto
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Metodi HTTP permessi
                .allowedHeaders("*") // Tutti gli header
                .exposedHeaders("Authorization") // Esponi header di autorizzazione
                .allowCredentials(true); // Abilita credenziali per le richieste autenticate
    }
}