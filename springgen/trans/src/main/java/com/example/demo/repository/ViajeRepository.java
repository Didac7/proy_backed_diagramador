package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.Viaje;

@Repository
public interface ViajeRepository extends JpaRepository<Viaje, Long> {
    // Métodos personalizados si es necesario
}
