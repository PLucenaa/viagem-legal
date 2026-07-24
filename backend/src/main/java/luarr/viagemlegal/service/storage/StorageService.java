package luarr.viagemlegal.service.storage;

import org.springframework.web.multipart.MultipartFile;

/**
 * Abstração de armazenamento de arquivos. A implementação atual grava em disco;
 * pode ser trocada por S3 no futuro sem afetar o serviço.
 */
public interface StorageService {

    /**
     * Armazena o arquivo e devolve o caminho/identificador para recuperá-lo depois.
     *
     * @param subpasta agrupamento lógico (ex.: protocolo da solicitação)
     * @param arquivo  arquivo enviado
     * @return caminho relativo do arquivo armazenado
     */
    String armazenar(String subpasta, MultipartFile arquivo);
}
