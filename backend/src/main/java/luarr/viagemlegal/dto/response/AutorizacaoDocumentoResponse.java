package luarr.viagemlegal.dto.response;

import luarr.viagemlegal.domain.embeddable.DadosViagem;
import luarr.viagemlegal.domain.embeddable.Menor;
import luarr.viagemlegal.domain.embeddable.Pessoa;
import luarr.viagemlegal.domain.enums.StatusSolicitacao;
import luarr.viagemlegal.domain.enums.TipoAutorizacao;
import luarr.viagemlegal.domain.enums.TipoResponsavel;

import java.time.Instant;

/**
 * Dados para montar o documento de autorização já deferida — só disponível
 * quando o status for DEFERIDA, AGUARDANDO_ASSINATURA ou CONCLUIDA.
 * <p>
 * Ainda não é um documento oficial com assinatura/QR de autenticidade
 * (Fase 2) — só uma prévia gerada a partir dos dados já aprovados.
 */
public record AutorizacaoDocumentoResponse(
        String protocolo,
        TipoAutorizacao tipoAutorizacao,
        StatusSolicitacao status,
        TipoResponsavel tipoResponsavel,
        Pessoa requerente,
        Menor menor,
        Pessoa responsavel,
        DadosViagem dadosViagem,
        Instant deferidoEm
) {
}
