


package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
import com.example.demo.entity.Categoria;
import com.example.demo.repository.CategoriaRepository;

@Service
public class CategoriaService {
    @Autowired
    private CategoriaRepository repository;

    public List<Categoria> findAll() {
        return repository.findAll();
    }

    public Optional<Categoria> findById(Long id) {
        return repository.findById(id);
    }

    public Categoria save(Categoria entity) {
        return repository.save(entity);
    }

    public Categoria update(Long id, Categoria entity) {
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
