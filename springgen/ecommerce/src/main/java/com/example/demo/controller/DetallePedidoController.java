package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.DetallePedido;
import com.example.demo.service.DetallePedidoService;

@RestController
@RequestMapping("/api/DetallePedido")
public class DetallePedidoController {
    @Autowired
    private DetallePedidoService service;

    @GetMapping
    public List<DetallePedido> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
