package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.Conductor;
import com.example.demo.service.ConductorService;

@RestController
@RequestMapping("/api/Conductor")
public class ConductorController {
    @Autowired
    private ConductorService service;

    @GetMapping
    public List<Conductor> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
