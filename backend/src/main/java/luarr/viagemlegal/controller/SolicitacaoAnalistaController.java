package luarr.viagemlegal.controller;

import jakarta.validation.Valid;
import luarr.viagemlegal.domain.enums.StatusSolicitacao;
import luarr.viagemlegal.dto.request.AssumirRequest;
import luarr.viagemlegal.dto.request.MudancaStatusRequest;
import luarr.viagemlegal.dto.response.ContagemPainelResponse;
import luarr.viagemlegal.dto.response.SolicitacaoResponse;
import luarr.viagemlegal.dto.response.SolicitacaoResumoResponse;
import luarr.viagemlegal.service.SolicitacaoService;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Endpoints do painel do analista: fila, contagens, detalhe, assumir e
 * mudar status. Exigem token do Keycloak com role ANALISTA ou ADMIN (ver
 * SecurityConfig); a identidade do analista vem do próprio token.
 */
@RestController
@RequestMapping("/api/analista/solicitacoes")
public class SolicitacaoAnalistaController {

    private final SolicitacaoService service;

    public SolicitacaoAnalistaController(SolicitacaoService service) {
        this.service = service;
    }

    /**
     * Fila do painel.
     *
     * @param status  um ou mais status (?status=RECEBIDA&status=EM_ANALISE); vazio = todos
     * @param busca   protocolo ou nome do requerente/menor
     * @param minhas  true = só os pedidos em que o analista logado é o responsável
     */
    @GetMapping
    public Page<SolicitacaoResumoResponse> listar(
            @RequestParam(required = false) List<StatusSolicitacao> status,
            @RequestParam(required = false) String busca,
            @RequestParam(defaultValue = "false") boolean minhas,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "24") int size,
            @AuthenticationPrincipal Jwt jwt) {
        return service.listarPainel(status, busca, minhas ? jwt.getSubject() : null, page, size);
    }

    /** Tamanho de cada fila (abas) e quantos pedidos em aberto são do analista. */
    @GetMapping("/contagem")
    public ContagemPainelResponse contagem(@AuthenticationPrincipal Jwt jwt) {
        return service.contarPainel(jwt.getSubject());
    }

    /** Detalhe completo de uma solicitação. */
    @GetMapping("/{id}")
    public SolicitacaoResponse detalhar(@PathVariable Long id) {
        return service.detalhar(id);
    }

    /** O analista logado assume o pedido (Recebida → Em análise). */
    @PostMapping("/{id}/assumir")
    public SolicitacaoResponse assumir(@PathVariable Long id,
                                       @RequestBody(required = false) AssumirRequest request,
                                       @AuthenticationPrincipal Jwt jwt) {
        return service.assumir(id, request != null ? request.versao() : null,
                jwt.getSubject(), nomeDoAnalista(jwt));
    }

    /** Aplica uma transição de status. */
    @PatchMapping("/{id}/status")
    public SolicitacaoResponse mudarStatus(@PathVariable Long id,
                                           @Valid @RequestBody MudancaStatusRequest request,
                                           @AuthenticationPrincipal Jwt jwt) {
        return service.mudarStatus(id, request.novoStatus(), request.observacao(), request.versao(),
                jwt.getSubject(), nomeDoAnalista(jwt));
    }

    private static String nomeDoAnalista(Jwt jwt) {
        String nome = jwt.getClaimAsString("name");
        return nome == null || nome.isBlank() ? jwt.getClaimAsString("preferred_username") : nome;
    }
}
