package luarr.viagemlegal.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Converte o JWT do Keycloak em autenticação do Spring, transformando as
 * client roles (resource_access.&lt;client&gt;.roles) em authorities ROLE_*.
 * Aceita roles cadastradas tanto no client do frontend quanto no do backend.
 */
@Component
public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final List<String> clientIds;

    public KeycloakJwtAuthenticationConverter(KeycloakProperties keycloak) {
        this.clientIds = List.of(keycloak.frontendClientId(), keycloak.clientId());
    }

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        return new JwtAuthenticationToken(jwt, extrairAuthorities(jwt), jwt.getSubject());
    }

    public Collection<GrantedAuthority> extrairAuthorities(Jwt jwt) {
        Set<GrantedAuthority> authorities = new HashSet<>();
        Map<String, Object> resourceAccess = jwt.getClaimAsMap("resource_access");
        if (resourceAccess == null) {
            return authorities;
        }
        for (String clientId : clientIds) {
            if (resourceAccess.get(clientId) instanceof Map<?, ?> client
                    && client.get("roles") instanceof Collection<?> roles) {
                roles.forEach(role -> authorities.add(new SimpleGrantedAuthority("ROLE_" + role)));
            }
        }
        return authorities;
    }
}
