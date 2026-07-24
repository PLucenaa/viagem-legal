package luarr.viagemlegal.domain.embeddable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Dados da viagem/hospedagem.
 * <p>
 * Para NACIONAL/INTERNACIONAL: destino e datas da viagem.
 * Para HOSPEDAGEM: destino representa o local/estabelecimento e
 * validadeDias indica por quantos dias a autorização vale a partir da emissão
 * (campo "Válida por ___ dias" do formulário de hospedagem).
 * <p>
 * Campos opcionais variam por tipo; a validação condicional fica no serviço.
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DadosViagem {

    @NotBlank
    @Column(name = "viagem_destino")
    private String destino;

    @NotNull
    @Column(name = "viagem_data_ida")
    private LocalDate dataIda;

    @Column(name = "viagem_data_volta")
    private LocalDate dataVolta;

    @Column(name = "viagem_meio_transporte")
    private String meioTransporte;

    /** Validade em dias a partir da emissão — usado na autorização de hospedagem. */
    @Column(name = "viagem_validade_dias")
    private Integer validadeDias;
}
