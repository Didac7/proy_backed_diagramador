package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.Calificacion;
import com.example.demo.service.CalificacionService;

@RestController
@RequestMapping("/api/Calificacion")
public class CalificacionController {
    @Autowired
    private CalificacionService service;

    @GetMapping
    public List<Calificacion> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
