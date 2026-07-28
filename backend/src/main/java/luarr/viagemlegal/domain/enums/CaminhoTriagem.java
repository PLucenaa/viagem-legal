package luarr.viagemlegal.domain.enums;

/**
 * Resultado possível da triagem de viagem nacional (Resolução CNJ nº 295/2019).
 * <p>
 * DISPENSA: não é exigida autorização.
 * EXTRAJUDICIAL: autorização por escritura pública ou documento particular com firma reconhecida.
 * UNIDADE_COMPETENTE: exige processamento pela unidade da Infância e Juventude do TJRR.
 */
public enum CaminhoTriagem {
    DISPENSA,
    EXTRAJUDICIAL,
    UNIDADE_COMPETENTE
}
