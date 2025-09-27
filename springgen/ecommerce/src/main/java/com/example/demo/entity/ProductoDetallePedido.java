package com.example.demo.entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "ProductoDetallePedido")
@IdClass(com.example.demo.entity.ProductoDetallePedidoId.class)
public class ProductoDetallePedido implements Serializable {
    @Id
    @Column(name = "producto_id")
    private Long producto_id;
    @Id
    @Column(name = "detallepedido_id")
    private Long detallepedido_id;
    @Column(name = "detallepedido_id_")
    private String detallepedido_id_;

    // Getters y Setters
    public Long getProducto_id() { return producto_id; }
    public void setProducto_id(Long producto_id) { this.producto_id = producto_id; }
    public Long getDetallepedido_id() { return detallepedido_id; }
    public void setDetallepedido_id(Long detallepedido_id) { this.detallepedido_id = detallepedido_id; }
    public String getDetallepedido_id_() { return detallepedido_id_; }
    public void setDetallepedido_id_(String detallepedido_id_) { this.detallepedido_id_ = detallepedido_id_; }
}

