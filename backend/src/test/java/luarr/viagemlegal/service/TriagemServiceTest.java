package luarr.viagemlegal.service;

import luarr.viagemlegal.domain.enums.CaminhoTriagem;
import luarr.viagemlegal.domain.enums.PassoTriagem;
import luarr.viagemlegal.dto.request.TriagemRequest;
import luarr.viagemlegal.dto.response.TriagemResultadoResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TriagemServiceTest {

    private final TriagemService service = new TriagemService();

    private TriagemRequest req(Boolean p1, Boolean p2, Boolean p3, Boolean p4, Boolean p4b,
                                Boolean p5, Boolean p6, Boolean p61, Boolean p62) {
        return new TriagemRequest(p1, p2, p3, p4, p4b, p5, p6, p61, p62);
    }

    @Test
    void semRespostas_perguntaPasso1() {
        var resultado = service.avaliar(req(null, null, null, null, null, null, null, null, null));
        assertFalse(resultado.concluido());
        assertEquals(PassoTriagem.PASSO_1_IDADE, resultado.proximoPasso());
    }

    @Test
    void maiorDeDezesseisAnos_dispensa() {
        var resultado = service.avaliar(req(true, null, null, null, null, null, null, null, null));
        assertConcluido(resultado, CaminhoTriagem.DISPENSA);
    }

    @Test
    void menorDeDezesseis_semResposta2_perguntaPasso2() {
        var resultado = service.avaliar(req(false, null, null, null, null, null, null, null, null));
        assertFalse(resultado.concluido());
        assertEquals(PassoTriagem.PASSO_2_ACOMPANHA_RESPONSAVEL, resultado.proximoPasso());
    }

    @Test
    void viajaComResponsavelLegal_dispensa() {
        var resultado = service.avaliar(req(false, true, null, null, null, null, null, null, null));
        assertConcluido(resultado, CaminhoTriagem.DISPENSA);
    }

    @Test
    void destinoComarcaContigua_dispensa() {
        var resultado = service.avaliar(req(false, false, true, null, null, null, null, null, null));
        assertConcluido(resultado, CaminhoTriagem.DISPENSA);
    }

    @Test
    void acompanhadoDeParenteComParentescoComprovavel_dispensa() {
        var resultado = service.avaliar(req(false, false, false, true, true, null, null, null, null));
        assertConcluido(resultado, CaminhoTriagem.DISPENSA);
    }

    @Test
    void acompanhadoDeParenteSemComprovacao_seguePraPasso5() {
        var resultado = service.avaliar(req(false, false, false, true, false, null, null, null, null));
        assertFalse(resultado.concluido());
        assertEquals(PassoTriagem.PASSO_5_ACOMPANHA_AUTORIZADO, resultado.proximoPasso());
    }

    @Test
    void acompanhadoDePessoaAutorizada_extrajudicial() {
        var resultado = service.avaliar(req(false, false, false, false, null, true, null, null, null));
        assertConcluido(resultado, CaminhoTriagem.EXTRAJUDICIAL);
    }

    @Test
    void naoDesacompanhado_semHipoteseAnterior_unidadeCompetente() {
        var resultado = service.avaliar(req(false, false, false, false, null, false, false, null, null));
        assertConcluido(resultado, CaminhoTriagem.UNIDADE_COMPETENTE);
    }

    @Test
    void desacompanhadoComPassaporteAutorizado_dispensa() {
        var resultado = service.avaliar(req(false, false, false, false, null, false, true, true, null));
        assertConcluido(resultado, CaminhoTriagem.DISPENSA);
    }

    @Test
    void desacompanhadoComAutorizacaoGenitor_extrajudicial() {
        var resultado = service.avaliar(req(false, false, false, false, null, false, true, false, true));
        assertConcluido(resultado, CaminhoTriagem.EXTRAJUDICIAL);
    }

    @Test
    void desacompanhadoSemNenhumaAutorizacao_unidadeCompetente() {
        var resultado = service.avaliar(req(false, false, false, false, null, false, true, false, false));
        assertConcluido(resultado, CaminhoTriagem.UNIDADE_COMPETENTE);
    }

    private void assertConcluido(TriagemResultadoResponse resultado, CaminhoTriagem esperado) {
        assertTrue(resultado.concluido());
        assertEquals(esperado, resultado.caminho());
    }
}
