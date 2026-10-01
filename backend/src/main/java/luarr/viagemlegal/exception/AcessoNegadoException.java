package luarr.viagemlegal.exception;

/** Usuário autenticado no Keycloak, mas sem role de acesso ao painel. */
public class AcessoNegadoException extends RuntimeException {
    public AcessoNegadoException(String mensagem) {
        super(mensagem);
    }
}
