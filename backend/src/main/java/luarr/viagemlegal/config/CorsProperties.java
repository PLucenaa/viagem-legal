package luarr.viagemlegal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

/**
 * Origens liberadas para chamadas cross-origin (app.cors.allowed-origins).
 * Necessário porque frontend e backend são apps/domínios separados no Coolify.
 */
@ConfigurationProperties(prefix = "app.cors")
public record CorsProperties(List<String> allowedOrigins) {
}
