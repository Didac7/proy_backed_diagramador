package com.example.demo.entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "ConductorVehiculo")
@IdClass(com.example.demo.entity.ConductorVehiculoId.class)
public class ConductorVehiculo implements Serializable {
    @Id
    @Column(name = "Conductor_idConductor")
    private Long Conductor_idConductor;
    @Id
    @Column(name = "Vehiculo_idVehiculo")
    private Long Vehiculo_idVehiculo;
    @Column(name = "Vehiculo_idVehiculo_")
    private String Vehiculo_idVehiculo_;

    // Getters y Setters
    public Long getConductor_idConductor() { return Conductor_idConductor; }
    public void setConductor_idConductor(Long Conductor_idConductor) { this.Conductor_idConductor = Conductor_idConductor; }
    public Long getVehiculo_idVehiculo() { return Vehiculo_idVehiculo; }
    public void setVehiculo_idVehiculo(Long Vehiculo_idVehiculo) { this.Vehiculo_idVehiculo = Vehiculo_idVehiculo; }
    public String getVehiculo_idVehiculo_() { return Vehiculo_idVehiculo_; }
    public void setVehiculo_idVehiculo_(String Vehiculo_idVehiculo_) { this.Vehiculo_idVehiculo_ = Vehiculo_idVehiculo_; }
}

