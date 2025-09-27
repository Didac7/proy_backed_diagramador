package com.example.demo.entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "Reserva")
@IdClass(com.example.demo.entity.ReservaId.class)
public class Reserva implements Serializable {
    @Id
    @Column(name = "idPasajero")
    private Long idPasajero;
    @Id
    @Column(name = "idViaje")
    private Long idViaje;
    @Column(name = "estado")
    private String estado;
    @Column(name = "idViaje_")
    private String idViaje_;

    // Getters y Setters
    public Long getIdPasajero() { return idPasajero; }
    public void setIdPasajero(Long idPasajero) { this.idPasajero = idPasajero; }
    public Long getIdViaje() { return idViaje; }
    public void setIdViaje(Long idViaje) { this.idViaje = idViaje; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getIdViaje_() { return idViaje_; }
    public void setIdViaje_(String idViaje_) { this.idViaje_ = idViaje_; }
}

