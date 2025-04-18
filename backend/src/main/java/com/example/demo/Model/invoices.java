package com.example.demo.Model;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "invoice")
public class invoices {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;


    public Integer getId() {
        return Id;
    }


    public void setId(Integer id) {
        Id = id;
    }


    @Column(name = "nfattura")
    private String nfattura;


    public String getNfattura() {
        return nfattura;
    }


    public void setNfattura(String nfattura) {
        this.nfattura = nfattura;
    }


    @Column(name="dataf")
    private Date dataf;

    public Date getDataf() {
        return dataf;
    }


    public void setDataf(Date dataf) {
        this.dataf = dataf;
    }


    @Column(name="state")
    private String state;


    public String getState() {
        return state;
    }


    public void setState(String state) {
        this.state = state;
    }


    @Column(name="venditore")
    private String venditore;

    public String getVenditore() {
        return venditore;
    }


    public void setVenditore(String venditore) {
        this.venditore = venditore;
    }


    @Column(name="indirizzoV")
    private String indirizzoV;

    public String getIndirizzoV() {
        return indirizzoV;
    }


    public void setIndirizzoV(String indirizzoV) {
        this.indirizzoV = indirizzoV;
    }


    @Column(name="pivaV")
    private String pivaV;

    public String getPivaV() {
        return pivaV;
    }


    public void setPivaV(String pivaV) {
        this.pivaV = pivaV;
    }


    @Column(name="cliente")
    private String cliente;



    public String getCliente() {
        return cliente;
    }


    public void setCliente(String cliente) {
        this.cliente = cliente;
    }


    @Column(name="indirizzoC")
    private String indirizzoC;

    public String getIndirizzoC() {
        return indirizzoC;
    }


    public void setIndirizzoC(String indirizzoC) {
        this.indirizzoC = indirizzoC;
    }


    @Column(name="pivaC")
    private String pivaC;

    public String getPivaC() {
        return pivaC;
    }


    public void setPivaC(String pivaC) {
        this.pivaC = pivaC;
    }


    @Column(name="descrizione")
    private String descrizione;


    public String getDescrizione() {
        return descrizione;
    }


    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }


    @Column(name="quantità")
    private Integer quantità;


    public Integer getQuantità() {
        return quantità;
    }


    public void setQuantità(Integer quantità) {
        this.quantità = quantità;
    }


    @Column(name="prezzo")
    private double prezzo;

    public double getPrezzo() {
        return prezzo;
    }


    public void setPrezzo(double prezzo) {
        this.prezzo = prezzo;
    }


    @Column(name="iva")
    private Integer iva;


    public Integer getIva() {
        return iva;
    }


    public void setIva(Integer iva) {
        this.iva = iva;
    }


    @Column(name="note")
    private String note;


    public String getNote() {
        return note;
    }


    public void setNote(String note) {
        this.note = note;
    }
}
