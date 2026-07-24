package luarr.viagemlegal.repository;

import luarr.viagemlegal.domain.HistoricoStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoricoStatusRepository extends JpaRepository<HistoricoStatus, Long> {

    List<HistoricoStatus> findBySolicitacaoIdOrderByOcorridoEmAsc(Long solicitacaoId);
}
