package luarr.viagemlegal.dto.response;

import luarr.viagemlegal.domain.enums.StatusSolicitacao;
import luarr.viagemlegal.domain.enums.TipoAutorizacao;

import java.time.Instant;
import java.time.LocalDate;

/**
 * Visão resumida para o painel do analista — o suficiente pra triar a fila
 * sem abrir cada pedido (urgência da viagem, responsável, documentos).
 */
public record SolicitacaoResumoResponse(
        Long id,
        String protocolo,
        TipoAutorizacao tipoAutorizacao,
        StatusSolicitacao status,
        String requerenteNome,
        String menorNome,
        String destino,
        LocalDate dataIda,
        String analistaId,
        String analistaNome,
        int quantidadeAnexos,
        /** Cidadão enviou documento depois do pedido de correção. */
        boolean correcaoRecebida,
        Instant ultimoAnexoEm,
        Instant criadoEm,
        Instant atualizadoEm,
        Long versao
) {
}
