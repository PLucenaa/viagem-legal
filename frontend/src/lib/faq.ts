// Conteúdo informativo da página inicial, conforme material oficial da
// Divisão de Proteção das Varas da Infância e Juventude de Boa Vista/RR.

export interface FaqItem {
  pergunta: string;
  resposta: string;
}

export const FAQ: FaqItem[] = [
  {
    pergunta: "Quando é necessária a autorização de viagem dentro do Brasil?",
    resposta:
      "Quando crianças e adolescentes menores de 16 anos viajarem desacompanhados fora da sua comarca de residência, conforme o artigo 83 do ECA. Também quando viajarem acompanhados de uma terceira pessoa que não seja da família, ascendente ou parente colateral maior até o terceiro grau.",
  },
  {
    pergunta: "Quando NÃO é necessária a autorização de viagem dentro do Brasil?",
    resposta:
      "Quando a viagem é para uma comarca próxima à residência, dentro do mesmo Estado ou região metropolitana; ou se a criança/adolescente estiver acompanhado por um ascendente ou parente colateral maior até o terceiro grau (comprovado documentalmente o parentesco), ou de pessoa maior autorizada pelos pais ou responsável.",
  },
  {
    pergunta: "Quem pode solicitar a autorização de viagem?",
    resposta:
      "Pai, mãe ou responsável legal (guardião) da criança ou adolescente. Para guardiões, é necessário ter a guarda judicial.",
  },
  {
    pergunta: "Quais documentos são necessários?",
    resposta:
      "Documento de identificação com foto do pai, mãe ou guardião (RG, CNH, passaporte); documento de identificação da criança/adolescente (RG, Certidão de Nascimento, Passaporte) e do acompanhante, se houver; comprovante de residência (água, telefone ou energia); cópia da passagem; e termo de guarda, quando aplicável. No atendimento online, também uma selfie segurando o RG.",
  },
  {
    pergunta: "Eu pagarei alguma coisa pela autorização?",
    resposta: "Não. O serviço é totalmente gratuito.",
  },
  {
    pergunta: "Qual o prazo para a autorização de viagem nacional?",
    resposta:
      "É emitida no mesmo dia da solicitação, desde que todos os documentos estejam corretos.",
  },
  {
    pergunta: "A autorização nacional precisa ser reconhecida em cartório?",
    resposta:
      "Não. Ela possui assinatura eletrônica e um QR Code que permite verificar a autenticidade durante a viagem.",
  },
  {
    pergunta: "E nas viagens internacionais?",
    resposta:
      "Sim, é necessário o reconhecimento da assinatura em cartório, após o preenchimento do formulário próprio pelo pai, mãe ou responsável legal. Atenção: não se aplica a criança/adolescente que sai do país em companhia de estrangeiro residente no exterior — nesse caso, somente com autorização judicial prévia e expressa.",
  },
  {
    pergunta: "E quanto à hospedagem?",
    resposta:
      "Menores de 18 anos desacompanhados ou acompanhados de terceiros que não sejam os pais ou guardiões necessitam de autorização para hospedagem em hotéis, pousadas e similares. Há um formulário específico, com reconhecimento de assinatura em cartório.",
  },
];

export const INFO_SERVICO = {
  horario: "Segunda a sexta-feira, das 8h às 18h",
  endereco:
    "Avenida General Ataide Teive, 4270, Caimbé, Boa Vista/RR",
  whatsapp: "(95) 98410-3926",
  telefone: "(95) 3621-5103",
  email: "infanciaprotecao@tjrr.jus.br",
  aviso: "As autorizações são concedidas apenas para quem reside em Boa Vista/RR.",
};
