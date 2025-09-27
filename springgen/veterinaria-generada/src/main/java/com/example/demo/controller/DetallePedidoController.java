




package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import com.example.demo.entity.DetallePedido;
import com.example.demo.service.DetallePedidoService;

@RestController
@RequestMapping("/api/DetallePedido")
public class DetallePedidoController {
    @Autowired
    private DetallePedidoService service;

    @GetMapping
    public List<DetallePedido> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Optional<DetallePedido> getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public DetallePedido create(@RequestBody DetallePedido entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public DetallePedido update(@PathVariable Long id, @RequestBody DetallePedido entity) {
        return service.update(id, entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
