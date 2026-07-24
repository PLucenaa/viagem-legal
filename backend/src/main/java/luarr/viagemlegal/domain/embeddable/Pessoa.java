package luarr.viagemlegal.domain.embeddable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import luarr.viagemlegal.domain.enums.TipoDocumento;

import java.time.LocalDate;

/**
 * Dados pessoais comuns aos formulários oficiais (requerente e responsável pela
 * hospedagem/acompanhante). Reutilizável via @Embedded com @AttributeOverrides
 * para dar prefixos de coluna distintos quando usada mais de uma vez na mesma tabela.
 * <p>
 * As colunas NÃO são declaradas nullable aqui: a obrigatoriedade depende do
 * papel (requerente é obrigatório; responsável de hospedagem só existe em alguns
 * casos), então é controlada por validação na camada de serviço/DTO.
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pessoa {

    @Column(name = "nome")
    private String nomeCompleto;

    @Column(name = "cpf")
    private String cpf;

    @Column(name = "nacionalidade")
    private String nacionalidade;

    @Column(name = "estado_civil")
    private String estadoCivil;

    @Column(name = "profissao")
    private String profissao;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento")
    private TipoDocumento tipoDocumento;

    @Column(name = "numero_documento")
    private String numeroDocumento;

    /** Órgão expedidor do documento (ex.: SSP/RR, DETRAN). */
    @Column(name = "orgao_expedidor")
    private String orgaoExpedidor;

    @Column(name = "data_expedicao")
    private LocalDate dataExpedicao;

    @Column(name = "telefone")
    private String telefone;

    @Column(name = "email")
    private String email;

    @Embedded
    private Endereco endereco;
}
