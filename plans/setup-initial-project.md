# Plan: Setup Initial Project

**Complexity:** L

## Problem Statement

O projeto `airlines-app` precisa de uma base frontend completa em React 18 + Vite para consumir a API legada de airlines e airplanes com comportamento resiliente diante de indisponibilidade frequente da API. O setup inicial deve entregar arquitetura pronta para evolução, cobrindo estado global, camada HTTP robusta, cache local com fallback, páginas funcionais para as duas features principais e documentação suficiente para o `@implementer` executar sem ambiguidade.

## Success Criteria

- [ ] Projeto Vite em React 18 inicializado com `npm` e dependências obrigatórias: `@reduxjs/toolkit`, `react-redux`, `axios`, `styled-components`, `react-icons`
- [ ] Estrutura base criada em `src/store`, `src/api`, `src/pages`, `src/components`, `src/styles`, `src/hooks`, `src/utils`, `src/mocks`
- [ ] Redux Toolkit configurado com `store`, `airlinesSlice` e `airplanesSlice`, incluindo thunks assíncronos para listagem e criação
- [ ] `main.jsx` conectado com `Provider` do Redux e `ThemeProvider` do styled-components
- [ ] Instância Axios configurada com `baseURL` via `VITE_API_URL`, `timeout` de 10s e retry de 3 tentativas com backoff exponencial para erros `5xx` e `503`
- [ ] Serviços de API criados para `getAirlines`, `postAirline`, `getAirplanes`, `postAirplane`
- [ ] Cache `localStorage` com TTL de 5 minutos e estratégia stale-while-revalidate para todos os `GET`
- [ ] `AirlinesPage` e `AirplanesPage` implementadas com listagem, formulário de criação, estados de loading/error e fallback para cache
- [ ] Cada feature protegida por `ErrorBoundary`
- [ ] Componentes reutilizáveis criados: `LoadingSpinner`, `AirlineCard`, `AirplaneCard`, formulários reutilizáveis com validação básica
- [ ] Layout responsivo mobile-first com tema global, `Header`, `MainContainer` e `Footer`
- [ ] Testes adicionados para componentes novos, fluxos críticos de API/forms/navegação e scripts `test`, `lint`, `build`, `dev`, `preview` funcionando
- [ ] `README.md` documentado com instalação, variáveis de ambiente, scripts e rotas da API

## API Dependencies

- **Base URL:** `https://airline-manager-23mn.onrender.com`
- **Configuração obrigatória:** usar `VITE_API_URL` como fonte da URL base e `VITE_USE_MOCK` para modo offline/desenvolvimento

### Airlines

- **Endpoint:** `GET /airlines`
- **Request format:** sem body
- **Response format:** `{ ok: true, data: Airline[] }`
- **Client behavior:**
  - Ler cache imediatamente se disponível
  - Disparar revalidação em background
  - Atualizar cache em sucesso
  - Em falha final após retries, usar cache válido como fallback e exibir aviso amigável

- **Endpoint:** `POST /airlines`
- **Request format:** `{ name, code, country? }`
- **Response format:** `{ ok: true, data: Airline }`
- **Client behavior:**
  - Validar `name` e `code` antes do envio
  - Exibir loading durante submissão
  - Em sucesso, atualizar estado global e opcionalmente revalidar lista
  - Em falha, exibir mensagem amigável sem perder dados em tela

### Airplanes

- **Endpoint:** `GET /airplanes`
- **Request format:** sem body
- **Response format:** `{ ok: true, data: Airplane[] }`
- **Client behavior:**
  - Mesmo padrão de cache + revalidação da listagem de airlines

- **Endpoint:** `POST /airplanes`
- **Request format:** `{ model, airlineId, capacity }`
- **Response format:** `{ ok: true, data: Airplane }`
- **Client behavior:**
  - Validar `model`, `airlineId` e `capacity`
  - Normalizar `capacity` para número
  - Em sucesso, atualizar estado global e revalidar lista se necessário

### Error Handling Contract

- Timeout fixo de `10000ms`
- Retry automático de `3` tentativas para falhas transitórias (`5xx`, `503`, timeout, network error`)
- Backoff exponencial sugerido: `500ms`, `1000ms`, `2000ms`
- Mensagens amigáveis diferenciando:
  - indisponibilidade temporária da API
  - timeout
  - falha de validação no formulário
  - ausência de cache disponível

## Component Architecture

### New Components

- `src/components/common/ErrorBoundary.jsx`
  - Responsabilidade: capturar falhas em runtime por feature e renderizar fallback seguro
  - Observação: apesar da preferência por hooks, este componente será uma **classe** porque error boundary nativo do React exige classe; isso é exceção técnica justificada ao requisito geral de modern React

- `src/components/common/LoadingSpinner.jsx`
  - Props: `size`, `label`, `fullScreen`
  - Responsabilidade: feedback visual padronizado para operações assíncronas

- `src/components/layout/AppShell.jsx`
  - Props: `children`
  - Responsabilidade: compor `Header`, container principal e `Footer`

- `src/components/layout/Header.jsx`
  - Props: nenhuma
  - Responsabilidade: título do app e navegação entre páginas

- `src/components/layout/Footer.jsx`
  - Props: nenhuma
  - Responsabilidade: rodapé simples com contexto da aplicação

- `src/components/airlines/AirlineCard.jsx`
  - Props: `airline`
  - Responsabilidade: exibir dados de airline de forma consistente e acessível

- `src/components/airplanes/AirplaneCard.jsx`
  - Props: `airplane`, `airlineName?`
  - Responsabilidade: exibir dados de airplane e relacionamento com airline

- `src/components/forms/FormField.jsx`
  - Props: `id`, `label`, `error`, `children`, `hint`
  - Responsabilidade: wrapper acessível e reutilizável para inputs

- `src/components/forms/AirlineForm.jsx`
  - Props: `onSubmit`, `isSubmitting`
  - Responsabilidade: formulário reutilizável para criação de airline

- `src/components/forms/AirplaneForm.jsx`
  - Props: `onSubmit`, `isSubmitting`, `airlineOptions`
  - Responsabilidade: formulário reutilizável para criação de airplane

- `src/components/common/StatusBanner.jsx`
  - Props: `type`, `message`
  - Responsabilidade: exibir erro, aviso de cache ou sucesso de forma consistente

### Modified Components

- `src/App.jsx`
  - Passa a definir roteamento simples entre `AirlinesPage` e `AirplanesPage` e encapsular o shell principal

- `src/main.jsx`
  - Passa a registrar `Provider`, `ThemeProvider`, estilos globais e `ErrorBoundary` de alto nível se necessário

### Pages

- `src/pages/AirlinesPage.jsx`
  - Busca airlines no mount
  - Renderiza banner de fallback/cache quando necessário
  - Renderiza `AirlineForm` + lista de `AirlineCard`
  - Encapsulada em `ErrorBoundary`

- `src/pages/AirplanesPage.jsx`
  - Busca airplanes no mount
  - Usa airlines já carregadas para popular select do formulário
  - Renderiza `AirplaneForm` + lista de `AirplaneCard`
  - Encapsulada em `ErrorBoundary`

## State Management

### Justificativa para Redux

O `AGENTS.md` prefere Context API para estado compartilhado simples, mas neste caso há justificativa explícita para Redux Toolkit porque existem **dois domínios assíncronos relacionados** (`airlines` e `airplanes`), com necessidade de:

- compartilhar dados entre páginas e formulários
- centralizar `loading`, `error`, `lastFetched`, `isFallback`, `retry metadata`
- padronizar fluxos `GET`/`POST` com `createAsyncThunk`
- manter escalabilidade para futuras features sem proliferar providers customizados

### Store Structure

- `src/store/index.js`
  - exporta `store`
  - combina reducers `airlines` e `airplanes`

- `src/store/slices/airlinesSlice.js`
  - **state:**
    - `items: []`
    - `loading: false`
    - `submitting: false`
    - `error: null`
    - `warning: null`
    - `lastFetched: null`
    - `isFallback: false`
  - **async thunks:**
    - `fetchAirlines`
    - `createAirline`
  - **reducers locais:**
    - `clearAirlinesError`
    - `clearAirlinesWarning`

- `src/store/slices/airplanesSlice.js`
  - **state:**
    - `items: []`
    - `loading: false`
    - `submitting: false`
    - `error: null`
    - `warning: null`
    - `lastFetched: null`
    - `isFallback: false`
  - **async thunks:**
    - `fetchAirplanes`
    - `createAirplane`
  - **reducers locais:**
    - `clearAirplanesError`
    - `clearAirplanesWarning`

### Hooks / Selectors

- `src/hooks/useAirlines.js`
  - abstrai `dispatch`, `selectors` e efeitos de carregamento da feature

- `src/hooks/useAirplanes.js`
  - abstrai `dispatch`, `selectors` e efeitos da feature

- `src/store/selectors/`
  - opcional neste setup inicial; pode começar com seletores simples co-localizados nos hooks

## Resilience Checklist (must all be present)

- [ ] Timeout de `10s` em toda chamada HTTP
- [ ] Retry automático de `3` tentativas com backoff exponencial
- [ ] Fallback para cache `localStorage` com TTL de `5 minutos`
- [ ] Estratégia stale-while-revalidate para `GET /airlines` e `GET /airplanes`
- [ ] Loading state para carregamento inicial e submissão de formulários
- [ ] Mensagem de erro amigável para falha sem cache
- [ ] Mensagem de aviso amigável quando dados exibidos vierem do cache
- [ ] Error boundary por feature (`Airlines`, `Airplanes`)
- [ ] Timeout/network/503 tratados de forma diferenciada no parser de erro
- [ ] `VITE_USE_MOCK` previsto para permitir evolução do modo offline
- [ ] Sem side effects no render; fetches apenas em hooks/`useEffect`/thunks
- [ ] Sem hardcode de URL; uso obrigatório de `VITE_API_URL`

## File Changes

| File | Action | Description |
| --- | --- | --- |
| `package.json` | Create/Modify | Definir scripts `dev`, `build`, `preview`, `lint`, `test` e dependências obrigatórias do stack |
| `vite.config.js` | Create | Configuração padrão do Vite para React |
| `index.html` | Create | Entry HTML do app |
| `.gitignore` | Create/Modify | Ignorar `node_modules`, `dist`, `.env.local` |
| `.env.example` | Create | Documentar `VITE_API_URL` e `VITE_USE_MOCK` |
| `README.md` | Create/Modify | Instruções de instalação, ambiente, scripts e rotas da API |
| `src/main.jsx` | Create | Bootstrap do React com `Provider` e `ThemeProvider` |
| `src/App.jsx` | Create | Shell principal e composição das páginas |
| `src/styles/theme.js` | Create | Tema global de cores, spacing, typography, breakpoints |
| `src/styles/GlobalStyles.js` | Create | Reset global e estilos base com styled-components |
| `src/styles/layout.js` | Create | Containers e wrappers globais reutilizáveis |
| `src/api/httpClient.js` | Create | Instância Axios com timeout, interceptors e retry/backoff |
| `src/api/airlinesApi.js` | Create | `getAirlines` e `postAirline` |
| `src/api/airplanesApi.js` | Create | `getAirplanes` e `postAirplane` |
| `src/utils/constants.js` | Create | Constantes como `API_BASE_URL`, `MAX_RETRIES`, `CACHE_TTL_MS` |
| `src/utils/storage.js` | Create | Helpers de cache com TTL e stale-while-revalidate |
| `src/utils/errorHandling.js` | Create | Normalização de mensagens de erro para UI |
| `src/mocks/airlines.js` | Create | Mock dataset para desenvolvimento offline futuro |
| `src/mocks/airplanes.js` | Create | Mock dataset para desenvolvimento offline futuro |
| `src/store/index.js` | Create | Configuração da Redux store |
| `src/store/slices/airlinesSlice.js` | Create | Slice + thunks de airlines |
| `src/store/slices/airplanesSlice.js` | Create | Slice + thunks de airplanes |
| `src/hooks/useAirlines.js` | Create | Hook de consumo da feature airlines |
| `src/hooks/useAirplanes.js` | Create | Hook de consumo da feature airplanes |
| `src/components/common/ErrorBoundary.jsx` | Create | Boundary por feature com fallback visual |
| `src/components/common/LoadingSpinner.jsx` | Create | Spinner reutilizável |
| `src/components/common/StatusBanner.jsx` | Create | Banner de erro/aviso/sucesso |
| `src/components/layout/AppShell.jsx` | Create | Estrutura principal de layout |
| `src/components/layout/Header.jsx` | Create | Cabeçalho e navegação |
| `src/components/layout/Footer.jsx` | Create | Rodapé |
| `src/components/forms/FormField.jsx` | Create | Wrapper reutilizável para campos acessíveis |
| `src/components/forms/AirlineForm.jsx` | Create | Formulário de criação de airline |
| `src/components/forms/AirplaneForm.jsx` | Create | Formulário de criação de airplane |
| `src/components/airlines/AirlineCard.jsx` | Create | Card de airline |
| `src/components/airplanes/AirplaneCard.jsx` | Create | Card de airplane |
| `src/pages/AirlinesPage.jsx` | Create | Página da feature airlines |
| `src/pages/AirplanesPage.jsx` | Create | Página da feature airplanes |
| `tests/unit/components/common/ErrorBoundary.test.jsx` | Create | Testar fallback do boundary |
| `tests/unit/components/common/LoadingSpinner.test.jsx` | Create | Testar render do spinner |
| `tests/unit/components/forms/AirlineForm.test.jsx` | Create | Validar formulário e submissão |
| `tests/unit/components/forms/AirplaneForm.test.jsx` | Create | Validar formulário e submissão |
| `tests/unit/pages/AirlinesPage.test.jsx` | Create | Estados loading/error/success/cache |
| `tests/unit/pages/AirplanesPage.test.jsx` | Create | Estados loading/error/success/cache |
| `tests/integration/api/airlinesApi.test.js` | Create | Timeout/retry/cache para airlines |
| `tests/integration/api/airplanesApi.test.js` | Create | Timeout/retry/cache para airplanes |
| `tests/setupTests.js` | Create | Configuração do ambiente de testes |
| `eslint.config.js` ou `.eslintrc.cjs` | Create | Configuração de lint compatível com Vite/React |

## Task Breakdown

1. Inicializar o projeto Vite com React e configurar `package.json`, `vite.config.js`, `index.html`, ESLint e ambiente básico.
2. Instalar e configurar as dependências obrigatórias: Redux Toolkit, React Redux, Axios, styled-components e react-icons.
3. Criar estrutura de diretórios alinhada ao `AGENTS.md`, incluindo `src/api`, `src/store`, `src/pages`, `src/components`, `src/hooks`, `src/utils`, `src/styles`, `src/mocks` e `tests`.
4. Implementar tema global, estilos compartilhados e shell responsivo da aplicação (`Header`, `Footer`, container principal).
5. Implementar camada HTTP resiliente com Axios: timeout, interceptors, retry com backoff e parser centralizado de erro.
6. Implementar utilitários de cache `localStorage` com TTL de 5 minutos e helpers de stale-while-revalidate.
7. Criar serviços `airlinesApi` e `airplanesApi`, centralizando contrato de request/response e integração com cache.
8. Configurar Redux store e slices com `createAsyncThunk` para listagem e criação de airlines/airplanes.
9. Criar hooks de feature (`useAirlines`, `useAirplanes`) para encapsular acesso ao store e simplificar páginas.
10. Implementar componentes comuns (`ErrorBoundary`, `LoadingSpinner`, `StatusBanner`) e componentes de domínio (`AirlineCard`, `AirplaneCard`, formulários reutilizáveis).
11. Implementar `AirlinesPage` com listagem, formulário, loading, error e aviso de fallback de cache.
12. Implementar `AirplanesPage` com listagem, formulário, dependência de airlines para select e os mesmos estados resilientes.
13. Adicionar testes unitários e de integração para componentes, formulários, páginas e camada de API.
14. Atualizar `README.md` com setup, variáveis, scripts, rotas e comportamento resiliente/offline.
15. Executar `npm run lint`, `npm test` e `npm run build` antes de considerar a implementação concluída.
16. Submeter a diff para `@reviewer` e, por alterar a service layer de API, também para `@security` antes de commit.

## Rollback Plan

- Reverter o commit/PR inteiro caso o setup inicial quebre build, testes ou fluxo de desenvolvimento
- Como este é o bootstrap do projeto, não haverá feature flag funcional inicialmente: **Feature flag name: none**
- Se necessário, preservar apenas a inicialização mínima do Vite e remover temporariamente Redux/API/cache em uma reversão parcial
- Em caso de regressão na camada de API, voltar para mocks locais controlados via `VITE_USE_MOCK=true` até correção

## Alternatives Considered

1. **Context API + hooks locais** - rejeitada porque o requisito do usuário pede Redux Toolkit e porque haverá dois domínios assíncronos correlacionados com estados de loading/error/fallback compartilhados.
2. **React Query para cache e retries** - rejeitada para esta fase porque o `AGENTS.md` define React Query apenas para etapa posterior da migração; agora o objetivo é bootstrap simples e controlado com Axios + Redux.
3. **React Router para navegação** - adiada. Pode ser adotado depois, mas para o setup inicial um roteamento simples por estado local ou navegação mínima reduz escopo caso o projeto ainda esteja vazio.
4. **CSS Modules ou Tailwind** - rejeitadas porque o requisito obrigatório especifica styled-components.
5. **Error boundary com biblioteca externa** - rejeitada; o React já oferece suporte nativo suficiente para este caso.

## Open Questions

- Confirmar se a navegação inicial entre `AirlinesPage` e `AirplanesPage` deve usar `react-router-dom` mesmo não estando no stack obrigatório.
- Confirmar se o projeto deve nascer já com `Vitest + React Testing Library` ou se existe preferência por outra configuração de teste compatível com os scripts atuais.
- Confirmar se o modo `VITE_USE_MOCK` deve apenas preparar infraestrutura de mocks ou já permitir alternância real entre API remota e dados locais na primeira entrega.
- Confirmar se o layout inicial deve ter apenas duas seções/páginas simples ou se já deve incluir dashboard/home.

## Notes for Implementer

- Seguir as invariantes do `AGENTS.md`, especialmente `API contract`, `Resilience`, `Accessibility`, `Error boundaries` e `Documentation`.
- Para componentes acima de 50 linhas, incluir JSDoc conforme regra do projeto.
- Manter código em inglês e mensagens ao usuário claras.
- Evitar `console.log`; usar `console.error` e `console.warn` apenas quando realmente necessário.
- Não assumir disponibilidade da API em nenhum fluxo.
