package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.entity.ProductoDetallePedido;
import com.example.demo.service.ProductoDetallePedidoService;

@RestController
@RequestMapping("/api/ProductoDetallePedido")
public class ProductoDetallePedidoController {
    @Autowired
    private ProductoDetallePedidoService service;

    @GetMapping
    public List<ProductoDetallePedido> getAll() {
        // Implementar lógica para obtener todos
        return null;
    }

    // Agrega aquí más endpoints según necesidad
}
