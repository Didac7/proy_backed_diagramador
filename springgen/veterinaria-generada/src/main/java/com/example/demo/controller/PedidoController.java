




package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import com.example.demo.entity.Pedido;
import com.example.demo.service.PedidoService;

@RestController
@RequestMapping("/api/Pedido")
public class PedidoController {
    @Autowired
    private PedidoService service;

    @GetMapping
    public List<Pedido> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Pedido> getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Pedido create(@RequestBody Pedido entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public Pedido update(@PathVariable Long id, @RequestBody Pedido entity) {
        return service.update(id, entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
