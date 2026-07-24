// Tipos espelhando os enums e DTOs do backend.

export type TipoAutorizacao = "NACIONAL" | "INTERNACIONAL" | "HOSPEDAGEM";
export type TipoResponsavel = "PAI" | "MAE" | "TUTOR" | "GUARDIAO";
export type TipoDocumento = "RG" | "CNH" | "PASSAPORTE" | "CERTIDAO_NASCIMENTO";
export type Sexo = "MASCULINO" | "FEMININO";

export type StatusSolicitacao =
  | "RECEBIDA"
  | "EM_ANALISE"
  | "PENDENTE_CORRECAO"
  | "DEFERIDA"
  | "INDEFERIDA"
  | "AGUARDANDO_ASSINATURA"
  | "CONCLUIDA";

export interface EnderecoRequest {
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export interface PessoaRequest {
  nomeCompleto?: string;
  cpf?: string;
  nacionalidade?: string;
  estadoCivil?: string;
  profissao?: string;
  tipoDocumento?: TipoDocumento;
  numeroDocumento?: string;
  orgaoExpedidor?: string;
  dataExpedicao?: string;
  telefone?: string;
  email?: string;
  endereco?: EnderecoRequest;
}

export interface MenorRequest {
  nomeCompleto: string;
  dataNascimento: string;
  sexo?: Sexo;
  naturalidade?: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  orgaoExpedidor?: string;
  dataExpedicao?: string;
}

export interface DadosViagemRequest {
  destino: string;
  dataIda: string;
  dataVolta?: string;
  meioTransporte?: string;
  validadeDias?: number;
}

export interface SolicitacaoRequest {
  tipoAutorizacao: TipoAutorizacao;
  tipoResponsavel: TipoResponsavel;
  requerente: PessoaRequest;
  menor: MenorRequest;
  responsavel?: PessoaRequest;
  dadosViagem: DadosViagemRequest;
}

export interface HistoricoStatusResponse {
  statusAnterior: StatusSolicitacao | null;
  statusNovo: StatusSolicitacao;
  analistaNome: string | null;
  observacao: string | null;
  ocorridoEm: string;
}

export interface SolicitacaoResponse {
  id: number;
  protocolo: string;
  tipoAutorizacao: TipoAutorizacao;
  status: StatusSolicitacao;
  criadoEm: string;
}

export interface ConsultaProtocoloResponse {
  protocolo: string;
  tipoAutorizacao: TipoAutorizacao;
  status: StatusSolicitacao;
  menorNome: string | null;
  historico: HistoricoStatusResponse[];
  criadoEm: string;
  atualizadoEm: string;
}
