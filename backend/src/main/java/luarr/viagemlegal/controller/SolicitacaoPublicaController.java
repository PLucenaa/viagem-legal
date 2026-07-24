package luarr.viagemlegal.controller;

import jakarta.validation.Valid;
import luarr.viagemlegal.domain.enums.TipoAnexo;
import luarr.viagemlegal.dto.request.SolicitacaoRequest;
import luarr.viagemlegal.dto.response.ConsultaProtocoloResponse;
import luarr.viagemlegal.dto.response.SolicitacaoResponse;
import luarr.viagemlegal.service.SolicitacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * Endpoints públicos usados pelo cidadão: criar solicitação, anexar documentos
 * e consultar o andamento pelo protocolo.
 */
@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoPublicaController {

    private final SolicitacaoService service;

    public SolicitacaoPublicaController(SolicitacaoService service) {
        this.service = service;
    }

    /** Cria a solicitação a partir do formulário. Retorna a visão completa com o protocolo. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SolicitacaoResponse criar(@Valid @RequestBody SolicitacaoRequest request) {
        return service.criar(request);
    }

    /** Anexa um documento/arquivo a uma solicitação existente. */
    @PostMapping(path = "/{id}/anexos", consumes = "multipart/form-data")
    public SolicitacaoResponse anexar(@PathVariable Long id,
                                      @RequestParam TipoAnexo tipo,
                                      @RequestParam("arquivo") MultipartFile arquivo) {
        return service.anexar(id, tipo, arquivo);
    }

    /** Consulta pública do andamento pelo protocolo (visão enxuta). */
    @GetMapping("/protocolo/{protocolo}")
    public ResponseEntity<ConsultaProtocoloResponse> consultarPorProtocolo(
            @PathVariable String protocolo) {
        return ResponseEntity.ok(service.consultarPorProtocolo(protocolo));
    }
}
