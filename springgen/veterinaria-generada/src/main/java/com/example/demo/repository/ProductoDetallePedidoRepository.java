


package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.ProductoDetallePedido;

@Repository
public interface ProductoDetallePedidoRepository extends JpaRepository<ProductoDetallePedido, Long> {
    // Métodos personalizados si es necesario
}
