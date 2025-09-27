package com.example.demo.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "Pedido")
public class Pedido implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "fecha")
    private LocalDate fecha;
    @Column(name = "total")
    private String total;
    @Column(name = "_2_")
    private String _2_;
    @Column(name = "usuario_id")
    private Long usuario_id;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public String getTotal() { return total; }
    public void setTotal(String total) { this.total = total; }
    public String get_2_() { return _2_; }
    public void set_2_(String _2_) { this._2_ = _2_; }
    public Long getUsuario_id() { return usuario_id; }
    public void setUsuario_id(Long usuario_id) { this.usuario_id = usuario_id; }
}

