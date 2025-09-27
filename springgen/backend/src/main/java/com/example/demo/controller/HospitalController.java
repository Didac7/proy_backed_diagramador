package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.Hospital;
import com.example.demo.service.HospitalService;

@RestController
@RequestMapping("/api/Hospital")
public class HospitalController {
    @Autowired
    private HospitalService service;

    @GetMapping
    public List<Hospital> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
