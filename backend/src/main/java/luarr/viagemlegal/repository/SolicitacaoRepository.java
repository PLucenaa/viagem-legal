package luarr.viagemlegal.repository;

import luarr.viagemlegal.domain.Solicitacao;
import luarr.viagemlegal.domain.enums.StatusSolicitacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    /** Consulta pública do cidadão pelo protocolo. */
    Optional<Solicitacao> findByProtocolo(String protocolo);

    /**
     * Carrega a solicitação com histórico e anexos já inicializados, para uso
     * fora da sessão (mapeamento para DTO). Evita LazyInitializationException.
     * As coleções vêm por subselect via distinct para não multiplicar linhas.
     */
    @Query("""
            select distinct s from Solicitacao s
            left join fetch s.historico
            left join fetch s.anexos
            where s.id = :id
            """)
    Optional<Solicitacao> findByIdComAgregados(Long id);

    @Query("""
            select distinct s from Solicitacao s
            left join fetch s.historico
            left join fetch s.anexos
            where s.protocolo = :protocolo
            """)
    Optional<Solicitacao> findByProtocoloComAgregados(String protocolo);

    boolean existsByProtocolo(String protocolo);

    /** Painel do analista — filtra por status. */
    Page<Solicitacao> findByStatus(StatusSolicitacao status, Pageable pageable);

    /** Solicitações atribuídas a um analista (Keycloak sub). */
    Page<Solicitacao> findByAnalistaId(String analistaId, Pageable pageable);
}
