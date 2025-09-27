package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.Comentario;
import com.example.demo.service.ComentarioService;

@RestController
@RequestMapping("/api/Comentario")
public class ComentarioController {
    @Autowired
    private ComentarioService service;

    @GetMapping
    public List<Comentario> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
