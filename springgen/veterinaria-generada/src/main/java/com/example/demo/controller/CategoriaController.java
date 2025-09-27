




package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import com.example.demo.entity.Categoria;
import com.example.demo.service.CategoriaService;

@RestController
@RequestMapping("/api/Categoria")
public class CategoriaController {
    @Autowired
    private CategoriaService service;

    @GetMapping
    public List<Categoria> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Categoria> getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Categoria create(@RequestBody Categoria entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public Categoria update(@PathVariable Long id, @RequestBody Categoria entity) {
        return service.update(id, entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
