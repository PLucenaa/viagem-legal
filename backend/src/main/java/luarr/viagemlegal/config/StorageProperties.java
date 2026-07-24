package luarr.viagemlegal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Propriedades de armazenamento de anexos (app.storage.*).
 */
@ConfigurationProperties(prefix = "app.storage")
public record StorageProperties(String localPath) {
}
