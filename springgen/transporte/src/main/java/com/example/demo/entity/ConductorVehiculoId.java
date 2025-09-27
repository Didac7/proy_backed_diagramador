package com.example.demo.entity;

import java.io.Serializable;
import java.util.Objects;

public class ConductorVehiculoId implements Serializable {
    private Long Conductor_idConductor;
    private Long Vehiculo_idVehiculo;

    // Getters y Setters
    public Long getConductor_idConductor() { return Conductor_idConductor; }
    public void setConductor_idConductor(Long Conductor_idConductor) { this.Conductor_idConductor = Conductor_idConductor; }
    public Long getVehiculo_idVehiculo() { return Vehiculo_idVehiculo; }
    public void setVehiculo_idVehiculo(Long Vehiculo_idVehiculo) { this.Vehiculo_idVehiculo = Vehiculo_idVehiculo; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ConductorVehiculoId that = (ConductorVehiculoId) o;
        return (
            Objects.equals(Conductor_idConductor, that.Conductor_idConductor) && 
            Objects.equals(Vehiculo_idVehiculo, that.Vehiculo_idVehiculo)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            Conductor_idConductor, 
            Vehiculo_idVehiculo
        );
    }
}
