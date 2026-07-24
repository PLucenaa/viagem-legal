package luarr.viagemlegal.dto.request;

import jakarta.validation.constraints.NotNull;
import luarr.viagemlegal.domain.enums.StatusSolicitacao;

/**
 * Payload para o analista alterar o status de uma solicitação.
 * observacao é obrigatória para INDEFERIDA e PENDENTE_CORRECAO (validado no serviço).
 */
public record MudancaStatusRequest(
        @NotNull StatusSolicitacao novoStatus,
        String observacao
) {
}
