# Airlines App

Frontend React built with Vite for managing airlines and airplanes against a legacy REST API.

## Installation

```bash
npm install
npm run dev
```

## Environment variables

Create a `.env.local` file based on `.env.example`.

- `VITE_API_URL`: base URL for the legacy API
- `VITE_USE_MOCK`: when `true`, the app uses local mock data for reads and writes

## Scripts

- `npm run dev`: start the development server
- `npm run build`: create a production build
- `npm run preview`: preview the production build locally
- `npm run lint`: run ESLint
- `npm run test`: run Vitest in CI mode

## API routes

### Airlines

- `GET /airlines` → `{ ok: true, data: Airline[] }`
- `POST /airlines` → body `{ name, hub }`

### Airplanes

- `GET /airplanes` → `{ ok: true, data: Airplane[] }`
- `POST /airplanes` → body `{ model, manufacturer, capacity, prefix, status }`

## Resilience behavior

- 10 second timeout on every API call
- Up to 3 retries with exponential backoff for timeout, network and `5xx` errors
- `localStorage` cache with 5 minute TTL for GET endpoints
- Stale-while-revalidate list loading with cached fallback when the API is offline
- Feature-level error boundaries for Airlines and Airplanes

## Project structure

```text
src/
  api/
  components/
  hooks/
  mocks/
  pages/
  store/
  styles/
  utils/
tests/
  integration/
  unit/
```
