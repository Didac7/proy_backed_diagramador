package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.ConductorVehiculo;
import com.example.demo.service.ConductorVehiculoService;

@RestController
@RequestMapping("/api/ConductorVehiculo")
public class ConductorVehiculoController {
    @Autowired
    private ConductorVehiculoService service;

    @GetMapping
    public List<ConductorVehiculo> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
