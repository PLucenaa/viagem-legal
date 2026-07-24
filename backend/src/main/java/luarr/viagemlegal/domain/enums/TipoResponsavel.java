package luarr.viagemlegal.domain.enums;

/**
 * Vínculo do requerente com o menor (qualidade em que autoriza).
 * TUTOR e GUARDIAO exigem documento comprobatório (termo de guarda/tutela).
 * Distinção presente no formulário padrão do CNJ (Res. 131/2011).
 */
public enum TipoResponsavel {
    PAI,
    MAE,
    TUTOR,
    GUARDIAO
}
