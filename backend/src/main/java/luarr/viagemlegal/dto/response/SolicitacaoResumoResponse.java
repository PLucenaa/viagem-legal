package luarr.viagemlegal.dto.response;

import luarr.viagemlegal.domain.enums.StatusSolicitacao;
import luarr.viagemlegal.domain.enums.TipoAutorizacao;

import java.time.Instant;

/**
 * Visão resumida para listagens/painel do analista.
 */
public record SolicitacaoResumoResponse(
        Long id,
        String protocolo,
        TipoAutorizacao tipoAutorizacao,
        StatusSolicitacao status,
        String requerenteNome,
        String menorNome,
        Instant criadoEm
) {
}
