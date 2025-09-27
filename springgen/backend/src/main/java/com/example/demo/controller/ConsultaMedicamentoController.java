package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.ConsultaMedicamento;
import com.example.demo.service.ConsultaMedicamentoService;

@RestController
@RequestMapping("/api/ConsultaMedicamento")
public class ConsultaMedicamentoController {
    @Autowired
    private ConsultaMedicamentoService service;

    @GetMapping
    public List<ConsultaMedicamento> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
