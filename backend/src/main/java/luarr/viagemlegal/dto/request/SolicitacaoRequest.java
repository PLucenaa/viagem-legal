package luarr.viagemlegal.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import luarr.viagemlegal.domain.enums.TipoAutorizacao;
import luarr.viagemlegal.domain.enums.TipoResponsavel;

/**
 * Payload do formulário público de solicitação.
 * Os anexos (arquivos) são enviados à parte, num endpoint multipart.
 */
public record SolicitacaoRequest(
        @NotNull TipoAutorizacao tipoAutorizacao,
        @NotNull TipoResponsavel tipoResponsavel,
        @Valid @NotNull PessoaRequest requerente,
        @Valid @NotNull MenorRequest menor,
        @Valid PessoaRequest responsavel,
        @Valid @NotNull DadosViagemRequest dadosViagem
) {
}
