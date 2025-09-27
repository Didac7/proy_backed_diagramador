package com.example.demo.entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "ConsultaMedicamento")
@IdClass(com.example.demo.entity.ConsultaMedicamentoId.class)
public class ConsultaMedicamento implements Serializable {
    @Id
    @Column(name = "Consulta_idConsulta")
    private Long Consulta_idConsulta;
    @Id
    @Column(name = "Medicamento_idMedicamento")
    private Long Medicamento_idMedicamento;
    @Column(name = "PRIMARY")
    private String PRIMARY;
    @Column(name = "Medicamento_idMedicamento_")
    private String Medicamento_idMedicamento_;

    // Getters y Setters
    public Long getConsulta_idConsulta() { return Consulta_idConsulta; }
    public void setConsulta_idConsulta(Long Consulta_idConsulta) { this.Consulta_idConsulta = Consulta_idConsulta; }
    public Long getMedicamento_idMedicamento() { return Medicamento_idMedicamento; }
    public void setMedicamento_idMedicamento(Long Medicamento_idMedicamento) { this.Medicamento_idMedicamento = Medicamento_idMedicamento; }
    public String getPRIMARY() { return PRIMARY; }
    public void setPRIMARY(String PRIMARY) { this.PRIMARY = PRIMARY; }
    public String getMedicamento_idMedicamento_() { return Medicamento_idMedicamento_; }
    public void setMedicamento_idMedicamento_(String Medicamento_idMedicamento_) { this.Medicamento_idMedicamento_ = Medicamento_idMedicamento_; }
}

