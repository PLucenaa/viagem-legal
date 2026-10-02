package luarr.viagemlegal.exception;

/**
 * A solicitação mudou desde que o analista a carregou (outra pessoa agiu
 * antes). Vira 409 — a tela recarrega em vez de sobrescrever a decisão alheia.
 */
public class ConflitoException extends RuntimeException {
    public ConflitoException(String mensagem) {
        super(mensagem);
    }
}
