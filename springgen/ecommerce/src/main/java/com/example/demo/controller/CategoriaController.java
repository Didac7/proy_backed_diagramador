package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.Categoria;
import com.example.demo.service.CategoriaService;

@RestController
@RequestMapping("/api/Categoria")
public class CategoriaController {
    @Autowired
    private CategoriaService service;

    @GetMapping
    public List<Categoria> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
