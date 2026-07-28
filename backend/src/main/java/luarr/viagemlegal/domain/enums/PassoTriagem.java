package luarr.viagemlegal.domain.enums;

/**
 * Passo pendente de resposta na árvore de decisão de viagem nacional.
 * Numeração alinhada a arvore_decisao_resolucao_cnj_295_2019.md.
 */
public enum PassoTriagem {
    PASSO_1_IDADE,
    PASSO_2_ACOMPANHA_RESPONSAVEL,
    PASSO_3_DESTINO_COMARCA,
    PASSO_4_ACOMPANHA_PARENTE,
    PASSO_4B_PARENTESCO_COMPROVAVEL,
    PASSO_5_ACOMPANHA_AUTORIZADO,
    PASSO_6_DESACOMPANHADO,
    PASSO_6_1_PASSAPORTE_AUTORIZADO,
    PASSO_6_2_AUTORIZACAO_GENITOR
}
