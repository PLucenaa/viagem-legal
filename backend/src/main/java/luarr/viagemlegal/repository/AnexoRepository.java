package luarr.viagemlegal.repository;

import luarr.viagemlegal.domain.Anexo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnexoRepository extends JpaRepository<Anexo, Long> {

    List<Anexo> findBySolicitacaoId(Long solicitacaoId);
}
