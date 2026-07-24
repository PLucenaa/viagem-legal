package luarr.viagemlegal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import luarr.viagemlegal.domain.enums.Sexo;
import luarr.viagemlegal.domain.enums.TipoDocumento;

import java.time.LocalDate;

public record MenorRequest(
        @NotBlank String nomeCompleto,
        @NotNull @Past LocalDate dataNascimento,
        Sexo sexo,
        String naturalidade,
        @NotNull TipoDocumento tipoDocumento,
        @NotBlank String numeroDocumento,
        String orgaoExpedidor,
        LocalDate dataExpedicao
) {
}
