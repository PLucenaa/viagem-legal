# **Árvore de decisão para viagens nacionais** **de crianças e adolescentes**

## *Base normativa: Resolução CNJ nº 295/2019*

Versão consolidada para modelagem do assistente digital

| Objetivo da árvore Identificar, a partir de perguntas simples, se a viagem nacional está dispensada de autorização, se exige autorização extrajudicial ou se deve ser encaminhada para processamento pela unidade competente do TJRR. |
| :---- |

# **1\. Escopo e regra geral**

**Escopo.** A árvore trata de viagens nacionais de crianças e adolescentes, conforme a Resolução CNJ nº 295/2019.

**Regra geral (art. 1º).** A criança ou o adolescente menor de 16 anos não pode viajar para fora da comarca onde reside, desacompanhado dos pais ou responsáveis, sem autorização, ressalvadas as hipóteses previstas no art. 2º.

| Regra de segurança operacional Quando houver dúvida, inconsistência, documentação insuficiente ou situação não contemplada pelas regras automáticas, o sistema não deverá recusar o atendimento de forma definitiva: o caso será encaminhado para análise humana. |
| :---- |

# **2\. Árvore de decisão**

## **Passo 1 — A pessoa possui 16 anos ou mais?**

**Sim:** não é exigida autorização para viagem nacional. O sistema apresenta as orientações sobre os documentos de identificação necessários.

**Não:** prosseguir para o Passo 2\.

## **Passo 2 — Viajará com o pai, a mãe ou o responsável legal?**

**Sim:** Caminho 1 — autorização dispensada.

**Não:** prosseguir para o Passo 3\.

**Observação:** na viagem nacional, o acompanhamento por um dos pais ou pelo responsável legal é suficiente para afastar a exigência de autorização.

## **Passo 3 — O destino se enquadra na hipótese territorial de dispensa?**

A dispensa se aplica quando o destino estiver em uma das situações abaixo:

* comarca contígua à comarca de residência, situada no mesmo estado; ou  
* comarca incluída na mesma região metropolitana da comarca de residência.

| O que significa “comarca contígua”? É a comarca vizinha que faz divisa territorial direta com a comarca onde a criança ou adolescente reside. “Comarca” é a área territorial atendida pela Justiça e pode abranger um ou mais municípios. O sistema deverá solicitar o município de residência e o município de destino e verificar essa condição automaticamente, sem exigir que o usuário conheça a divisão judiciária. |
| :---- |

**Sim:** Caminho 1 — autorização dispensada.

**Não:** prosseguir para o Passo 4\.

## **Passo 4 — Viajará com um parente maior de idade das categorias abaixo?**

Exemplos abrangidos pela regra:

* avô ou avó;  
* bisavô ou bisavó;  
* irmão ou irmã maior de idade;  
* tio ou tia.

Esses exemplos correspondem a **ascendentes ou parentes colaterais maiores de idade até o terceiro grau**.

**Sim, e o parentesco pode ser comprovado documentalmente:** Caminho 1 — autorização dispensada.

**Não:** prosseguir para o Passo 5\.

**Documentos durante a viagem:** deverão permitir a identificação do acompanhante, da criança ou adolescente e a comprovação do parentesco.

## **Passo 5 — Viajará com outra pessoa maior de idade, expressamente autorizada pelo pai, pela mãe ou pelo responsável?**

**Sim:** Caminho 2 — autorização extrajudicial.

**Não:** prosseguir para o Passo 6\.

A autorização deverá ser formalizada por:

* escritura pública; ou  
* documento particular com firma reconhecida por semelhança ou autenticidade.

**Papel da plataforma:** selecionar o modelo adequado, auxiliar no preenchimento e orientar sobre as formalidades. O formulário preenchido não deverá ser apresentado como autorização válida antes da assinatura e do reconhecimento de firma exigidos.

## **Passo 6 — Viajará desacompanhada de pessoa maior de idade?**

**Não, mas nenhuma hipótese anterior se aplica:** Caminho 3 — processamento pela unidade competente do TJRR.

**Sim:** verificar as duas situações abaixo, na ordem.

**6.1. Possui passaporte válido com autorização expressa para viajar desacompanhada ao exterior?**

**Sim:** Caminho 1 — autorização dispensada.

**Não:** verificar o item 6.2.

**6.2. Há autorização expressa de um dos genitores ou do responsável legal?**

**Sim:** Caminho 2 — autorização extrajudicial, formalizada por escritura pública ou documento particular com firma reconhecida.

**Não:** Caminho 3 — processamento pela unidade competente do TJRR.

# **3\. Resultado dos caminhos**

| Caminho 1Autorização dispensada | Caminho 2Autorização extrajudicial | Caminho 3Unidade competente do TJRR |
| ----- | ----- | ----- |
| A plataforma informa que não é necessário solicitar autorização, explica o fundamento, indica os documentos necessários e permite o envio das orientações por e-mail ou WhatsApp. Não gera PDF que possa ser confundido com autorização. | A plataforma identifica o modelo adequado, auxilia no preenchimento, informa quem deve assinar e orienta sobre reconhecimento de firma e documentos necessários. O formulário preenchido ainda não constitui autorização válida. | A plataforma permite autenticação, envio de dados e documentos, geração de protocolo, acompanhamento, complementação e encaminhamento para conferência e autorização pelos agentes competentes da unidade. |

# **4\. Validade da autorização extrajudicial**

**Regra do art. 3º.** As autorizações concedidas pelos genitores ou responsáveis devem indicar o prazo de validade. Se o prazo não for informado, presume-se a validade por dois anos.

**Regra para o sistema.** Nos formulários extrajudiciais preenchidos com auxílio da plataforma, o campo de validade deverá ser obrigatório, com alerta para conferência da data antes da conclusão do documento.

**Limite da regra.** Essa presunção não deve ser aplicada automaticamente às autorizações emitidas pela unidade competente do TJRR, cujo conteúdo e prazo seguirão a decisão adotada no caso concreto.

| Observação final para a modelagem A árvore representa regras preliminares para o assistente digital. Antes da implementação, as perguntas, documentos exigidos, critérios de encaminhamento e textos de orientação deverão ser validados pelas unidades da Infância e Juventude e pela área técnica responsável. |
| :---- |

