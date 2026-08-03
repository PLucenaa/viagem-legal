# Tasks — Plataforma de Autorização de Viagem de Menores (TJRR)

> Extraído de [ideia.md](ideia.md). Organizado por fase de implantação, com o que falta definir e o que falta construir.

## Fase 0 — Definições prévias (bloqueiam o desenvolvimento)

- [x] Levantar as regras objetivas da Resolução CNJ nº 295/2019 (ver [resolucao_295_13092019_19092019180849.pdf](resolucao_295_13092019_19092019180849.pdf))
- [x] Validar a árvore de decisão com as Varas da Infância e Juventude e Divisão de Proteção — **dada como validada**, ver [arvore_decisao_resolucao_cnj_295_2019.md](arvore_decisao_resolucao_cnj_295_2019.md) (documento de referência oficial para o motor de regras)
- [ ] Validar com as Varas da Infância e Juventude e Divisão de Proteção: formulários, documentos exigidos por tipo de pedido, critérios de conferência

### Árvore de decisão (validada) — resumo

Fonte de verdade: [arvore_decisao_resolucao_cnj_295_2019.md](arvore_decisao_resolucao_cnj_295_2019.md). Fluxo de 6 passos:

1. **Idade ≥ 16 anos?** Sim → Caminho 1 (dispensa). Não → passo 2.
2. **Viaja com pai/mãe/responsável legal?** Sim → Caminho 1. Não → passo 3.
3. **Destino é comarca contígua (mesma UF) ou mesma região metropolitana?** Sim → Caminho 1. Não → passo 4.
4. **Viaja com ascendente/colateral até 3º grau, com parentesco comprovável documentalmente?** Sim → Caminho 1. Não → passo 5.
5. **Viaja com outra pessoa maior expressamente autorizada por pai/mãe/responsável (escritura pública ou doc. particular com firma reconhecida)?** Sim → Caminho 2 (extrajudicial). Não → passo 6.
6. **Viaja desacompanhado?**
   - Não (e nenhuma hipótese anterior se aplica) → Caminho 3 (unidade competente).
   - Sim → 6.1 possui passaporte válido com autorização expressa para exterior? Sim → Caminho 1. Não → 6.2 há autorização expressa de genitor/responsável? Sim → Caminho 2. Não → Caminho 3.

**Regra de segurança operacional**: dúvida, inconsistência ou caso não previsto → nunca recusar automaticamente, encaminhar para análise humana.

**Validade (Art. 3º)**: se o documento de autorização extrajudicial não indicar prazo, presume-se 2 anos — presunção **não** se aplica às autorizações emitidas pela própria unidade do TJRR (essas seguem a decisão do caso concreto).

### Modelos de formulário já disponíveis (anexos à Resolução, páginas 3-11 do PDF)
Usar como base para o preenchimento assistido do Caminho 2 (extrajudicial):
- [ ] Modelo 1: autorização por **um responsável**, acompanhado de outra pessoa maior
- [ ] Modelo 2: autorização por **ambos os responsáveis (mãe e pai)**, acompanhado de outra pessoa maior
- [ ] Modelo 3: autorização por **um responsável**, criança/adolescente **desacompanhado**
- [ ] Modelo 4: autorização por **ambos os responsáveis**, criança/adolescente **desacompanhado**
- [ ] Digitalizar os 4 modelos como templates preenchíveis no sistema (com geração de PDF final para reconhecimento de firma)
- [ ] Definir perfis de acesso do módulo interno (triagem, complementação, autorização) junto às unidades competentes
- [ ] Definir com a STI: arquitetura, requisitos de segurança, hospedagem/sustentação da solução
- [ ] Definir nível de confiabilidade exigido para autenticação (gov.br) compatível com a sensibilidade do serviço
- [ ] Definir procedimento para usuário sem conta gov.br ou que não conclui a autenticação
- [ ] Definir critérios de segurança para coleta de documentos e fotografia (quando exigir, como validar)
- [ ] Definir o papel exato do SEI no fluxo (junto às unidades responsáveis e à STI)
- [ ] Definir indicadores de acompanhamento e como serão coletados/expostos (painel de métricas)

## Fase 1 — MVP (aplicação web responsiva, sem app nativo)

### Assistente de triagem
- [ ] Página inicial com assistente digital em português e espanhol (decisão: usar tradução automática do Google em vez de i18n manual — pendente de implementar o widget)
- [x] Motor de regras objetivas (não-IA) implementando os 6 passos da [árvore de decisão validada](arvore_decisao_resolucao_cnj_295_2019.md) — backend: `TriagemService`/`TriagemController` (`POST /api/triagem`), stateless, cobertura de testes em `TriagemServiceTest` (12 cenários)
- [x] Fluxo sem necessidade de cadastro para a triagem inicial
- [x] Frontend: tela do assistente ([TriagemPage.tsx](frontend/src/pages/TriagemPage.tsx)) chamando `POST /api/triagem` pergunta a pergunta — **testado em produção, funcionando**
- [x] Caminho 1 — Dispensa de autorização: backend agora devolve `documentosNecessarios` (lista específica por ramo da árvore) em `TriagemResultadoResponse`; frontend exibe checklist formatada, sem gerar arquivo que pareça autorização
- [x] Caminho 2 — Resolução extrajudicial: [ExtrajudicialPage.tsx](frontend/src/pages/ExtrajudicialPage.tsx) — formulário assistido (1 ou 2 responsáveis, acompanhado/desacompanhado conforme a resposta da triagem) gera uma prévia imprimível nos moldes dos 4 modelos oficiais da Resolução, com aviso de que só vale após assinatura + reconhecimento de firma
- [ ] Caminho 3 — Necessário trâmite pela unidade competente: já linka para `/solicitar` (fluxo de `Solicitacao` existente no backend); a triagem não coleta dados reais (só respostas sim/não), então não há o que pré-preencher hoje — deixado como está
- [ ] Regra de segurança operacional: qualquer dúvida/inconsistência/caso não previsto cai em análise humana, nunca recusa automática (ainda não implementada — hoje a árvore sempre conclui em um dos 3 caminhos dado respostas completas)

### Cadastro e envio da solicitação
- [x] Formulários digitais para envio de solicitação e informações ([SolicitarPage.tsx](frontend/src/pages/SolicitarPage.tsx)) — **testado em produção, gera protocolo real**
- [x] Upload de documentos (cópias) conforme tipo de pedido — endpoint público `POST /solicitacoes/protocolo/{protocolo}/anexos` + componente compartilhado [AnexoUploadSection.tsx](frontend/src/components/AnexoUploadSection.tsx), usado tanto no fluxo de criação (`/solicitar`, logo após gerar o protocolo) quanto no acompanhamento
- [x] Geração de protocolo vinculado ao usuário
- [ ] Fluxo de confirmação expressa do envio pelo usuário, com registro de data/hora/identificação (hoje o envio não tem uma tela de "confirmar e assinar" explícita antes de criar a solicitação)

### Acompanhamento do cidadão
- [x] Tela de consulta de status/andamento do protocolo ([AcompanharPage.tsx](frontend/src/pages/AcompanharPage.tsx))
- [x] Lista de documentos já enviados + formulário de upload adicional (aparece enquanto status está em `RECEBIDA`/`EM_ANALISE`/`PENDENTE_CORRECAO`)
- [x] Download provisório da autorização quando `DEFERIDA`/`AGUARDANDO_ASSINATURA`/`CONCLUIDA` — prévia via `GET /solicitacoes/protocolo/{protocolo}/autorizacao`, imprimível (print-to-PDF do navegador). **Ainda sem assinatura/QR de autenticidade** — isso é Fase 2, o aviso na tela deixa isso explícito
- [ ] Recebimento de pedidos de complementação (o backend já tem o status `PENDENTE_CORRECAO` e agora dá pra reenviar anexo; falta destacar visualmente "isso aqui foi pedido pelo analista" de forma mais clara)
- [ ] Correção de informações/documentos sem reiniciar o atendimento (hoje só dá pra anexar documento novo, não editar os dados já enviados)

### Painel interno (servidores)
- [x] Fila de gerenciamento de solicitações por status — [PainelListaPage.tsx](frontend/src/pages/painel/PainelListaPage.tsx) (`/painel`), filtro por status + paginação
- [x] Tela de detalhe + mudança de status — [PainelDetalhePage.tsx](frontend/src/pages/painel/PainelDetalhePage.tsx) (`/painel/:id`), botões de transição espelhando `TransicaoStatus.java`, observação obrigatória em indeferimento/pendência de correção
- [x] Registro de análises realizadas (auditoria) — histórico de status já mostrado na tela de detalhe (vem do backend)
- [ ] Autenticação/perfis de acesso internos — **painel hoje é público, sem login** (mesma situação do `SecurityConfig` provisório do backend); prioridade antes de ir a produção real
- [ ] Separação visual de pedidos incompletos (hoje dá pra filtrar por `PENDENTE_CORRECAO`, mas não há destaque/prioridade na lista)
- [ ] Encaminhamento dos casos aptos à etapa de autorização — transições até `AGUARDANDO_ASSINATURA`/`CONCLUIDA` já funcionam; falta a emissão do documento final (Fase 2)

### Infraestrutura básica
- [ ] Modelagem de dados (usuários, solicitações, protocolos, documentos, status, histórico)
- [ ] Estrutura modular (fluxo desacoplado para permitir alteração sem reconstrução)
- [ ] Auditoria/versionamento das regras de triagem (para atualização normativa futura)
- [x] Dockerfile do backend (multi-stage Maven/JDK 25 + JRE runtime)
- [x] Dockerfile do frontend (build Vite + nginx com fallback de SPA)
- [x] Workflow de deploy PROD via API do Coolify ([deploy.yml](.github/workflows/deploy.yml))
- [x] Ajuste do Dockerfile do backend para criar `/app/storage` com dono `spring:spring` antes do volume ser montado (evita erro de permissão)
- [x] Cadastrar as duas aplicações (backend/frontend) no Coolify e configurar domínios/FQDN — `viagem-legal.luarr.cloud` (frontend) e `api.viagem-legal.luarr.cloud` (backend)
- [ ] Confirmar se o deploy está de fato passando pelo [deploy.yml](.github/workflows/deploy.yml)/GitHub Actions ou se o Coolify está redeployando sozinho via webhook nativo do Git — os logs vistos até agora parecem vir do build nativo do Coolify; se for esse o caso, decidir se ainda vale manter o workflow do GitHub Actions ou remover pra não duplicar
- [ ] Cadastrar secrets no GitHub: `COOLIFY_URL`, `COOLIFY_TOKEN`, `COOLIFY_UUID_BACKEND`, `COOLIFY_UUID_FRONTEND` (só se for manter o workflow acima)
- [x] Subir recurso PostgreSQL no Coolify e configurar `DB_URL`/`DB_USER`/`DB_PASSWORD` no backend
- [x] `VITE_API_URL` consumido de fato pelo frontend ([lib/api.ts](frontend/src/lib/api.ts)) e CORS liberado no backend ([SecurityConfig.java](backend/src/main/java/luarr/viagemlegal/config/SecurityConfig.java)) — **fluxo de triagem testado ponta a ponta em produção**
- [ ] Montar volume persistente no backend em `/app/storage` e definir `STORAGE_PATH=/app/storage/anexos` (ainda não confirmado se o volume foi de fato criado no Coolify — sem isso, anexos somem a cada deploy)
- [ ] Ativar backup agendado do Postgres no Coolify
- [ ] Decidir se/quando criar profile `prod` no Spring (trocar `ddl-auto: update` por Flyway/Liquibase antes de ir a produção real)

## Fase 2 — Integrações e automações sensíveis

- [ ] Autenticação integrada via conta gov.br (nível de confiabilidade definido na Fase 0)
- [ ] Fluxo de exceção para autenticação/validação documental impossível → análise humana (evitar exclusão de migrantes, indocumentados, divergências cadastrais)
- [ ] Captura e validação de fotografia atual do solicitante
- [ ] Notificações automáticas de mudança de status (WhatsApp e e-mail)
- [ ] WhatsApp e e-mail como canais de entrada de solicitação/complementação
- [ ] Emissão da autorização em formato digital
- [ ] Mecanismo de verificação de autenticidade da autorização emitida
- [ ] Integração com o SEI (ou outros sistemas institucionais), conforme escopo definido na Fase 0
- [ ] Painel/relatório de indicadores (tempo médio de emissão, % resolvidos sem via judicial, volume de complementações, % validações de identidade concluídas, custos de deslocamento evitados)

## Transversais

- [ ] i18n completo (pt/es) em todas as telas voltadas ao cidadão
- [ ] Design mobile-first / responsivo
- [x] Animações de transição no assistente de triagem (GSAP) — fade/slide ao trocar de pergunta ou revelar o resultado, stagger na checklist de documentos
- [ ] Testes com usuários e servidores antes de ampliar automações (piloto controlado)
- [ ] Plano de segurança e privacidade de dados sensíveis (LGPD) para documentos e fotos armazenados
- [ ] Ambiente de auditoria/logs de acesso ao módulo interno
