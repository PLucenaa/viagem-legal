package luarr.viagemlegal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimNames;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Segurança da API: endpoints do cidadão são públicos; o painel do analista
 * (/api/analista/**) exige token do Keycloak com role ANALISTA ou ADMIN.
 * <p>
 * CORS é necessário porque frontend e backend rodam em domínios separados
 * (apps distintos no Coolify) — sem isso o navegador bloqueia as chamadas.
 */
@Configuration
public class SecurityConfig {

    public static final String ROLE_ANALISTA = "ANALISTA";
    public static final String ROLE_ADMIN = "ADMIN";

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           CorsConfigurationSource corsConfigurationSource,
                                           JwtDecoder jwtDecoder,
                                           KeycloakJwtAuthenticationConverter jwtConverter) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Página de erro do Spring: sem isso, qualquer erro vira 401.
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/api/auth/keycloak", "/api/auth/keycloak/refresh").permitAll()
                        .requestMatchers("/api/analista/**").hasAnyRole(ROLE_ANALISTA, ROLE_ADMIN)
                        // Fluxo do cidadão (triagem, solicitação, acompanhamento por protocolo, anexos).
                        .requestMatchers("/api/triagem/**", "/api/solicitacoes/**", "/api/anexos/**").permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(jwtDecoder)
                                .jwtAuthenticationConverter(jwtConverter)));
        return http.build();
    }

    /**
     * Valida assinatura (JWKS do realm), expiração, issuer e audience.
     * O decoder busca as chaves só na primeira requisição, então a API sobe
     * mesmo com o Keycloak fora do ar.
     */
    @Bean
    public JwtDecoder jwtDecoder(KeycloakProperties keycloak) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(keycloak.jwkSetUri()).build();

        OAuth2TokenValidator<Jwt> audienceValidator = new JwtClaimValidator<List<String>>(
                JwtClaimNames.AUD, aud -> aud != null && aud.contains(keycloak.clientId()));

        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(keycloak.issuer()), audienceValidator));
        return decoder;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(CorsProperties corsProperties) {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(corsProperties.allowedOrigins());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
