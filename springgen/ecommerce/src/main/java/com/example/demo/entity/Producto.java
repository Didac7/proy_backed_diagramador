package com.example.demo.entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "Producto")
public class Producto implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "nombre")
    private String nombre;
    @Column(name = "precio")
    private String precio;
    @Column(name = "_2_")
    private String _2_;
    @Column(name = "descripcion")
    private String descripcion;
    @Column(name = "categoria_id")
    private Long categoria_id;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getPrecio() { return precio; }
    public void setPrecio(String precio) { this.precio = precio; }
    public String get_2_() { return _2_; }
    public void set_2_(String _2_) { this._2_ = _2_; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Long getCategoria_id() { return categoria_id; }
    public void setCategoria_id(Long categoria_id) { this.categoria_id = categoria_id; }
}

