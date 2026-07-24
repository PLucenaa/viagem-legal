package luarr.viagemlegal.exception;

/** Lançada quando uma solicitação não é encontrada por id ou protocolo. */
public class SolicitacaoNaoEncontradaException extends RuntimeException {
    public SolicitacaoNaoEncontradaException(String mensagem) {
        super(mensagem);
    }
}
