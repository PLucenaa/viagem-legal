package luarr.viagemlegal.dto.request;

import jakarta.validation.constraints.NotBlank;

public record KeycloakRefreshRequest(@NotBlank String refreshToken) {
}
