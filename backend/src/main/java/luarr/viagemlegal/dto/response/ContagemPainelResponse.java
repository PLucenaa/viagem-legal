package luarr.viagemlegal.dto.response;

import luarr.viagemlegal.domain.enums.StatusSolicitacao;

import java.util.Map;

/**
 * Tamanho da fila por status (abas do painel) e quantos pedidos em aberto
 * estão com o analista logado.
 */
public record ContagemPainelResponse(
        Map<StatusSolicitacao, Long> porStatus,
        long minhasEmAberto,
        /** Pedidos que voltaram: correção pedida e documento novo enviado. */
        long correcoesRecebidas
) {
}
