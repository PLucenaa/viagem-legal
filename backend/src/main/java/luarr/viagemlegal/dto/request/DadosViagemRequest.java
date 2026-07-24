package luarr.viagemlegal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DadosViagemRequest(
        @NotBlank String destino,
        @NotNull LocalDate dataIda,
        LocalDate dataVolta,
        String meioTransporte,
        Integer validadeDias
) {
}
