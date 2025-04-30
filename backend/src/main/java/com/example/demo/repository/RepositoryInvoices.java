package com.example.demo.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.demo.Model.invoices;

public interface RepositoryInvoices extends CrudRepository<invoices , Integer> {
    List<invoices> findByUserId(String userIdFromToken);
    
    
}
