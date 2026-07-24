package luarr.viagemlegal.domain.enums;

/**
 * Fluxo de status de uma solicitação de autorização.
 * <p>
 * RECEBIDA            → cidadão enviou, aguardando triagem.
 * EM_ANALISE          → analista está avaliando os documentos.
 * PENDENTE_CORRECAO   → devolvida ao cidadão para corrigir/complementar dados ou anexos.
 * DEFERIDA            → aprovada pelo analista.
 * INDEFERIDA          → negada (motivo em observacaoAnalista).
 * AGUARDANDO_ASSINATURA → documento gerado, enviado ao SEI para assinatura do juiz.
 * CONCLUIDA           → assinado e disponibilizado ao cidadão.
 */
public enum StatusSolicitacao {
    RECEBIDA,
    EM_ANALISE,
    PENDENTE_CORRECAO,
    DEFERIDA,
    INDEFERIDA,
    AGUARDANDO_ASSINATURA,
    CONCLUIDA
}
