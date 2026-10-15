# Handoff: Plano de capacitação Angular + SAP Commerce Composable Storefront

Este arquivo resume uma sessão de trabalho no claude.ai (1 a 15 de outubro de 2026) para continuar no Claude Code. Coloque-o na raiz da pasta de trabalho (pode renomear para `CLAUDE.md` se quiser que o Claude Code o leia automaticamente em toda sessão).

## Objetivo

Criar um plano para o time aprender a desenvolver em **Angular** e **SAP Commerce Cloud Composable Storefront** (antigo Spartacus), que cada pessoa consiga seguir **sozinha**.

## Onde está cada coisa

| Item | Onde |
| --- | --- |
| Plano completo (documento vivo, em inglês) | https://claude.ai/code/artifact/1e124a48-a348-46aa-8f5b-3fc658f1906e — título "Training Plan: Angular + SAP Commerce Composable Storefront" |
| Projeto de referência das Fases 1 e 2 (Angular 21, tudo funcionando) | `catalog-reference.zip` (enviado junto com este arquivo). Descompacte e rode `npm install` |
| Este resumo | `HANDOFF.md` |

O documento não sincroniza sozinho com o seu computador. Para ter uma cópia local, exporte-o em Markdown ou Word pelo menu do documento.

## Como o plano evoluiu (decisões do usuário, em ordem)

1. Plano inicial de 10 semanas, 5 fases, com projeto final em equipe.
2. Projeto final passou a ser **individual**; cada passo ganhou **código** e **links para a documentação oficial**; todas as **siglas explicadas** + glossário.
3. Cada fase virou **passo a passo** numerado.
4. Incluídos os **recursos modernos do Angular**: signals, computed, effect, linkedSignal, resource/httpResource, model(), viewChild(), @defer, zoneless, Signal Forms (RxJS e NgRx mantidos, porque o storefront usa).
5. Formato **didático** em todo passo: Conceito (com analogia) → Na prática (código comentado linha a linha) → Exercício (dica + solução) → Erros comuns → Documentação → "Done when". Quatro diagramas: linha do tempo, reatividade com signals, CMS → componente Angular, camadas do storefront.
6. Documento traduzido para **inglês** (texto, código, diagramas, glossário).
7. Adicionada a seção **"How to run the exercises"** (setup único, onde rodar cada coisa, onde colar cada trecho, ciclo de execução, erros rápidos) e uma caixa **"How to run it"** antes de cada exercício.
8. **Execução de verificação** do plano inteiro (detalhes abaixo).

## Estrutura atual do documento

- Goal and assumptions (inclui nota "Tested on October 15, 2026")
- How to run the exercises
- Track overview (diagrama de 10 semanas)
- Phase 1 — TypeScript and Angular fundamentals (semanas 1–2, 7 passos): mini catálogo com dummyjson.com
- Phase 2 — Modern Angular and reactivity (semanas 3–4, 9 passos): signals, linkedSignal/httpResource, input/output/model/viewChild, RxJS, NgRx, @defer + zoneless, formulários, SSR, testes
- Phase 3 — SAP Commerce and OCC (semana 5, 7 passos): backend, Staged/Online, Swagger, OAuth2, carrinho via API, CMS, CORS
- Phase 4 — Composable Storefront (semanas 6–8, 12 passos): RBSC, schematics, configuração, facades, CMS mapping, outlets, layout, tema, i18n, normalizer, SSR, acessibilidade
- Phase 5 — Individual final project (semanas 9–10, 10 passos): comparador de produtos (CMSFlexComponent, serviço com signals, botão via outlet, página com facade + RxJS, badge, testes, SSR/a11y, upgrade, vídeo)
- Progress tracking and self-assessment
- Glossary of acronyms and terms
- Resources and references

Versões-alvo: Composable Storefront 221121.x, Angular 21, Node.js 22.

## Resultado da verificação (15/10/2026)

Ambiente: Node 22.22, npm 11.21, Angular CLI 21.2.27, Chromium headless (Playwright).

**Fases 1 e 2: executadas de verdade.** Todos os trechos e soluções de exercícios compilaram, rodaram no navegador (com a API dummyjson simulada, porque não era acessível do ambiente) e os testes passaram (4/4). SSR conferido pelo HTML gerado no servidor.

**Fases 3 a 5: verificadas contra o código-fonte** do Spartacus (`github.com/SAP/spartacus`, branch develop, commit `9c0b2a8`, Angular 21.2). Todas as 30 classes, caminhos de import, chaves de configuração, nomes de slots/componentes CMS e flags do `ng add` usados no plano existem. **Não** foram executadas contra um backend SAP Commerce real (não havia backend nem credenciais do RBSC; no npm público só existe Spartacus 4.3).

### Problemas encontrados e já corrigidos no documento

| # | Onde | Problema | Correção |
| --- | --- | --- | --- |
| 1 | Fase 1, Passo 1 | npm 10 (que vem com o Node 22) falha com `Cannot read properties of null (reading 'edgesOut')` no `ng new` | `npm install -g npm@11` e `npm install` |
| 2 | Fase 1, Passo 6 e Fase 5, Passo 3 | No Angular 21, `ng generate service product` cria `product.ts` com classe `Product` | Usar `--type=service` |
| 3 | Fase 1, Passo 6 | Tipo `Product` da API dummyjson nunca era definido | Adicionado `src/app/product.model.ts` |
| 4 | Fase 2, Passo 6 | Experimento zoneless estava errado: o contador comum também atualizava | Novo experimento: contador comum fica em 0 até um botão mudar um signal |
| 5 | Fase 2, Passo 6 | `@defer` não gera chunk separado com `ng serve` (hot reload) | Usar `ng serve --no-hmr` |
| 6 | Fase 2, Passo 5 | `ng add @ngrx/store` já insere `provideStore()` | Substituir por `provideStore({ cart: cartReducer })`, não duplicar |
| 7 | Fase 2, Passo 8 | `ng add @angular/ssr` usa `RenderMode.Prerender`; build falha na rota `product/:id` | Trocar para `RenderMode.Server` em `app.routes.server.ts` |
| 8 | Fase 2, Passo 8 | Servidor SSR rejeita host `localhost` e cai para renderização no cliente sem avisar | Rodar com `NG_ALLOWED_HOSTS=localhost` |
| 9 | Fase 2, Passo 9 | Specs "should create" geradas automaticamente falham | Apagá-las ou gerar com `--skip-tests`; configurar `provideStore` no teste do `Cart` |
| 10 | Fase 4, Passo 8 | `--cx-font-family` não existe no storefront | Fonte definida em `body { font-family: ... }` |
| 11 | Fase 4, Passo 10 | Exemplo do endpoint `details` não batia com o valor padrão real | Valor padrão atual + `warrantyYears` |
| 12 | Fase 3, Passo 4 | Versões atuais usam Authorization Code flow com `mobile_android_public` (toggle `authorizationCodeFlowByDefault`) | Explicado; `mobile_android` + password grant mantido só para estudo |

## Pendências

- [ ] **Duração:** sugeri passar de 10 para **12 semanas** (Fase 2 com 3 semanas + 1 semana de folga para acesso ao backend na Fase 3). Ainda não aplicado no documento nem no diagrama.
- [ ] **Dedicação semanal:** há um comentário no documento (agora desanexado do trecho) perguntando se 6 h/semana é viável. Resolver ou ajustar.
- [ ] **Rodar Fases 3–5 contra um backend real** no ambiente do projeto (sandbox ou CCv2 dev) e com credenciais do RBSC.
- [ ] **Confirmar a URL do registro RBSC** no `.npmrc` (Fase 4, Passo 1) na página oficial da SAP.
- [ ] Alguns links da SAP apontam para a página inicial do Help Portal com o nome da página a procurar (não consegui confirmar o endereço direto). O site `sap.github.io/spartacus-docs` é da versão 4.x: serve para conceitos; detalhes devem ser confirmados no Help Portal.
- [ ] Na Fase 4, Passo 11, conferir se o servidor SSR do storefront também precisa de configuração de hosts permitidos (o `server.ts` do Spartacus usa `NgExpressEngineDecorator` + `getOriginValidationMiddleware`, não o `AngularNodeAppEngine`).

## Sugestões de próximos passos no Claude Code

1. Descompactar `catalog-reference.zip` numa pasta `training/` e rodar `npm install && npx ng test --watch=false` para confirmar o ambiente local.
2. Com acesso a um backend: criar `training/mystore` seguindo a Fase 4 e pedir ao Claude Code para executar os passos 1–12 e o projeto final da Fase 5, anotando o que mudar.
3. Gerar um repositório "gabarito" com um branch por fase (`phase1`, `phase2`...) para o time comparar as próprias soluções.
4. Decidir as pendências de duração/dedicação e atualizar o documento.

## Fatos úteis verificados

- Angular 21: projetos novos são zoneless por padrão (sem `zone.js`), usam Vitest e arquivos sem sufixo `.component`.
- Spartacus (develop): pacotes em `core-libs/` e `feature-libs/`; `ActiveCartFacade` em `@spartacus/cart/base/root`; `CurrentProductService`, `CmsComponentData`, `OutletRefDirective`/`OutletRefModule`, `LayoutConfig` em `@spartacus/storefront`; `provideConfig`, `ProductService`, `ProductScope`, `PRODUCT_NORMALIZER`, `Occ`, `I18nModule` em `@spartacus/core`; `NgExpressEngineDecorator` em `@spartacus/setup/ssr`.
- O schematic `ng add @spartacus/schematics` aceita `--baseUrl`, `--baseSite`, `--currency`, `--language`, `--ssr`, `--features`, `--lazy`, `--theme`, entre outros, e cria `app.module.ts` em apps standalone.
- Layout padrão da PDP: `Summary`, `UpSelling`, `CrossSelling`, `Tabs`, `PlaceholderContentSlot`.
