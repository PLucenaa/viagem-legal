package luarr.viagemlegal.dto.response;

import luarr.viagemlegal.domain.embeddable.DadosViagem;
import luarr.viagemlegal.domain.embeddable.Menor;
import luarr.viagemlegal.domain.embeddable.Pessoa;
import luarr.viagemlegal.domain.enums.StatusSolicitacao;
import luarr.viagemlegal.domain.enums.TipoAutorizacao;
import luarr.viagemlegal.domain.enums.TipoResponsavel;

import java.time.Instant;
import java.util.List;

/**
 * Visão completa de uma solicitação — usada pelo analista.
 */
public record SolicitacaoResponse(
        Long id,
        String protocolo,
        TipoAutorizacao tipoAutorizacao,
        StatusSolicitacao status,
        TipoResponsavel tipoResponsavel,
        Pessoa requerente,
        Menor menor,
        Pessoa responsavel,
        DadosViagem dadosViagem,
        List<AnexoResponse> anexos,
        List<HistoricoStatusResponse> historico,
        String analistaNome,
        String observacaoAnalista,
        Instant criadoEm,
        Instant atualizadoEm
) {
}
