package luarr.viagemlegal.dto.response;

/** Tokens do Keycloak devolvidos ao frontend após login ou renovação. */
public record KeycloakLoginResponse(
        String accessToken,
        String refreshToken,
        Integer expiresIn,
        Integer refreshExpiresIn,
        String idToken) {
}
