


package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
import com.example.demo.entity.Comentario;
import com.example.demo.repository.ComentarioRepository;

@Service
public class ComentarioService {
    @Autowired
    private ComentarioRepository repository;

    public List<Comentario> findAll() {
        return repository.findAll();
    }

    public Optional<Comentario> findById(Long id) {
        return repository.findById(id);
    }

    public Comentario save(Comentario entity) {
        return repository.save(entity);
    }

    public Comentario update(Long id, Comentario entity) {
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
