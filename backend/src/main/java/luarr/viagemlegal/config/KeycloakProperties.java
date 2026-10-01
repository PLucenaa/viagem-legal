package luarr.viagemlegal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuração do Keycloak próprio (app.keycloak.*).
 *
 * @param url              URL pública do Keycloak (sem /realms)
 * @param realm            nome do realm
 * @param clientId         client que precisa constar no "aud" dos tokens aceitos pela API
 * @param frontendClientId client público do navegador, onde ficam as roles ANALISTA/ADMIN
 */
@ConfigurationProperties(prefix = "app.keycloak")
public record KeycloakProperties(String url, String realm, String clientId, String frontendClientId) {

    public String issuer() {
        return url + "/realms/" + realm;
    }

    public String jwkSetUri() {
        return issuer() + "/protocol/openid-connect/certs";
    }

    public String tokenEndpoint() {
        return issuer() + "/protocol/openid-connect/token";
    }
}
