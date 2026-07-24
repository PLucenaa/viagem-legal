package luarr.viagemlegal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuração de segurança PROVISÓRIA para desenvolvimento.
 * <p>
 * Libera todos os endpoints e desativa CSRF para permitir testar a API sem
 * autenticação. Será substituída pela integração com o Keycloak (OAuth2
 * Resource Server), quando os endpoints /api/analista/** passarão a exigir token.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }
}
