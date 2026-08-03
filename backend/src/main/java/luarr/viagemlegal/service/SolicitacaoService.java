package luarr.viagemlegal.service;

import luarr.viagemlegal.domain.Anexo;
import luarr.viagemlegal.domain.HistoricoStatus;
import luarr.viagemlegal.domain.Solicitacao;
import luarr.viagemlegal.domain.embeddable.Pessoa;
import luarr.viagemlegal.domain.enums.StatusSolicitacao;
import luarr.viagemlegal.domain.enums.TipoAnexo;
import luarr.viagemlegal.domain.enums.TipoAutorizacao;
import luarr.viagemlegal.domain.enums.TipoResponsavel;
import luarr.viagemlegal.dto.request.SolicitacaoRequest;
import luarr.viagemlegal.dto.response.AutorizacaoDocumentoResponse;
import luarr.viagemlegal.dto.response.ConsultaProtocoloResponse;
import luarr.viagemlegal.dto.response.SolicitacaoResponse;
import luarr.viagemlegal.dto.response.SolicitacaoResumoResponse;
import luarr.viagemlegal.exception.RegraNegocioException;
import luarr.viagemlegal.exception.SolicitacaoNaoEncontradaException;
import luarr.viagemlegal.mapper.SolicitacaoMapper;
import luarr.viagemlegal.repository.SolicitacaoRepository;
import luarr.viagemlegal.service.storage.StorageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Year;
import java.util.EnumSet;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Regras de negócio das solicitações de autorização.
 */
@Service
public class SolicitacaoService {

    private static final String CIDADE_ATENDIDA = "Boa Vista";
    private static final String UF_ATENDIDA = "RR";

    private final SolicitacaoRepository repository;
    private final StorageService storageService;

    public SolicitacaoService(SolicitacaoRepository repository, StorageService storageService) {
        this.repository = repository;
        this.storageService = storageService;
    }

    /**
     * Cria uma solicitação a partir do formulário público. Valida as regras
     * dependentes de tipo, gera protocolo e registra o histórico inicial.
     */
    @Transactional
    public SolicitacaoResponse criar(SolicitacaoRequest request) {
        Solicitacao solicitacao = SolicitacaoMapper.toEntity(request);

        validarResidencia(solicitacao);
        validarPorTipoResponsavel(solicitacao);
        validarPorTipoAutorizacao(solicitacao);

        solicitacao.setProtocolo(gerarProtocolo());
        solicitacao.setStatus(StatusSolicitacao.RECEBIDA);

        // Registro inicial do histórico (statusAnterior nulo = criação).
        solicitacao.addHistorico(HistoricoStatus.builder()
                .statusNovo(StatusSolicitacao.RECEBIDA)
                .observacao("Solicitação recebida.")
                .build());

        return SolicitacaoMapper.toResponse(repository.save(solicitacao));
    }

    /** Entidade crua, para uso interno dentro de uma transação. */
    private Solicitacao buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new SolicitacaoNaoEncontradaException(
                        "Solicitação não encontrada: " + id));
    }

    @Transactional(readOnly = true)
    public SolicitacaoResponse detalhar(Long id) {
        Solicitacao s = repository.findByIdComAgregados(id)
                .orElseThrow(() -> new SolicitacaoNaoEncontradaException(
                        "Solicitação não encontrada: " + id));
        return SolicitacaoMapper.toResponse(s);
    }

    @Transactional(readOnly = true)
    public ConsultaProtocoloResponse consultarPorProtocolo(String protocolo) {
        Solicitacao s = repository.findByProtocoloComAgregados(protocolo)
                .orElseThrow(() -> new SolicitacaoNaoEncontradaException(
                        "Solicitação não encontrada para o protocolo: " + protocolo));
        return SolicitacaoMapper.toConsultaProtocolo(s);
    }

    private static final EnumSet<StatusSolicitacao> STATUS_COM_AUTORIZACAO_EMITIDA = EnumSet.of(
            StatusSolicitacao.DEFERIDA,
            StatusSolicitacao.AGUARDANDO_ASSINATURA,
            StatusSolicitacao.CONCLUIDA);

    /**
     * Monta o documento da autorização já deferida. Só disponível a partir de
     * DEFERIDA — ainda sem assinatura/QR de autenticidade (isso é Fase 2).
     */
    @Transactional(readOnly = true)
    public AutorizacaoDocumentoResponse gerarAutorizacao(String protocolo) {
        Solicitacao s = repository.findByProtocoloComAgregados(protocolo)
                .orElseThrow(() -> new SolicitacaoNaoEncontradaException(
                        "Solicitação não encontrada para o protocolo: " + protocolo));
        if (!STATUS_COM_AUTORIZACAO_EMITIDA.contains(s.getStatus())) {
            throw new RegraNegocioException(
                    "A autorização ainda não foi deferida para esta solicitação.");
        }
        return SolicitacaoMapper.toAutorizacaoDocumento(s);
    }

    @Transactional(readOnly = true)
    public Page<SolicitacaoResumoResponse> listar(StatusSolicitacao status, Pageable pageable) {
        Page<Solicitacao> page = status == null
                ? repository.findAll(pageable)
                : repository.findByStatus(status, pageable);
        return page.map(SolicitacaoMapper::toResumo);
    }

    /**
     * Aplica uma transição de status validada, registrando quem fez e o motivo.
     *
     * @param analistaId   Keycloak sub (pode ser nulo se a ação partir do cidadão)
     * @param analistaNome nome para snapshot no histórico
     */
    @Transactional
    public SolicitacaoResponse mudarStatus(Long id, StatusSolicitacao novoStatus,
                                           String observacao, String analistaId, String analistaNome) {
        Solicitacao solicitacao = buscarEntidade(id);
        StatusSolicitacao atual = solicitacao.getStatus();

        if (!TransicaoStatus.permitida(atual, novoStatus)) {
            throw new RegraNegocioException(
                    "Transição de status inválida: " + atual + " -> " + novoStatus);
        }
        if ((novoStatus == StatusSolicitacao.INDEFERIDA
                || novoStatus == StatusSolicitacao.PENDENTE_CORRECAO)
                && (observacao == null || observacao.isBlank())) {
            throw new RegraNegocioException(
                    "Observação é obrigatória ao indeferir ou solicitar correção.");
        }

        solicitacao.setStatus(novoStatus);
        if (analistaId != null) {
            solicitacao.setAnalistaId(analistaId);
            solicitacao.setAnalistaNome(analistaNome);
        }
        if (novoStatus == StatusSolicitacao.INDEFERIDA
                || novoStatus == StatusSolicitacao.PENDENTE_CORRECAO) {
            solicitacao.setObservacaoAnalista(observacao);
        }

        solicitacao.addHistorico(HistoricoStatus.builder()
                .statusAnterior(atual)
                .statusNovo(novoStatus)
                .analistaId(analistaId)
                .analistaNome(analistaNome)
                .observacao(observacao)
                .build());

        return SolicitacaoMapper.toResponse(repository.save(solicitacao));
    }

    /**
     * Anexa um arquivo a uma solicitação, gravando-o no storage.
     */
    @Transactional
    public SolicitacaoResponse anexar(Long id, TipoAnexo tipo, MultipartFile arquivo) {
        Solicitacao solicitacao = buscarEntidade(id);

        String caminho = storageService.armazenar(solicitacao.getProtocolo(), arquivo);

        solicitacao.addAnexo(Anexo.builder()
                .tipo(tipo)
                .nomeArquivo(arquivo.getOriginalFilename())
                .contentType(arquivo.getContentType())
                .tamanhoBytes(arquivo.getSize())
                .caminho(caminho)
                .build());

        return SolicitacaoMapper.toResponse(repository.save(solicitacao));
    }

    /** Igual a {@link #anexar}, mas para o fluxo público que só conhece o protocolo. */
    @Transactional
    public ConsultaProtocoloResponse anexarPorProtocolo(String protocolo, TipoAnexo tipo, MultipartFile arquivo) {
        Solicitacao solicitacao = repository.findByProtocolo(protocolo)
                .orElseThrow(() -> new SolicitacaoNaoEncontradaException(
                        "Solicitação não encontrada para o protocolo: " + protocolo));
        anexar(solicitacao.getId(), tipo, arquivo);
        return consultarPorProtocolo(protocolo);
    }

    // --- Validações de negócio ---

    private void validarResidencia(Solicitacao s) {
        Pessoa req = s.getRequerente();
        if (req == null || req.getEndereco() == null) {
            throw new RegraNegocioException("Endereço do requerente é obrigatório.");
        }
        String cidade = req.getEndereco().getCidade();
        String uf = req.getEndereco().getUf();
        boolean atendido = CIDADE_ATENDIDA.equalsIgnoreCase(trim(cidade))
                && UF_ATENDIDA.equalsIgnoreCase(trim(uf));
        if (!atendido) {
            throw new RegraNegocioException(
                    "O serviço atende apenas residentes em Boa Vista/RR.");
        }
    }

    private void validarPorTipoResponsavel(Solicitacao s) {
        // Tutor/guardião deve anexar o termo de guarda/tutela — os anexos são
        // enviados depois; aqui garantimos ao menos que o tipo é coerente.
        TipoResponsavel tipo = s.getTipoResponsavel();
        if (tipo == null) {
            throw new RegraNegocioException("Tipo de responsável é obrigatório.");
        }
    }

    private void validarPorTipoAutorizacao(Solicitacao s) {
        TipoAutorizacao tipo = s.getTipoAutorizacao();
        if (tipo == TipoAutorizacao.HOSPEDAGEM) {
            if (s.getResponsavel() == null || isBlank(s.getResponsavel().getNomeCompleto())) {
                throw new RegraNegocioException(
                        "Autorização de hospedagem exige os dados do responsável pela hospedagem.");
            }
            if (s.getDadosViagem() == null || s.getDadosViagem().getValidadeDias() == null) {
                throw new RegraNegocioException(
                        "Autorização de hospedagem exige o prazo de validade (dias).");
            }
        }
    }

    /**
     * Protocolo no formato VL-AAAA-XXXXXX (ano + 6 dígitos), garantidamente único.
     */
    private String gerarProtocolo() {
        String protocolo;
        do {
            int aleatorio = ThreadLocalRandom.current().nextInt(0, 1_000_000);
            protocolo = String.format("VL-%d-%06d", Year.now().getValue(), aleatorio);
        } while (repository.existsByProtocolo(protocolo));
        return protocolo;
    }

    private static String trim(String v) {
        return v == null ? null : v.trim();
    }

    private static boolean isBlank(String v) {
        return v == null || v.isBlank();
    }
}
