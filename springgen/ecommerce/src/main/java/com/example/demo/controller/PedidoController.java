package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.Pedido;
import com.example.demo.service.PedidoService;

@RestController
@RequestMapping("/api/Pedido")
public class PedidoController {
    @Autowired
    private PedidoService service;

    @GetMapping
    public List<Pedido> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
