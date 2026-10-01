package luarr.viagemlegal.exception;

/** Falha ao autenticar no Keycloak (code/refresh token inválido ou expirado). */
public class AutenticacaoException extends RuntimeException {
    public AutenticacaoException(String mensagem) {
        super(mensagem);
    }
}
