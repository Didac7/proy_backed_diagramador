package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.ConductorVehiculo;

@Repository
public interface ConductorVehiculoRepository extends JpaRepository<ConductorVehiculo, Long> {
    // Métodos personalizados si es necesario
}
