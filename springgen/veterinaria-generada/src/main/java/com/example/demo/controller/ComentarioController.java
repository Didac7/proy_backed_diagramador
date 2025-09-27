




package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import com.example.demo.entity.Comentario;
import com.example.demo.service.ComentarioService;

@RestController
@RequestMapping("/api/Comentario")
public class ComentarioController {
    @Autowired
    private ComentarioService service;

    @GetMapping
    public List<Comentario> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Comentario> getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Comentario create(@RequestBody Comentario entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public Comentario update(@PathVariable Long id, @RequestBody Comentario entity) {
        return service.update(id, entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
