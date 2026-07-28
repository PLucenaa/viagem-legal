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
- [ ] Página inicial com assistente digital em português e espanhol
- [x] Motor de regras objetivas (não-IA) implementando os 6 passos da [árvore de decisão validada](arvore_decisao_resolucao_cnj_295_2019.md) — backend: `TriagemService`/`TriagemController` (`POST /api/triagem`), stateless, cobertura de testes em `TriagemServiceTest` (12 cenários)
- [ ] Fluxo sem necessidade de cadastro para a triagem inicial (backend já não exige autenticação; falta o front consumir)
- [ ] Frontend: tela do assistente chamando `POST /api/triagem` pergunta a pergunta e exibindo o resultado final
- [ ] Caminho 1 — Dispensa de autorização: tela de orientação clara + lista de documentos, sem gerar arquivo que pareça autorização
- [ ] Caminho 2 — Resolução extrajudicial: preenchimento assistido do documento adequado + orientações de validade (campo de validade obrigatório, alerta de expiração)
- [ ] Caminho 3 — Necessário trâmite pela unidade competente: encaminhar para envio digital da solicitação (fluxo de `Solicitacao` já existe no backend, falta ligar a triagem a ele)
- [ ] Regra de segurança operacional: qualquer dúvida/inconsistência/caso não previsto cai em análise humana, nunca recusa automática (ainda não implementada — hoje a árvore sempre conclui em um dos 3 caminhos dado respostas completas)

### Cadastro e envio da solicitação
- [ ] Formulários digitais para envio de solicitação, documentos e informações complementares
- [ ] Upload de documentos (cópias) conforme tipo de pedido
- [ ] Fluxo de confirmação expressa do envio pelo usuário, com registro de data/hora/identificação
- [ ] Geração de protocolo vinculado ao usuário

### Acompanhamento do cidadão
- [ ] Tela de consulta de status/andamento do protocolo
- [ ] Recebimento de pedidos de complementação
- [ ] Correção de informações/documentos sem reiniciar o atendimento

### Painel interno (servidores)
- [ ] Autenticação/perfis de acesso internos
- [ ] Fila de gerenciamento de solicitações por status
- [ ] Separação de pedidos incompletos e solicitação de correções
- [ ] Registro de análises realizadas (auditoria)
- [ ] Encaminhamento dos casos aptos à etapa de autorização

### Infraestrutura básica
- [ ] Modelagem de dados (usuários, solicitações, protocolos, documentos, status, histórico)
- [ ] Estrutura modular (fluxo desacoplado para permitir alteração sem reconstrução)
- [ ] Auditoria/versionamento das regras de triagem (para atualização normativa futura)
- [x] Dockerfile do backend (multi-stage Maven/JDK 25 + JRE runtime)
- [x] Dockerfile do frontend (build Vite + nginx com fallback de SPA)
- [x] Workflow de deploy PROD via API do Coolify ([deploy.yml](.github/workflows/deploy.yml))
- [x] Ajuste do Dockerfile do backend para criar `/app/storage` com dono `spring:spring` antes do volume ser montado (evita erro de permissão)
- [ ] Cadastrar as duas aplicações (backend/frontend) no Coolify e configurar domínios/FQDN
- [ ] Cadastrar secrets no GitHub: `COOLIFY_URL`, `COOLIFY_TOKEN`, `COOLIFY_UUID_BACKEND`, `COOLIFY_UUID_FRONTEND`
- [ ] Confirmar domínio real do backend (workflow assume front em `viagem-legal.luarr.cloud`; health-check do backend ainda não incluído por falta do domínio da API)
- [ ] Subir recurso PostgreSQL no Coolify (mesmo Project/Environment do backend, para resolução via rede interna)
- [ ] Configurar envs de runtime do backend no Coolify: `DB_URL`, `DB_USER`, `DB_PASSWORD` (apontando para o host interno do Postgres do Coolify)
- [ ] Montar volume persistente no backend em `/app/storage` e definir `STORAGE_PATH=/app/storage/anexos`
- [ ] Ativar backup agendado do Postgres no Coolify
- [ ] Decidir se/quando criar profile `prod` no Spring (trocar `ddl-auto: update` por Flyway/Liquibase antes de ir a produção real)
- [ ] Criar `.env.example` no frontend e client HTTP usando `VITE_API_URL` (hoje declarado no Dockerfile mas ainda não consumido no código) — configurar como *Build Variable* no Coolify, não env de runtime

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
- [ ] Testes com usuários e servidores antes de ampliar automações (piloto controlado)
- [ ] Plano de segurança e privacidade de dados sensíveis (LGPD) para documentos e fotos armazenados
- [ ] Ambiente de auditoria/logs de acesso ao módulo interno
