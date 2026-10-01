package luarr.viagemlegal.service.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import luarr.viagemlegal.config.KeycloakJwtAuthenticationConverter;
import luarr.viagemlegal.config.KeycloakProperties;
import luarr.viagemlegal.config.SecurityConfig;
import luarr.viagemlegal.dto.response.KeycloakLoginResponse;
import luarr.viagemlegal.exception.AcessoNegadoException;
import luarr.viagemlegal.exception.AutenticacaoException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.Set;

/**
 * Troca o authorization code (e o refresh token) por tokens no Keycloak.
 * <p>
 * O code é emitido para o client público do frontend (sem secret), protegido
 * por PKCE. Antes de devolver os tokens, confere se o usuário tem role de
 * acesso ao painel — quem não tem nem chega a ficar "logado" no app.
 */
@Slf4j
@Service
public class KeycloakTokenService {

    private static final Set<String> ROLES_PAINEL = Set.of(
            "ROLE_" + SecurityConfig.ROLE_ANALISTA, "ROLE_" + SecurityConfig.ROLE_ADMIN);

    private final KeycloakProperties keycloak;
    private final JwtDecoder jwtDecoder;
    private final KeycloakJwtAuthenticationConverter jwtConverter;
    private final RestClient restClient = RestClient.create();

    public KeycloakTokenService(KeycloakProperties keycloak, JwtDecoder jwtDecoder,
                                KeycloakJwtAuthenticationConverter jwtConverter) {
        this.keycloak = keycloak;
        this.jwtDecoder = jwtDecoder;
        this.jwtConverter = jwtConverter;
    }

    public KeycloakLoginResponse trocarCodigo(String code, String redirectUri, String codeVerifier) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("code", code);
        params.add("redirect_uri", redirectUri);
        params.add("client_id", keycloak.frontendClientId());
        if (codeVerifier != null && !codeVerifier.isBlank()) {
            params.add("code_verifier", codeVerifier);
        }
        return solicitarTokens(params, "Falha na autenticação com o Keycloak.");
    }

    public KeycloakLoginResponse renovar(String refreshToken) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "refresh_token");
        params.add("refresh_token", refreshToken);
        params.add("client_id", keycloak.frontendClientId());
        return solicitarTokens(params, "Sessão expirada. Entre novamente.");
    }

    private KeycloakLoginResponse solicitarTokens(MultiValueMap<String, String> params, String mensagemErro) {
        TokenResponse response;
        try {
            response = restClient.post()
                    .uri(keycloak.tokenEndpoint())
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(params)
                    .retrieve()
                    .body(TokenResponse.class);
        } catch (RestClientException e) {
            log.warn("Keycloak recusou a requisição de token: {}", e.getMessage());
            throw new AutenticacaoException(mensagemErro);
        }
        if (response == null || response.accessToken() == null) {
            throw new AutenticacaoException(mensagemErro);
        }

        validarRoles(response.accessToken());

        return new KeycloakLoginResponse(
                response.accessToken(),
                response.refreshToken(),
                response.expiresIn(),
                response.refreshExpiresIn(),
                response.idToken());
    }

    /** Decodifica o access token com as mesmas validações da API e exige role do painel. */
    private void validarRoles(String accessToken) {
        try {
            boolean temRole = jwtConverter.extrairAuthorities(jwtDecoder.decode(accessToken)).stream()
                    .anyMatch(a -> ROLES_PAINEL.contains(a.getAuthority()));
            if (!temRole) {
                throw new AcessoNegadoException(
                        "Seu usuário não possui permissão de acesso ao painel. "
                                + "Solicite ao administrador a concessão de acesso.");
            }
        } catch (JwtException e) {
            log.error("Token emitido pelo Keycloak não passou na validação da API: {}", e.getMessage());
            throw new AutenticacaoException("Token do Keycloak inválido para esta aplicação.");
        }
    }

    private record TokenResponse(
            @JsonProperty("access_token") String accessToken,
            @JsonProperty("refresh_token") String refreshToken,
            @JsonProperty("expires_in") Integer expiresIn,
            @JsonProperty("refresh_expires_in") Integer refreshExpiresIn,
            @JsonProperty("id_token") String idToken) {
    }
}
