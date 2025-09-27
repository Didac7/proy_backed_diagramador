package com.example.demo.entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "DetallePedido")
public class DetallePedido implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "cantidad")
    private Long cantidad;
    @Column(name = "pedido_id")
    private Long pedido_id;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCantidad() { return cantidad; }
    public void setCantidad(Long cantidad) { this.cantidad = cantidad; }
    public Long getPedido_id() { return pedido_id; }
    public void setPedido_id(Long pedido_id) { this.pedido_id = pedido_id; }
}

