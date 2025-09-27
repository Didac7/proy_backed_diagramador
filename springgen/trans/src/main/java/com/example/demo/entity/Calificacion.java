package com.example.demo.entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "Calificacion")
@IdClass(com.example.demo.entity.CalificacionId.class)
public class Calificacion implements Serializable {
    @Id
    @Column(name = "idPasajero")
    private Long idPasajero;
    @Id
    @Column(name = "idConductor")
    private Long idConductor;
    @Column(name = "puntuacion")
    private String puntuacion;
    @Column(name = "comentario")
    private String comentario;
    @Column(name = "idConductor_")
    private String idConductor_;

    // Getters y Setters
    public Long getIdPasajero() { return idPasajero; }
    public void setIdPasajero(Long idPasajero) { this.idPasajero = idPasajero; }
    public Long getIdConductor() { return idConductor; }
    public void setIdConductor(Long idConductor) { this.idConductor = idConductor; }
    public String getPuntuacion() { return puntuacion; }
    public void setPuntuacion(String puntuacion) { this.puntuacion = puntuacion; }
    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
    public String getIdConductor_() { return idConductor_; }
    public void setIdConductor_(String idConductor_) { this.idConductor_ = idConductor_; }
}

