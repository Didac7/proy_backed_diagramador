package com.example.demo.entity;

import java.io.Serializable;
import java.util.Objects;

public class CalificacionId implements Serializable {
    private Long idPasajero;
    private Long idConductor;

    // Getters y Setters
    public Long getIdPasajero() { return idPasajero; }
    public void setIdPasajero(Long idPasajero) { this.idPasajero = idPasajero; }
    public Long getIdConductor() { return idConductor; }
    public void setIdConductor(Long idConductor) { this.idConductor = idConductor; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CalificacionId that = (CalificacionId) o;
        return (
            Objects.equals(idPasajero, that.idPasajero) && 
            Objects.equals(idConductor, that.idConductor)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            idPasajero, 
            idConductor
        );
    }
}
