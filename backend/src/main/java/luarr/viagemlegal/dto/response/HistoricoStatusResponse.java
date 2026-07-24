package luarr.viagemlegal.dto.response;

import luarr.viagemlegal.domain.enums.StatusSolicitacao;

import java.time.Instant;

public record HistoricoStatusResponse(
        StatusSolicitacao statusAnterior,
        StatusSolicitacao statusNovo,
        String analistaNome,
        String observacao,
        Instant ocorridoEm
) {
}
