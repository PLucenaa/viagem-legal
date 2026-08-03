package luarr.viagemlegal.dto.response;

import luarr.viagemlegal.domain.enums.CaminhoTriagem;
import luarr.viagemlegal.domain.enums.PassoTriagem;

import java.util.List;

/**
 * Resposta da triagem: ou a próxima pergunta a fazer (concluido = false),
 * ou o caminho definido com o fundamento legal (concluido = true).
 */
public record TriagemResultadoResponse(
        boolean concluido,
        PassoTriagem proximoPasso,
        String pergunta,
        CaminhoTriagem caminho,
        String fundamentoLegal,
        String mensagem,
        List<String> documentosNecessarios
) {
    public static TriagemResultadoResponse pergunta(PassoTriagem passo, String texto) {
        return new TriagemResultadoResponse(false, passo, texto, null, null, null, null);
    }

    public static TriagemResultadoResponse concluido(CaminhoTriagem caminho, String fundamentoLegal, String mensagem,
                                                       List<String> documentosNecessarios) {
        return new TriagemResultadoResponse(true, null, null, caminho, fundamentoLegal, mensagem, documentosNecessarios);
    }
}
