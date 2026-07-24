package luarr.viagemlegal.service;

import luarr.viagemlegal.domain.enums.StatusSolicitacao;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

import static luarr.viagemlegal.domain.enums.StatusSolicitacao.AGUARDANDO_ASSINATURA;
import static luarr.viagemlegal.domain.enums.StatusSolicitacao.CONCLUIDA;
import static luarr.viagemlegal.domain.enums.StatusSolicitacao.DEFERIDA;
import static luarr.viagemlegal.domain.enums.StatusSolicitacao.EM_ANALISE;
import static luarr.viagemlegal.domain.enums.StatusSolicitacao.INDEFERIDA;
import static luarr.viagemlegal.domain.enums.StatusSolicitacao.PENDENTE_CORRECAO;
import static luarr.viagemlegal.domain.enums.StatusSolicitacao.RECEBIDA;

/**
 * Define as transições de status permitidas (máquina de estados).
 * Centraliza a regra para que o serviço não permita saltos inválidos.
 */
public final class TransicaoStatus {

    private static final Map<StatusSolicitacao, Set<StatusSolicitacao>> PERMITIDAS =
            new EnumMap<>(StatusSolicitacao.class);

    static {
        PERMITIDAS.put(RECEBIDA, EnumSet.of(EM_ANALISE));
        PERMITIDAS.put(EM_ANALISE, EnumSet.of(PENDENTE_CORRECAO, DEFERIDA, INDEFERIDA));
        // Após correção do cidadão, volta para análise.
        PERMITIDAS.put(PENDENTE_CORRECAO, EnumSet.of(EM_ANALISE));
        PERMITIDAS.put(DEFERIDA, EnumSet.of(AGUARDANDO_ASSINATURA));
        PERMITIDAS.put(AGUARDANDO_ASSINATURA, EnumSet.of(CONCLUIDA));
        // Estados finais.
        PERMITIDAS.put(INDEFERIDA, EnumSet.noneOf(StatusSolicitacao.class));
        PERMITIDAS.put(CONCLUIDA, EnumSet.noneOf(StatusSolicitacao.class));
    }

    private TransicaoStatus() {
    }

    public static boolean permitida(StatusSolicitacao de, StatusSolicitacao para) {
        return PERMITIDAS.getOrDefault(de, EnumSet.noneOf(StatusSolicitacao.class)).contains(para);
    }
}
