package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.Reserva;
import com.example.demo.service.ReservaService;

@RestController
@RequestMapping("/api/Reserva")
public class ReservaController {
    @Autowired
    private ReservaService service;

    @GetMapping
    public List<Reserva> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
