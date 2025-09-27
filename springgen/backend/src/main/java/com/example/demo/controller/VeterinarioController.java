package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.Veterinario;
import com.example.demo.service.VeterinarioService;

@RestController
@RequestMapping("/api/Veterinario")
public class VeterinarioController {
    @Autowired
    private VeterinarioService service;

    @GetMapping
    public List<Veterinario> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
