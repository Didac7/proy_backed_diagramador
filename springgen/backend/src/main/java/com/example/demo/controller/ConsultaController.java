package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.Consulta;
import com.example.demo.service.ConsultaService;

@RestController
@RequestMapping("/api/Consulta")
public class ConsultaController {
    @Autowired
    private ConsultaService service;

    @GetMapping
    public List<Consulta> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
