




package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import com.example.demo.entity.ProductoDetallePedido;
import com.example.demo.service.ProductoDetallePedidoService;

@RestController
@RequestMapping("/api/ProductoDetallePedido")
public class ProductoDetallePedidoController {
    @Autowired
    private ProductoDetallePedidoService service;

    @GetMapping
    public List<ProductoDetallePedido> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Optional<ProductoDetallePedido> getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ProductoDetallePedido create(@RequestBody ProductoDetallePedido entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ProductoDetallePedido update(@PathVariable Long id, @RequestBody ProductoDetallePedido entity) {
        return service.update(id, entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
