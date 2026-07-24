package luarr.viagemlegal.domain.embeddable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import luarr.viagemlegal.domain.enums.Sexo;
import luarr.viagemlegal.domain.enums.TipoDocumento;

import java.time.LocalDate;

/**
 * Criança ou adolescente que vai viajar / se hospedar.
 * Campos alinhados aos formulários oficiais (inclui sexo e naturalidade,
 * exigidos no formulário de viagem internacional do CNJ).
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Menor {

    @NotBlank
    @Column(name = "menor_nome")
    private String nomeCompleto;

    @NotNull
    @Past
    @Column(name = "menor_data_nascimento")
    private LocalDate dataNascimento;

    /** Sexo — exigido no formulário internacional. Opcional nos demais. */
    @Enumerated(EnumType.STRING)
    @Column(name = "menor_sexo")
    private Sexo sexo;

    /** Naturalidade ("natural de") — exigida no formulário internacional. */
    @Column(name = "menor_naturalidade")
    private String naturalidade;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "menor_tipo_documento")
    private TipoDocumento tipoDocumento;

    @NotBlank
    @Column(name = "menor_numero_documento")
    private String numeroDocumento;

    @Column(name = "menor_orgao_expedidor")
    private String orgaoExpedidor;

    @Column(name = "menor_data_expedicao")
    private LocalDate dataExpedicao;
}
