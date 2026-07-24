package luarr.viagemlegal.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import luarr.viagemlegal.domain.enums.TipoDocumento;

import java.time.LocalDate;

/**
 * Dados pessoais reutilizados para o requerente e para o responsável/acompanhante.
 * As obrigatoriedades específicas de cada papel são verificadas na camada de
 * serviço (o requerente exige mais campos; o responsável só existe em alguns casos).
 */
public record PessoaRequest(
        String nomeCompleto,
        String cpf,
        String nacionalidade,
        String estadoCivil,
        String profissao,
        TipoDocumento tipoDocumento,
        String numeroDocumento,
        String orgaoExpedidor,
        LocalDate dataExpedicao,
        String telefone,
        @Email String email,
        @Valid EnderecoRequest endereco
) {
}
