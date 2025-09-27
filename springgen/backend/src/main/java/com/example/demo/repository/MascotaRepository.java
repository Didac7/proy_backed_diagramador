package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.Mascota;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Long> {
    // Métodos personalizados si es necesario
}
