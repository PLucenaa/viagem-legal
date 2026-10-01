package luarr.viagemlegal.controller;

import jakarta.validation.Valid;
import luarr.viagemlegal.dto.request.KeycloakLoginRequest;
import luarr.viagemlegal.dto.request.KeycloakRefreshRequest;
import luarr.viagemlegal.dto.response.KeycloakLoginResponse;
import luarr.viagemlegal.service.auth.KeycloakTokenService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Login do painel interno via Keycloak: o frontend redireciona para o
 * Keycloak, recebe o code no callback e troca por tokens aqui.
 */
@RestController
@RequestMapping("/api/auth/keycloak")
public class AuthController {

    private final KeycloakTokenService keycloakTokenService;

    public AuthController(KeycloakTokenService keycloakTokenService) {
        this.keycloakTokenService = keycloakTokenService;
    }

    @PostMapping
    public KeycloakLoginResponse login(@Valid @RequestBody KeycloakLoginRequest request) {
        return keycloakTokenService.trocarCodigo(request.code(), request.redirectUri(), request.codeVerifier());
    }

    @PostMapping("/refresh")
    public KeycloakLoginResponse refresh(@Valid @RequestBody KeycloakRefreshRequest request) {
        return keycloakTokenService.renovar(request.refreshToken());
    }
}
