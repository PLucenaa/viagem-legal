package luarr.viagemlegal.domain;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import luarr.viagemlegal.domain.embeddable.DadosViagem;
import luarr.viagemlegal.domain.embeddable.Menor;
import luarr.viagemlegal.domain.embeddable.Pessoa;
import luarr.viagemlegal.domain.enums.StatusSolicitacao;
import luarr.viagemlegal.domain.enums.TipoAutorizacao;
import luarr.viagemlegal.domain.enums.TipoResponsavel;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Solicitação de autorização de viagem/hospedagem de menor.
 * Entidade central do sistema.
 */
@Entity
@Table(name = "solicitacao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Protocolo público, usado pelo cidadão para consultar o andamento. */
    @Column(unique = true, nullable = false, updatable = false)
    private String protocolo;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TipoAutorizacao tipoAutorizacao;

    @NotNull
    @Enumerated(EnumType.STRING)
    private StatusSolicitacao status;

    /** Qualidade em que o requerente autoriza (PAI/MAE/TUTOR/GUARDIAO). */
    @NotNull
    @Enumerated(EnumType.STRING)
    private TipoResponsavel tipoResponsavel;

    /** Pai/mãe/tutor/guardião que solicita. Colunas prefixadas com "req_". */
    @Valid
    @NotNull
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "nomeCompleto",      column = @Column(name = "req_nome")),
            @AttributeOverride(name = "cpf",               column = @Column(name = "req_cpf")),
            @AttributeOverride(name = "nacionalidade",     column = @Column(name = "req_nacionalidade")),
            @AttributeOverride(name = "estadoCivil",       column = @Column(name = "req_estado_civil")),
            @AttributeOverride(name = "profissao",         column = @Column(name = "req_profissao")),
            @AttributeOverride(name = "tipoDocumento",     column = @Column(name = "req_tipo_documento")),
            @AttributeOverride(name = "numeroDocumento",   column = @Column(name = "req_numero_documento")),
            @AttributeOverride(name = "orgaoExpedidor",    column = @Column(name = "req_orgao_expedidor")),
            @AttributeOverride(name = "dataExpedicao",     column = @Column(name = "req_data_expedicao")),
            @AttributeOverride(name = "telefone",          column = @Column(name = "req_telefone")),
            @AttributeOverride(name = "email",             column = @Column(name = "req_email")),
            @AttributeOverride(name = "endereco.logradouro",  column = @Column(name = "req_logradouro")),
            @AttributeOverride(name = "endereco.numero",      column = @Column(name = "req_numero")),
            @AttributeOverride(name = "endereco.complemento", column = @Column(name = "req_complemento")),
            @AttributeOverride(name = "endereco.bairro",      column = @Column(name = "req_bairro")),
            @AttributeOverride(name = "endereco.cidade",      column = @Column(name = "req_cidade")),
            @AttributeOverride(name = "endereco.uf",          column = @Column(name = "req_uf")),
            @AttributeOverride(name = "endereco.cep",         column = @Column(name = "req_cep"))
    })
    private Pessoa requerente;

    @Valid
    @Embedded
    private Menor menor;

    /**
     * Responsável que acompanha o menor (acompanhante de viagem ou responsável
     * pela hospedagem). Opcional. Colunas prefixadas com "resp_".
     */
    @Valid
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "nomeCompleto",      column = @Column(name = "resp_nome")),
            @AttributeOverride(name = "cpf",               column = @Column(name = "resp_cpf")),
            @AttributeOverride(name = "nacionalidade",     column = @Column(name = "resp_nacionalidade")),
            @AttributeOverride(name = "estadoCivil",       column = @Column(name = "resp_estado_civil")),
            @AttributeOverride(name = "profissao",         column = @Column(name = "resp_profissao")),
            @AttributeOverride(name = "tipoDocumento",     column = @Column(name = "resp_tipo_documento")),
            @AttributeOverride(name = "numeroDocumento",   column = @Column(name = "resp_numero_documento")),
            @AttributeOverride(name = "orgaoExpedidor",    column = @Column(name = "resp_orgao_expedidor")),
            @AttributeOverride(name = "dataExpedicao",     column = @Column(name = "resp_data_expedicao")),
            @AttributeOverride(name = "telefone",          column = @Column(name = "resp_telefone")),
            @AttributeOverride(name = "email",             column = @Column(name = "resp_email")),
            @AttributeOverride(name = "endereco.logradouro",  column = @Column(name = "resp_logradouro")),
            @AttributeOverride(name = "endereco.numero",      column = @Column(name = "resp_numero")),
            @AttributeOverride(name = "endereco.complemento", column = @Column(name = "resp_complemento")),
            @AttributeOverride(name = "endereco.bairro",      column = @Column(name = "resp_bairro")),
            @AttributeOverride(name = "endereco.cidade",      column = @Column(name = "resp_cidade")),
            @AttributeOverride(name = "endereco.uf",          column = @Column(name = "resp_uf")),
            @AttributeOverride(name = "endereco.cep",         column = @Column(name = "resp_cep"))
    })
    private Pessoa responsavel;

    @Valid
    @Embedded
    private DadosViagem dadosViagem;

    // Set (não List) para permitir JOIN FETCH simultâneo das duas coleções
    // sem MultipleBagFetchException. A ordenação é aplicada no mapper.
    @OneToMany(mappedBy = "solicitacao", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Anexo> anexos = new LinkedHashSet<>();

    @OneToMany(mappedBy = "solicitacao", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<HistoricoStatus> historico = new LinkedHashSet<>();

    /** Identificador do analista no Keycloak (claim "sub"). Null enquanto não triado. */
    private String analistaId;

    /** Snapshot do nome do analista, preservado mesmo que ele saia do Keycloak. */
    private String analistaNome;

    /** Motivo de indeferimento ou instruções de correção. */
    @Column(length = 2000)
    private String observacaoAnalista;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant criadoEm;

    @UpdateTimestamp
    private Instant atualizadoEm;

    // --- Helpers de relacionamento (mantêm os dois lados sincronizados) ---

    public void addAnexo(Anexo anexo) {
        anexos.add(anexo);
        anexo.setSolicitacao(this);
    }

    public void addHistorico(HistoricoStatus registro) {
        historico.add(registro);
        registro.setSolicitacao(this);
    }
}
