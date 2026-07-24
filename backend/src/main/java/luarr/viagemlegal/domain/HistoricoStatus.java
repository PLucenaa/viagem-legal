package luarr.viagemlegal.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import luarr.viagemlegal.domain.enums.StatusSolicitacao;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * Trilha de auditoria: registra cada transição de status de uma solicitação,
 * quem a executou e quando. Fundamental para rastreabilidade jurídica.
 */
@Entity
@Table(name = "historico_status")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricoStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "solicitacao_id", nullable = false)
    private Solicitacao solicitacao;

    /** Null quando é o registro inicial (criação da solicitação). */
    @Enumerated(EnumType.STRING)
    private StatusSolicitacao statusAnterior;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusSolicitacao statusNovo;

    /** Keycloak "sub" de quem mudou. Null quando a ação partiu do cidadão. */
    private String analistaId;

    private String analistaNome;

    @Column(length = 2000)
    private String observacao;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant ocorridoEm;
}
