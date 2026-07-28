package luarr.viagemlegal.controller;

import jakarta.validation.Valid;
import luarr.viagemlegal.dto.request.TriagemRequest;
import luarr.viagemlegal.dto.response.TriagemResultadoResponse;
import luarr.viagemlegal.service.TriagemService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Triagem de viagem nacional — pode ser usada sem autenticação e sem
 * cadastro, antes de qualquer solicitação ser criada.
 */
@RestController
@RequestMapping("/api/triagem")
public class TriagemController {

    private final TriagemService service;

    public TriagemController(TriagemService service) {
        this.service = service;
    }

    @PostMapping
    public TriagemResultadoResponse avaliar(@Valid @RequestBody TriagemRequest request) {
        return service.avaliar(request);
    }
}
