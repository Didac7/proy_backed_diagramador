package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.Viaje;
import com.example.demo.service.ViajeService;

@RestController
@RequestMapping("/api/Viaje")
public class ViajeController {
    @Autowired
    private ViajeService service;

    @GetMapping
    public List<Viaje> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
