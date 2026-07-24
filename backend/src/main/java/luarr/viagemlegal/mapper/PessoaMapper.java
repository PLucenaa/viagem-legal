package luarr.viagemlegal.mapper;

import luarr.viagemlegal.domain.embeddable.Endereco;
import luarr.viagemlegal.domain.embeddable.Pessoa;
import luarr.viagemlegal.dto.request.EnderecoRequest;
import luarr.viagemlegal.dto.request.PessoaRequest;

/**
 * Conversão entre DTOs de pessoa/endereço e os embeddables de domínio.
 */
public final class PessoaMapper {

    private PessoaMapper() {
    }

    public static Pessoa toEmbeddable(PessoaRequest dto) {
        if (dto == null) {
            return null;
        }
        return Pessoa.builder()
                .nomeCompleto(dto.nomeCompleto())
                .cpf(dto.cpf())
                .nacionalidade(dto.nacionalidade())
                .estadoCivil(dto.estadoCivil())
                .profissao(dto.profissao())
                .tipoDocumento(dto.tipoDocumento())
                .numeroDocumento(dto.numeroDocumento())
                .orgaoExpedidor(dto.orgaoExpedidor())
                .dataExpedicao(dto.dataExpedicao())
                .telefone(dto.telefone())
                .email(dto.email())
                .endereco(toEndereco(dto.endereco()))
                .build();
    }

    public static Endereco toEndereco(EnderecoRequest dto) {
        if (dto == null) {
            return null;
        }
        return Endereco.builder()
                .logradouro(dto.logradouro())
                .numero(dto.numero())
                .complemento(dto.complemento())
                .bairro(dto.bairro())
                .cidade(dto.cidade())
                .uf(dto.uf())
                .cep(dto.cep())
                .build();
    }
}
