package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.Pasajero;
import com.example.demo.service.PasajeroService;

@RestController
@RequestMapping("/api/Pasajero")
public class PasajeroController {
    @Autowired
    private PasajeroService service;

    @GetMapping
    public List<Pasajero> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
