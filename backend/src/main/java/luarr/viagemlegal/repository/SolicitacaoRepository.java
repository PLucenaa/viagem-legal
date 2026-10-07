package luarr.viagemlegal.repository;

import luarr.viagemlegal.domain.Solicitacao;
import luarr.viagemlegal.domain.enums.StatusSolicitacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;
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

    /**
     * Fila do painel. Sem parâmetros nulos de propósito (o Postgres não
     * infere o tipo de "? is null"): a lista de status vem sempre preenchida,
     * a busca vem como "%" quando vazia e "apenasMinhas" liga o filtro de
     * responsável. A ordenação vem no Pageable (ver SolicitacaoService).
     */
    @Query("""
            select s from Solicitacao s
            where s.status in :statuses
              and (:apenasMinhas = false or s.analistaId = :analistaId)
              and (lower(s.protocolo) like :busca
                   or lower(s.requerente.nomeCompleto) like :busca
                   or lower(s.menor.nomeCompleto) like :busca)
            """)
    Page<Solicitacao> buscarPainel(Collection<StatusSolicitacao> statuses,
                                   boolean apenasMinhas,
                                   String analistaId,
                                   String busca,
                                   Pageable pageable);

    /** Tamanho da fila por status, numa consulta só (abas do painel). */
    @Query("select s.status, count(s) from Solicitacao s group by s.status")
    List<Object[]> contarPorStatus();

    /**
     * Carrega a solicitação pra anexar documento forçando o incremento da
     * versão no commit: um anexo novo não altera a linha da solicitação, então
     * o @Version sozinho não perceberia — e um analista com a tela antiga
     * poderia decidir sem ver o documento.
     */
    @Lock(LockModeType.OPTIMISTIC_FORCE_INCREMENT)
    @Query("select s from Solicitacao s where s.id = :id")
    Optional<Solicitacao> findByIdParaAnexar(Long id);

    /** Pedidos em correção que já receberam documento novo (ver Solicitacao.isCorrecaoRecebida). */
    @Query("""
            select count(s) from Solicitacao s
            where s.status = :status
              and (select max(a.enviadoEm) from Anexo a where a.solicitacao = s)
                > (select max(h.ocorridoEm) from HistoricoStatus h where h.solicitacao = s)
            """)
    long contarCorrecoesRecebidas(StatusSolicitacao status);

    long countByAnalistaIdAndStatusIn(String analistaId, Collection<StatusSolicitacao> statuses);

    /** Solicitações atribuídas a um analista (Keycloak sub). */
    Page<Solicitacao> findByAnalistaId(String analistaId, Pageable pageable);
}
