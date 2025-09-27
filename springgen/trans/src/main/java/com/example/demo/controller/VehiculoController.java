package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.Vehiculo;
import com.example.demo.service.VehiculoService;

@RestController
@RequestMapping("/api/Vehiculo")
public class VehiculoController {
    @Autowired
    private VehiculoService service;

    @GetMapping
    public List<Vehiculo> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
