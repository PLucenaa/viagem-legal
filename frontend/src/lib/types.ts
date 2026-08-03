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

export type TipoAnexo =
  | "DOC_REQUERENTE"
  | "DOC_MENOR"
  | "DOC_ACOMPANHANTE"
  | "COMPROVANTE_RESIDENCIA"
  | "PASSAGEM"
  | "TERMO_GUARDA"
  | "SELFIE_RG";

export interface AnexoResponse {
  id: number;
  tipo: TipoAnexo;
  nomeArquivo: string;
  contentType: string;
  tamanhoBytes: number;
  enviadoEm: string;
}

export interface SolicitacaoResponse {
  id: number;
  protocolo: string;
  tipoAutorizacao: TipoAutorizacao;
  status: StatusSolicitacao;
  tipoResponsavel: TipoResponsavel;
  requerente: PessoaRequest;
  menor: MenorRequest;
  responsavel: PessoaRequest | null;
  dadosViagem: DadosViagemRequest;
  anexos: AnexoResponse[];
  historico: HistoricoStatusResponse[];
  analistaNome: string | null;
  observacaoAnalista: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

/** Visão resumida para a listagem do painel interno. */
export interface SolicitacaoResumoResponse {
  id: number;
  protocolo: string;
  tipoAutorizacao: TipoAutorizacao;
  status: StatusSolicitacao;
  requerenteNome: string | null;
  menorNome: string | null;
  criadoEm: string;
}

/** Página no formato padrão do Spring Data. */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface MudancaStatusRequest {
  novoStatus: StatusSolicitacao;
  observacao?: string;
}

export interface ConsultaProtocoloResponse {
  protocolo: string;
  tipoAutorizacao: TipoAutorizacao;
  status: StatusSolicitacao;
  menorNome: string | null;
  anexos: AnexoResponse[];
  historico: HistoricoStatusResponse[];
  criadoEm: string;
  atualizadoEm: string;
}

/** Dados para montar o documento da autorização já deferida. */
export interface AutorizacaoDocumentoResponse {
  protocolo: string;
  tipoAutorizacao: TipoAutorizacao;
  status: StatusSolicitacao;
  tipoResponsavel: TipoResponsavel;
  requerente: PessoaRequest;
  menor: MenorRequest;
  responsavel: PessoaRequest | null;
  dadosViagem: DadosViagemRequest;
  deferidoEm: string;
}

// Triagem de viagem nacional (Resolução CNJ nº 295/2019).

export type CaminhoTriagem = "DISPENSA" | "EXTRAJUDICIAL" | "UNIDADE_COMPETENTE";

export type PassoTriagem =
  | "PASSO_1_IDADE"
  | "PASSO_2_ACOMPANHA_RESPONSAVEL"
  | "PASSO_3_DESTINO_COMARCA"
  | "PASSO_4_ACOMPANHA_PARENTE"
  | "PASSO_4B_PARENTESCO_COMPROVAVEL"
  | "PASSO_5_ACOMPANHA_AUTORIZADO"
  | "PASSO_6_DESACOMPANHADO"
  | "PASSO_6_1_PASSAPORTE_AUTORIZADO"
  | "PASSO_6_2_AUTORIZACAO_GENITOR";

/** Cada campo é uma resposta já dada; undefined/null = ainda não perguntado. */
export interface TriagemRequest {
  maiorOuIgualDezesseisAnos?: boolean | null;
  viajaComPaiMaeOuResponsavelLegal?: boolean | null;
  destinoComarcaContiguaOuMesmaRegiaoMetropolitana?: boolean | null;
  viajaComAscendenteOuColateralAteTerceiroGrau?: boolean | null;
  parentescoComprovavelDocumentalmente?: boolean | null;
  viajaComPessoaAutorizadaPeloResponsavel?: boolean | null;
  viajaDesacompanhado?: boolean | null;
  passaporteValidoComAutorizacaoParaExterior?: boolean | null;
  autorizacaoExpressaDeGenitorOuResponsavel?: boolean | null;
}

export interface TriagemResultadoResponse {
  concluido: boolean;
  proximoPasso: PassoTriagem | null;
  pergunta: string | null;
  caminho: CaminhoTriagem | null;
  fundamentoLegal: string | null;
  mensagem: string | null;
  documentosNecessarios: string[] | null;
}
