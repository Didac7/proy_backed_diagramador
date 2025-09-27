package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.Pasajero;

@Repository
public interface PasajeroRepository extends JpaRepository<Pasajero, Long> {
    // Métodos personalizados si es necesario
}
