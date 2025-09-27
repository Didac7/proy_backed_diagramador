


package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
import com.example.demo.entity.Pedido;
import com.example.demo.repository.PedidoRepository;

@Service
public class PedidoService {
    @Autowired
    private PedidoRepository repository;

    public List<Pedido> findAll() {
        return repository.findAll();
    }

    public Optional<Pedido> findById(Long id) {
        return repository.findById(id);
    }

    public Pedido save(Pedido entity) {
        return repository.save(entity);
    }

    public Pedido update(Long id, Pedido entity) {
        if (repository.existsById(id)) {
            // Aquí podrías setear el id si es necesario
            return repository.save(entity);
        }
        throw new RuntimeException("No existe el registro con id " + id);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
