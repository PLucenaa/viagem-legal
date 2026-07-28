package luarr.viagemlegal.service;

import luarr.viagemlegal.domain.enums.CaminhoTriagem;
import luarr.viagemlegal.dto.request.TriagemRequest;
import luarr.viagemlegal.dto.response.TriagemResultadoResponse;
import org.springframework.stereotype.Service;

import static luarr.viagemlegal.domain.enums.PassoTriagem.PASSO_1_IDADE;
import static luarr.viagemlegal.domain.enums.PassoTriagem.PASSO_2_ACOMPANHA_RESPONSAVEL;
import static luarr.viagemlegal.domain.enums.PassoTriagem.PASSO_3_DESTINO_COMARCA;
import static luarr.viagemlegal.domain.enums.PassoTriagem.PASSO_4B_PARENTESCO_COMPROVAVEL;
import static luarr.viagemlegal.domain.enums.PassoTriagem.PASSO_4_ACOMPANHA_PARENTE;
import static luarr.viagemlegal.domain.enums.PassoTriagem.PASSO_5_ACOMPANHA_AUTORIZADO;
import static luarr.viagemlegal.domain.enums.PassoTriagem.PASSO_6_1_PASSAPORTE_AUTORIZADO;
import static luarr.viagemlegal.domain.enums.PassoTriagem.PASSO_6_2_AUTORIZACAO_GENITOR;
import static luarr.viagemlegal.domain.enums.PassoTriagem.PASSO_6_DESACOMPANHADO;

/**
 * Motor de regras objetivas da triagem de viagem nacional — Resolução CNJ
 * nº 295/2019. Implementa, passo a passo, a árvore de decisão validada em
 * arvore_decisao_resolucao_cnj_295_2019.md. Sem inteligência artificial:
 * cada conclusão é rastreável até um artigo da Resolução.
 * <p>
 * Stateless: a cada chamada recebe todas as respostas já dadas até então e
 * devolve a próxima pergunta pendente, ou o caminho final assim que houver
 * dados suficientes para decidir (permite ao assistente perguntar uma coisa
 * de cada vez sem guardar estado no servidor).
 */
@Service
public class TriagemService {

    public TriagemResultadoResponse avaliar(TriagemRequest r) {
        if (r.maiorOuIgualDezesseisAnos() == null) {
            return TriagemResultadoResponse.pergunta(PASSO_1_IDADE,
                    "A pessoa possui 16 anos ou mais?");
        }
        if (r.maiorOuIgualDezesseisAnos()) {
            return dispensa("Art. 1º",
                    "Não é exigida autorização para viagem nacional de pessoa com 16 anos ou mais.");
        }

        if (r.viajaComPaiMaeOuResponsavelLegal() == null) {
            return TriagemResultadoResponse.pergunta(PASSO_2_ACOMPANHA_RESPONSAVEL,
                    "Viajará com o pai, a mãe ou o responsável legal?");
        }
        if (r.viajaComPaiMaeOuResponsavelLegal()) {
            return dispensa("Art. 1º",
                    "O acompanhamento por um dos pais ou pelo responsável legal dispensa a autorização.");
        }

        if (r.destinoComarcaContiguaOuMesmaRegiaoMetropolitana() == null) {
            return TriagemResultadoResponse.pergunta(PASSO_3_DESTINO_COMARCA,
                    "O destino é uma comarca contígua (mesmo estado) ou da mesma região metropolitana da comarca de residência?");
        }
        if (r.destinoComarcaContiguaOuMesmaRegiaoMetropolitana()) {
            return dispensa("Art. 2º, I",
                    "Viagem para comarca contígua ou da mesma região metropolitana dispensa a autorização.");
        }

        if (r.viajaComAscendenteOuColateralAteTerceiroGrau() == null) {
            return TriagemResultadoResponse.pergunta(PASSO_4_ACOMPANHA_PARENTE,
                    "Viajará com um ascendente (avô, avó, bisavô...) ou parente colateral maior de idade até o terceiro grau (irmão, tio...)?");
        }
        if (r.viajaComAscendenteOuColateralAteTerceiroGrau()) {
            if (r.parentescoComprovavelDocumentalmente() == null) {
                return TriagemResultadoResponse.pergunta(PASSO_4B_PARENTESCO_COMPROVAVEL,
                        "É possível comprovar documentalmente esse parentesco?");
            }
            if (r.parentescoComprovavelDocumentalmente()) {
                return dispensa("Art. 2º, II, a",
                        "Acompanhamento por ascendente ou colateral até o terceiro grau, com parentesco comprovado, dispensa a autorização.");
            }
        }

        if (r.viajaComPessoaAutorizadaPeloResponsavel() == null) {
            return TriagemResultadoResponse.pergunta(PASSO_5_ACOMPANHA_AUTORIZADO,
                    "Viajará com outra pessoa maior de idade, expressamente autorizada pelo pai, pela mãe ou pelo responsável?");
        }
        if (r.viajaComPessoaAutorizadaPeloResponsavel()) {
            return extrajudicial("Art. 2º, II, b",
                    "Acompanhamento por pessoa maior expressamente autorizada pelo responsável exige autorização extrajudicial (escritura pública ou documento particular com firma reconhecida).");
        }

        if (r.viajaDesacompanhado() == null) {
            return TriagemResultadoResponse.pergunta(PASSO_6_DESACOMPANHADO,
                    "Viajará desacompanhada de pessoa maior de idade?");
        }
        if (!r.viajaDesacompanhado()) {
            return unidadeCompetente(
                    "Nenhuma hipótese de dispensa ou de autorização extrajudicial se aplica: o caso segue para processamento pela unidade competente do TJRR.");
        }

        if (r.passaporteValidoComAutorizacaoParaExterior() == null) {
            return TriagemResultadoResponse.pergunta(PASSO_6_1_PASSAPORTE_AUTORIZADO,
                    "Possui passaporte válido com autorização expressa para viajar desacompanhada ao exterior?");
        }
        if (r.passaporteValidoComAutorizacaoParaExterior()) {
            return dispensa("Art. 2º, IV",
                    "Passaporte válido com autorização expressa para viagem desacompanhada ao exterior dispensa a autorização para o trânsito nacional.");
        }

        if (r.autorizacaoExpressaDeGenitorOuResponsavel() == null) {
            return TriagemResultadoResponse.pergunta(PASSO_6_2_AUTORIZACAO_GENITOR,
                    "Há autorização expressa de um dos genitores ou do responsável legal para viajar desacompanhada?");
        }
        if (r.autorizacaoExpressaDeGenitorOuResponsavel()) {
            return extrajudicial("Art. 2º, III",
                    "Autorização expressa de genitor ou responsável para viagem desacompanhada exige formalização por escritura pública ou documento particular com firma reconhecida.");
        }

        return unidadeCompetente(
                "Nenhuma hipótese de dispensa ou de autorização extrajudicial se aplica: o caso segue para processamento pela unidade competente do TJRR.");
    }

    private TriagemResultadoResponse dispensa(String fundamento, String mensagem) {
        return TriagemResultadoResponse.concluido(CaminhoTriagem.DISPENSA, fundamento, mensagem);
    }

    private TriagemResultadoResponse extrajudicial(String fundamento, String mensagem) {
        return TriagemResultadoResponse.concluido(CaminhoTriagem.EXTRAJUDICIAL, fundamento, mensagem);
    }

    private TriagemResultadoResponse unidadeCompetente(String mensagem) {
        return TriagemResultadoResponse.concluido(CaminhoTriagem.UNIDADE_COMPETENTE, "Art. 1º", mensagem);
    }
}
