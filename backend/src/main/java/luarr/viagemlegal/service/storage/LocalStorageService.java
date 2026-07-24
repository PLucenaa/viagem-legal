package luarr.viagemlegal.service.storage;

import luarr.viagemlegal.config.StorageProperties;
import luarr.viagemlegal.exception.RegraNegocioException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Armazenamento em filesystem local. O caminho base vem de app.storage.local-path.
 */
@Service
public class LocalStorageService implements StorageService {

    private final Path base;

    public LocalStorageService(StorageProperties properties) {
        this.base = Paths.get(properties.localPath()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(base);
        } catch (IOException e) {
            throw new IllegalStateException("Não foi possível criar o diretório de storage: " + base, e);
        }
    }

    @Override
    public String armazenar(String subpasta, MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new RegraNegocioException("Arquivo vazio.");
        }
        try {
            Path pastaDestino = base.resolve(subpasta).normalize();
            // Impede path traversal (subpasta maliciosa saindo da base).
            if (!pastaDestino.startsWith(base)) {
                throw new RegraNegocioException("Caminho de destino inválido.");
            }
            Files.createDirectories(pastaDestino);

            String extensao = StringUtils.getFilenameExtension(arquivo.getOriginalFilename());
            String nome = UUID.randomUUID() + (extensao != null ? "." + extensao : "");
            Path destino = pastaDestino.resolve(nome);

            arquivo.transferTo(destino);
            return base.relativize(destino).toString().replace('\\', '/');
        } catch (IOException e) {
            throw new IllegalStateException("Falha ao armazenar arquivo.", e);
        }
    }
}
