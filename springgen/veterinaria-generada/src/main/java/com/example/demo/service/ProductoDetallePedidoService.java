


package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
import com.example.demo.entity.ProductoDetallePedido;
import com.example.demo.repository.ProductoDetallePedidoRepository;

@Service
public class ProductoDetallePedidoService {
    @Autowired
    private ProductoDetallePedidoRepository repository;

    public List<ProductoDetallePedido> findAll() {
        return repository.findAll();
    }

    public Optional<ProductoDetallePedido> findById(Long id) {
        return repository.findById(id);
    }

    public ProductoDetallePedido save(ProductoDetallePedido entity) {
        return repository.save(entity);
    }

    public ProductoDetallePedido update(Long id, ProductoDetallePedido entity) {
        if (repository.existsById(id)) {
            // Aquí podrías setear el id si es necesario
            return repository.save(entity);
        }
        throw new RuntimeException("No existe el registro con id " + id);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
