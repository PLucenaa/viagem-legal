package luarr.viagemlegal.domain.enums;

/**
 * Categorias de anexo exigidas conforme o caso.
 * Ver requisitos na página de informações do serviço.
 */
public enum TipoAnexo {
    DOC_REQUERENTE,          // identificação com foto do pai/mãe/guardião
    DOC_MENOR,               // identificação da criança/adolescente
    DOC_ACOMPANHANTE,        // identificação do acompanhante (se houver)
    COMPROVANTE_RESIDENCIA,  // água, telefone ou energia
    PASSAGEM,                // cópia da passagem
    TERMO_GUARDA,            // obrigatório quando requerente é GUARDIAO
    SELFIE_RG                // selfie segurando o RG (fluxo online)
}
