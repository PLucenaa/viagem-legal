package luarr.viagemlegal.mapper;

import luarr.viagemlegal.domain.Anexo;
import luarr.viagemlegal.domain.HistoricoStatus;
import luarr.viagemlegal.domain.Solicitacao;
import luarr.viagemlegal.domain.embeddable.DadosViagem;
import luarr.viagemlegal.domain.embeddable.Menor;
import luarr.viagemlegal.dto.request.DadosViagemRequest;
import luarr.viagemlegal.dto.request.MenorRequest;
import luarr.viagemlegal.dto.request.SolicitacaoRequest;
import luarr.viagemlegal.dto.response.AnexoResponse;
import luarr.viagemlegal.dto.response.ConsultaProtocoloResponse;
import luarr.viagemlegal.dto.response.HistoricoStatusResponse;
import luarr.viagemlegal.dto.response.SolicitacaoResponse;
import luarr.viagemlegal.dto.response.SolicitacaoResumoResponse;

import java.util.List;

/**
 * Conversão entre a entidade Solicitacao (e agregados) e seus DTOs.
 * Mapeamento manual — transparente e sem dependência de framework.
 */
public final class SolicitacaoMapper {

    private SolicitacaoMapper() {
    }

    /**
     * Constrói uma nova Solicitacao a partir do formulário. Não define id,
     * protocolo, status nem histórico — isso é responsabilidade do serviço.
     */
    public static Solicitacao toEntity(SolicitacaoRequest dto) {
        return Solicitacao.builder()
                .tipoAutorizacao(dto.tipoAutorizacao())
                .tipoResponsavel(dto.tipoResponsavel())
                .requerente(PessoaMapper.toEmbeddable(dto.requerente()))
                .responsavel(PessoaMapper.toEmbeddable(dto.responsavel()))
                .menor(toMenor(dto.menor()))
                .dadosViagem(toDadosViagem(dto.dadosViagem()))
                .build();
    }

    public static Menor toMenor(MenorRequest dto) {
        if (dto == null) {
            return null;
        }
        return Menor.builder()
                .nomeCompleto(dto.nomeCompleto())
                .dataNascimento(dto.dataNascimento())
                .sexo(dto.sexo())
                .naturalidade(dto.naturalidade())
                .tipoDocumento(dto.tipoDocumento())
                .numeroDocumento(dto.numeroDocumento())
                .orgaoExpedidor(dto.orgaoExpedidor())
                .dataExpedicao(dto.dataExpedicao())
                .build();
    }

    public static DadosViagem toDadosViagem(DadosViagemRequest dto) {
        if (dto == null) {
            return null;
        }
        return DadosViagem.builder()
                .destino(dto.destino())
                .dataIda(dto.dataIda())
                .dataVolta(dto.dataVolta())
                .meioTransporte(dto.meioTransporte())
                .validadeDias(dto.validadeDias())
                .build();
    }

    // --- Entidade -> Response ---

    public static SolicitacaoResponse toResponse(Solicitacao s) {
        return new SolicitacaoResponse(
                s.getId(),
                s.getProtocolo(),
                s.getTipoAutorizacao(),
                s.getStatus(),
                s.getTipoResponsavel(),
                s.getRequerente(),
                s.getMenor(),
                s.getResponsavel(),
                s.getDadosViagem(),
                s.getAnexos().stream().map(SolicitacaoMapper::toAnexoResponse).toList(),
                historicoOrdenado(s),
                s.getAnalistaNome(),
                s.getObservacaoAnalista(),
                s.getCriadoEm(),
                s.getAtualizadoEm()
        );
    }

    public static SolicitacaoResumoResponse toResumo(Solicitacao s) {
        return new SolicitacaoResumoResponse(
                s.getId(),
                s.getProtocolo(),
                s.getTipoAutorizacao(),
                s.getStatus(),
                s.getRequerente() != null ? s.getRequerente().getNomeCompleto() : null,
                s.getMenor() != null ? s.getMenor().getNomeCompleto() : null,
                s.getCriadoEm()
        );
    }

    public static ConsultaProtocoloResponse toConsultaProtocolo(Solicitacao s) {
        return new ConsultaProtocoloResponse(
                s.getProtocolo(),
                s.getTipoAutorizacao(),
                s.getStatus(),
                s.getMenor() != null ? s.getMenor().getNomeCompleto() : null,
                historicoOrdenado(s),
                s.getCriadoEm(),
                s.getAtualizadoEm()
        );
    }

    /** Histórico ordenado cronologicamente (as coleções são Set, sem ordem garantida). */
    private static List<HistoricoStatusResponse> historicoOrdenado(Solicitacao s) {
        return s.getHistorico().stream()
                .sorted(java.util.Comparator.comparing(
                        HistoricoStatus::getOcorridoEm,
                        java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder())))
                .map(SolicitacaoMapper::toHistoricoResponse)
                .toList();
    }

    public static AnexoResponse toAnexoResponse(Anexo a) {
        return new AnexoResponse(
                a.getId(),
                a.getTipo(),
                a.getNomeArquivo(),
                a.getContentType(),
                a.getTamanhoBytes(),
                a.getEnviadoEm()
        );
    }

    public static HistoricoStatusResponse toHistoricoResponse(HistoricoStatus h) {
        return new HistoricoStatusResponse(
                h.getStatusAnterior(),
                h.getStatusNovo(),
                h.getAnalistaNome(),
                h.getObservacao(),
                h.getOcorridoEm()
        );
    }
}
