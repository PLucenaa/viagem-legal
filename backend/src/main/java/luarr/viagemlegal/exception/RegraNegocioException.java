package luarr.viagemlegal.exception;

/**
 * Violação de regra de negócio (ex.: transição de status inválida,
 * requerente fora de Boa Vista/RR, dados obrigatórios ausentes por tipo).
 */
public class RegraNegocioException extends RuntimeException {
    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
