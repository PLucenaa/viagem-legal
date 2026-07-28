package luarr.viagemlegal.dto.request;

/**
 * Respostas acumuladas da triagem de viagem nacional (assistente digital).
 * <p>
 * Cada campo corresponde a uma pergunta da árvore de decisão
 * (arvore_decisao_resolucao_cnj_295_2019.md) e é preenchido conforme o
 * assistente avança. Campos além do passo atual ficam null — o serviço
 * responde qual é a próxima pergunta até ter dados suficientes para concluir.
 */
public record TriagemRequest(
        Boolean maiorOuIgualDezesseisAnos,
        Boolean viajaComPaiMaeOuResponsavelLegal,
        Boolean destinoComarcaContiguaOuMesmaRegiaoMetropolitana,
        Boolean viajaComAscendenteOuColateralAteTerceiroGrau,
        Boolean parentescoComprovavelDocumentalmente,
        Boolean viajaComPessoaAutorizadaPeloResponsavel,
        Boolean viajaDesacompanhado,
        Boolean passaporteValidoComAutorizacaoParaExterior,
        Boolean autorizacaoExpressaDeGenitorOuResponsavel
) {
}
