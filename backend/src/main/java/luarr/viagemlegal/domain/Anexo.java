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
import luarr.viagemlegal.domain.enums.TipoAnexo;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * Arquivo anexado a uma solicitação (documento, comprovante, selfie, etc.).
 * O binário fica no storage/disco; aqui guardamos apenas metadados e o caminho.
 */
@Entity
@Table(name = "anexo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Anexo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "solicitacao_id", nullable = false)
    private Solicitacao solicitacao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAnexo tipo;

    @Column(nullable = false)
    private String nomeArquivo;

    private String contentType;

    private Long tamanhoBytes;

    /** Caminho no storage (filesystem/S3). */
    @Column(nullable = false)
    private String caminho;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant enviadoEm;
}
