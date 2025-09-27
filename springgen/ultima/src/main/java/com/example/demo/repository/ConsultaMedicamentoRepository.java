package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.ConsultaMedicamento;

@Repository
public interface ConsultaMedicamentoRepository extends JpaRepository<ConsultaMedicamento, Long> {
    // Métodos personalizados si es necesario
}
