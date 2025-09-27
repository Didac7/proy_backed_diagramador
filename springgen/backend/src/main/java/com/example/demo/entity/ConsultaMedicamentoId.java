package com.example.demo.entity;

import java.io.Serializable;
import java.util.Objects;

public class ConsultaMedicamentoId implements Serializable {
    private Long Consulta_idConsulta;
    private Long Medicamento_idMedicamento;

    // Getters y Setters
    public Long getConsulta_idConsulta() { return Consulta_idConsulta; }
    public void setConsulta_idConsulta(Long Consulta_idConsulta) { this.Consulta_idConsulta = Consulta_idConsulta; }
    public Long getMedicamento_idMedicamento() { return Medicamento_idMedicamento; }
    public void setMedicamento_idMedicamento(Long Medicamento_idMedicamento) { this.Medicamento_idMedicamento = Medicamento_idMedicamento; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ConsultaMedicamentoId that = (ConsultaMedicamentoId) o;
        return (
            Objects.equals(Consulta_idConsulta, that.Consulta_idConsulta) && 
            Objects.equals(Medicamento_idMedicamento, that.Medicamento_idMedicamento)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            Consulta_idConsulta, 
            Medicamento_idMedicamento
        );
    }
}
