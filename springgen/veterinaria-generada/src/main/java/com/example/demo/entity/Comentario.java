package com.example.demo.entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "Comentario")
public class Comentario implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "contenido")
    private String contenido;
    @Column(name = "usuario_id")
    private Long usuario_id;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }
    public Long getUsuario_id() { return usuario_id; }
    public void setUsuario_id(Long usuario_id) { this.usuario_id = usuario_id; }
}

