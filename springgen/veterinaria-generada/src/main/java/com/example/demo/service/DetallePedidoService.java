


package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
import com.example.demo.entity.DetallePedido;
import com.example.demo.repository.DetallePedidoRepository;

@Service
public class DetallePedidoService {
    @Autowired
    private DetallePedidoRepository repository;

    public List<DetallePedido> findAll() {
        return repository.findAll();
    }

    public Optional<DetallePedido> findById(Long id) {
        return repository.findById(id);
    }

    public DetallePedido save(DetallePedido entity) {
        return repository.save(entity);
    }

    public DetallePedido update(Long id, DetallePedido entity) {
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
