package luarr.viagemlegal.exception;

import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

/**
 * Tradução de exceções para respostas HTTP padronizadas (RFC 7807 / ProblemDetail).
 */
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(SolicitacaoNaoEncontradaException.class)
    public ProblemDetail handleNaoEncontrada(SolicitacaoNaoEncontradaException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(RegraNegocioException.class)
    public ProblemDetail handleRegraNegocio(RegraNegocioException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage());
    }

    @ExceptionHandler(ConflitoException.class)
    public ProblemDetail handleConflito(ConflitoException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
    }

    /** Duas transações gravaram a mesma solicitação ao mesmo tempo (@Version). */
    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ProblemDetail handleConcorrencia(OptimisticLockingFailureException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT,
                "Esta solicitação foi alterada por outra pessoa ao mesmo tempo. "
                        + "Recarregue para ver a situação atual.");
    }

    @ExceptionHandler(AutenticacaoException.class)
    public ProblemDetail handleAutenticacao(AutenticacaoException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(AcessoNegadoException.class)
    public ProblemDetail handleAcessoNegado(AcessoNegadoException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ProblemDetail handleArquivoGrande(MaxUploadSizeExceededException ex) {
        return ProblemDetail.forStatusAndDetail(
                HttpStatus.PAYLOAD_TOO_LARGE, "Arquivo muito grande. O limite é 10MB por documento.");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidacao(MethodArgumentNotValidException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, "Erro de validação nos dados enviados.");
        Map<String, String> erros = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(fe -> erros.put(fe.getField(), fe.getDefaultMessage()));
        pd.setProperty("erros", erros);
        return pd;
    }
}
