package com.example.demo.entity;

import java.io.Serializable;
import java.util.Objects;

public class ReservaId implements Serializable {
    private Long idReserva;
    private Long idPasajero;
    private Long idViaje;
    private Long idPasajero;
    private Long idViaje;

    // Getters y Setters
    public Long getIdReserva() { return idReserva; }
    public void setIdReserva(Long idReserva) { this.idReserva = idReserva; }
    public Long getIdPasajero() { return idPasajero; }
    public void setIdPasajero(Long idPasajero) { this.idPasajero = idPasajero; }
    public Long getIdViaje() { return idViaje; }
    public void setIdViaje(Long idViaje) { this.idViaje = idViaje; }
    public Long getIdPasajero() { return idPasajero; }
    public void setIdPasajero(Long idPasajero) { this.idPasajero = idPasajero; }
    public Long getIdViaje() { return idViaje; }
    public void setIdViaje(Long idViaje) { this.idViaje = idViaje; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReservaId that = (ReservaId) o;
        return (
            Objects.equals(idReserva, that.idReserva) && 
            Objects.equals(idPasajero, that.idPasajero) && 
            Objects.equals(idViaje, that.idViaje) && 
            Objects.equals(idPasajero, that.idPasajero) && 
            Objects.equals(idViaje, that.idViaje)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            idReserva, 
            idPasajero, 
            idViaje, 
            idPasajero, 
            idViaje
        );
    }
}
