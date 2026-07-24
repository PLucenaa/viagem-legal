package luarr.viagemlegal.controller;

import jakarta.validation.Valid;
import luarr.viagemlegal.domain.enums.StatusSolicitacao;
import luarr.viagemlegal.dto.request.MudancaStatusRequest;
import luarr.viagemlegal.dto.response.SolicitacaoResponse;
import luarr.viagemlegal.dto.response.SolicitacaoResumoResponse;
import luarr.viagemlegal.service.SolicitacaoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoints do painel do analista: listar, ver detalhe e mudar status.
 * A identidade do analista virá do token do Keycloak (a integrar depois);
 * por ora os campos de auditoria são passados de forma neutra.
 */
@RestController
@RequestMapping("/api/analista/solicitacoes")
public class SolicitacaoAnalistaController {

    private final SolicitacaoService service;

    public SolicitacaoAnalistaController(SolicitacaoService service) {
        this.service = service;
    }

    /** Lista solicitações, opcionalmente filtrando por status. */
    @GetMapping
    public Page<SolicitacaoResumoResponse> listar(
            @RequestParam(required = false) StatusSolicitacao status,
            Pageable pageable) {
        return service.listar(status, pageable);
    }

    /** Detalhe completo de uma solicitação. */
    @GetMapping("/{id}")
    public SolicitacaoResponse detalhar(@PathVariable Long id) {
        return service.detalhar(id);
    }

    /** Aplica uma transição de status. */
    @PatchMapping("/{id}/status")
    public SolicitacaoResponse mudarStatus(@PathVariable Long id,
                                           @Valid @RequestBody MudancaStatusRequest request) {
        // TODO: extrair analistaId/analistaNome do JWT do Keycloak quando integrado.
        String analistaId = null;
        String analistaNome = null;
        return service.mudarStatus(
                id, request.novoStatus(), request.observacao(), analistaId, analistaNome);
    }
}
