# Plano de modernização — `src/pages/AirlinesPage.jsx`

## Objetivo

Modernizar `AirlinesPage.jsx` em fases de baixo risco, sem quebrar o sistema existente, mantendo o contrato atual da API (`GET /airlines` e `POST /airlines`) e preservando um caminho de rollback rápido em cada etapa.

## Restrições

- Não quebrar o fluxo atual de listagem e criação de airlines durante a migração.
- Manter os endpoints e payloads existentes da API.
- Entregar em fases pequenas, com validação objetiva antes de avançar.
- Priorizar compatibilidade com a arquitetura atual do projeto (`src/api`, `src/hooks`, `src/pages`, `tests/`).

## Estratégia de migração

A migração será feita em quatro fases independentes, cada uma com escopo limitado e reversão simples.

---

## Fase 1 — Estabilização

**Risco:** muito baixo

**Objetivo:** eliminar os problemas mais perigosos de produção sem alterar a arquitetura geral da página.

### O que mudar

- Substituir a URL hardcoded por `VITE_API_URL` com fallback centralizado na camada correta.
- Adicionar `timeout` de 10s nas chamadas `GET` e `POST`.
- Remover mutações diretas de estado e da resposta da API.
- Corrigir `useEffect` com cleanup de `setInterval` e `setTimeout` temporários.
- Remover qualquer item artificial inserido na lista.
- Garantir mensagem básica de erro visível ao usuário.
- Garantir loading state previsível durante carregamento inicial e submissão.
- Parar de usar `console.log` no fluxo normal da página.

### Impacto no usuário

- Passa a ver mensagem de erro quando a API falhar.
- Deixa de ver itens fantasmas na lista.
- A tela fica mais estável ao navegar entre páginas.
- O comportamento visual continua praticamente igual, com menor chance de travamento.

### Rollback (< 5 minutos)

- Reverter apenas o commit da Fase 1.
- Como a fase não altera contrato de API nem estrutura pública do componente, o rollback é direto e isolado.
- Validar rapidamente com `npm run lint` e abertura manual da página após revert.

### Checklist de verificação antes/deploy

- `GET /airlines` continua funcionando com a mesma resposta esperada.
- `POST /airlines` continua criando itens normalmente.
- Não há `push()` em arrays de estado ou de resposta da API.
- Não há URL hardcoded na página.
- Timeouts estão aplicados.
- Mensagem de erro aparece na UI quando a API falha.
- Não há timers sem cleanup no componente.
- `npm run lint`
- `npm test`

### Tempo estimado

- 1 a 2 horas

### Critério de sucesso

- A página lista e cria airlines normalmente.
- Em falha simples de rede, o usuário vê feedback claro.
- Não há item temporário/falso renderizado.
- Não há warning de atualização de estado após unmount.

---

## Fase 2 — Resiliência

**Risco:** baixo

**Objetivo:** tornar a página tolerante à indisponibilidade da API sem mudar o contrato funcional.

### O que mudar

- Adicionar retry mechanism com até 3 tentativas para `GET /airlines` e `POST /airlines`.
- Implementar tratamento explícito para HTTP `503`.
- Adicionar cache de `GET /airlines` em `localStorage`.
- Implementar estratégia `stale-while-revalidate` para exibir cache imediatamente e revalidar em segundo plano.
- Exibir aviso de offline/fallback quando o cache for usado por indisponibilidade da API.
- Centralizar regras de retry, timeout e erro amigável na camada `src/api` ou utilitário compatível.

### Impacto no usuário

- A lista passa a abrir mais rápido quando houver cache local.
- Em indisponibilidade temporária da API, o usuário continua vendo dados recentes.
- Erros 503 passam a ter mensagem mais útil e previsível.

### Rollback (< 5 minutos)

- Reverter o commit da Fase 2.
- Se necessário, manter apenas o timeout da Fase 1 e remover cache/retry.
- Como os endpoints e a UI principal permanecem os mesmos, o rollback não exige migração de dados.

### Checklist de verificação antes/deploy

- Retry limitado a 3 tentativas.
- Timeout continua em 10s.
- `503` mostra mensagem específica ao usuário.
- Cache de `GET /airlines` é gravado e lido corretamente.
- Fluxo `stale-while-revalidate` não duplica itens nem pisca incorretamente.
- Em API offline, a UI mostra dados em cache com aviso claro.
- Em cache vazio + API offline, a UI mostra erro amigável.
- `npm run lint`
- `npm test`
- Testes de integração cobrindo sucesso, `503` e fallback de cache.

### Tempo estimado

- 3 a 5 horas

### Critério de sucesso

- Com API estável, comportamento permanece correto.
- Com `503`, a tela não quebra e informa o usuário.
- Com dados em cache, a lista continua utilizável mesmo sem resposta imediata da API.
- Retry não entra em loop infinito.

---

## Fase 3 — Refatoração

**Risco:** médio

**Objetivo:** separar responsabilidades e alinhar a página à arquitetura do projeto.

### O que mudar

- Extrair a lógica de leitura/criação de airlines para `useAirlines`.
- Mover acesso HTTP para a camada `src/api/airlinesApi.js` e/ou `httpClient.js`.
- Deixar `AirlinesPage.jsx` focada em composição de UI e estados de apresentação.
- Remover mutações de estado remanescentes e usar atualizações imutáveis.
- Adicionar testes unitários para hook e página.
- Adicionar testes de integração cobrindo loading, sucesso, erro e cache/fallback.
- Garantir que componentes maiores atendam ao requisito de documentação/JSDoc conforme política do projeto.

### Impacto no usuário

- Nenhuma mudança funcional esperada.
- Menor chance de regressão futura.
- Comportamento tende a ficar mais consistente entre refresh, load inicial e criação.

### Rollback (< 5 minutos)

- Reverter o commit da Fase 3 inteiro.
- Se necessário, restaurar a implementação anterior da página mantendo as melhorias das Fases 1 e 2.
- Como não há mudança de contrato externo, rollback é principalmente estrutural.

### Checklist de verificação antes/deploy

- `AirlinesPage.jsx` não faz chamadas Axios diretamente.
- `useAirlines` encapsula loading, error, retry, cache e create.
- Não existem mutações diretas de arrays/objetos de estado.
- Testes unitários do hook cobrindo sucesso e falha.
- Testes da página cobrindo render, feedback ao usuário e submissão.
- `npm run lint`
- `npm test`

### Tempo estimado

- 4 a 6 horas

### Critério de sucesso

- A página fica menor, mais legível e sem lógica de infraestrutura misturada à UI.
- A cobertura dos caminhos críticos melhora.
- O comportamento visto pelo usuário permanece equivalente ou melhor.

---

## Fase 4 — Performance e DX

**Risco:** baixo

**Objetivo:** reduzir ruído técnico, melhorar estabilidade de render e facilitar manutenção.

### O que mudar

- Aplicar `useCallback` para handlers passados a filhos quando houver benefício real.
- Aplicar `useMemo` apenas onde houver cálculo derivado relevante.
- Corrigir `key` do `map` para usar `airline.id` estável.
- Remover logs restantes de desenvolvimento.
- Revisar props e renders desnecessários de componentes filhos.
- Ajustar mensagens e estados visuais para uma UX mais previsível.

### Impacto no usuário

- Interface mais consistente e potencialmente mais responsiva.
- Menos glitches de renderização em listas.
- Menos ruído técnico para manutenção futura.

### Rollback (< 5 minutos)

- Reverter o commit da Fase 4.
- Como a fase é de refinamento, a reversão não afeta contrato de API nem fluxo principal.

### Checklist de verificação antes/deploy

- Lista usa chave estável por item.
- Não há `console.log` em código de produção.
- Handlers passados a filhos foram estabilizados onde necessário.
- Não houve regressão visual em loading, erro e sucesso.
- `npm run lint`
- `npm test`
- Revisão manual rápida de criação, listagem e refresh.

### Tempo estimado

- 1 a 2 horas

### Critério de sucesso

- Nenhum warning de key no React.
- Menos renders evitáveis em componentes filhos.
- Código mais limpo, com menor custo de manutenção.

---

## Ordem recomendada de execução

1. Fase 1 — estabilizar sem mexer na arquitetura.
2. Fase 2 — adicionar resiliência mantendo a UI atual.
3. Fase 3 — extrair hook e consolidar testes.
4. Fase 4 — otimizar performance e limpar DX.

## Gates para avançar entre fases

- Não avançar para a próxima fase sem `lint` e `tests` verdes.
- Validar manualmente a página de airlines após cada fase.
- Se houver regressão em listagem ou criação, interromper a sequência e reverter a fase atual.

## Definição de pronto final

- `AirlinesPage.jsx` deixa de conter lógica HTTP direta.
- Todos os calls a `GET /airlines` e `POST /airlines` têm timeout, retry e mensagens amigáveis.
- `GET /airlines` usa cache local com `stale-while-revalidate`.
- Erro `503` tem tratamento específico.
- Não há mutação direta de estado.
- A página possui testes cobrindo os caminhos críticos.
- O comportamento funcional externo permanece compatível com o sistema atual.
