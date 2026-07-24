package luarr.viagemlegal.dto.response;

import luarr.viagemlegal.domain.enums.TipoAnexo;

import java.time.Instant;

public record AnexoResponse(
        Long id,
        TipoAnexo tipo,
        String nomeArquivo,
        String contentType,
        Long tamanhoBytes,
        Instant enviadoEm
) {
}
