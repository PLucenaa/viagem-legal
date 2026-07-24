package luarr.viagemlegal.dto.request;

import jakarta.validation.constraints.NotBlank;

public record EnderecoRequest(
        @NotBlank String logradouro,
        String numero,
        String complemento,
        @NotBlank String bairro,
        @NotBlank String cidade,
        @NotBlank String uf,
        @NotBlank String cep
) {
}
