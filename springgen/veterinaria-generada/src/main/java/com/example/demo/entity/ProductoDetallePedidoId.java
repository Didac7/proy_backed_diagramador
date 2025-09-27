package com.example.demo.entity;

import java.io.Serializable;
import java.util.Objects;

public class ProductoDetallePedidoId implements Serializable {
    private Long producto_id;
    private Long detallepedido_id;

    // Getters y Setters
    public Long getProducto_id() { return producto_id; }
    public void setProducto_id(Long producto_id) { this.producto_id = producto_id; }
    public Long getDetallepedido_id() { return detallepedido_id; }
    public void setDetallepedido_id(Long detallepedido_id) { this.detallepedido_id = detallepedido_id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductoDetallePedidoId that = (ProductoDetallePedidoId) o;
        return (
            Objects.equals(producto_id, that.producto_id) && 
            Objects.equals(detallepedido_id, that.detallepedido_id)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            producto_id, 
            detallepedido_id
        );
    }
}
