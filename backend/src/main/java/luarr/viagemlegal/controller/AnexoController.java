package luarr.viagemlegal.controller;

import luarr.viagemlegal.domain.Anexo;
import luarr.viagemlegal.exception.SolicitacaoNaoEncontradaException;
import luarr.viagemlegal.repository.AnexoRepository;
import luarr.viagemlegal.service.storage.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Download do binário de um anexo (documento enviado pelo cidadão). */
@RestController
@RequestMapping("/api/anexos")
public class AnexoController {

    private final AnexoRepository repository;
    private final StorageService storageService;

    public AnexoController(AnexoRepository repository, StorageService storageService) {
        this.repository = repository;
        this.storageService = storageService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> baixar(@PathVariable Long id) {
        Anexo anexo = repository.findById(id)
                .orElseThrow(() -> new SolicitacaoNaoEncontradaException("Anexo não encontrado: " + id));

        Resource arquivo = storageService.carregar(anexo.getCaminho());

        MediaType contentType = anexo.getContentType() != null
                ? MediaType.parseMediaType(anexo.getContentType())
                : MediaType.APPLICATION_OCTET_STREAM;

        return ResponseEntity.ok()
                .contentType(contentType)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline().filename(anexo.getNomeArquivo()).build().toString())
                .body(arquivo);
    }
}
