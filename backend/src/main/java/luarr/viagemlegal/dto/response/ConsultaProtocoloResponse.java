package luarr.viagemlegal.dto.response;

import luarr.viagemlegal.domain.enums.StatusSolicitacao;
import luarr.viagemlegal.domain.enums.TipoAutorizacao;

import java.time.Instant;
import java.util.List;

/**
 * Resposta pública da consulta por protocolo — o que o cidadão vê ao
 * acompanhar o andamento. Sem dados sensíveis de terceiros nem anexos.
 */
public record ConsultaProtocoloResponse(
        String protocolo,
        TipoAutorizacao tipoAutorizacao,
        StatusSolicitacao status,
        String menorNome,
        List<HistoricoStatusResponse> historico,
        Instant criadoEm,
        Instant atualizadoEm
) {
}
