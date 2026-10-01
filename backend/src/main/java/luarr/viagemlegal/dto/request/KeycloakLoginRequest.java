package luarr.viagemlegal.dto.request;

import jakarta.validation.constraints.NotBlank;

/** Authorization code recebido pelo frontend no retorno do Keycloak. */
public record KeycloakLoginRequest(
        @NotBlank String code,
        @NotBlank String redirectUri,
        String codeVerifier) {
}
