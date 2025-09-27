package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.Medicamento;
import com.example.demo.service.MedicamentoService;

@RestController
@RequestMapping("/api/Medicamento")
public class MedicamentoController {
    @Autowired
    private MedicamentoService service;

    @GetMapping
    public List<Medicamento> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
