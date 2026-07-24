package luarr.viagemlegal.domain.enums;

/**
 * Tipo de autorização solicitada.
 * <p>
 * NACIONAL: viagem dentro do Brasil — assinatura eletrônica + QR Code, sem cartório.
 * INTERNACIONAL: viagem para fora do país — exige reconhecimento de firma em cartório.
 * HOSPEDAGEM: hospedagem de menor em hotel/pousada — formulário específico.
 */
public enum TipoAutorizacao {
    NACIONAL,
    INTERNACIONAL,
    HOSPEDAGEM
}
