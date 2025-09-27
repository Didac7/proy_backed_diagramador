package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.Mascota;
import com.example.demo.service.MascotaService;

@RestController
@RequestMapping("/api/Mascota")
public class MascotaController {
    @Autowired
    private MascotaService service;

    @GetMapping
    public List<Mascota> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
