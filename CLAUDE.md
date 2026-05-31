# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Serve dist/ locally
npm run lint      # ESLint
npm test          # Vitest (watch mode)
npx vitest run    # Vitest single pass (CI)
npx vitest run src/hooks/usePosts.test.js  # Run single test file
```

## Environment Variables

Copy `.env` and set:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_WALLETCONNECT_PROJECT_ID=
VITE_LIGHTHOUSE_API_KEY=
```

Missing `VITE_WALLETCONNECT_PROJECT_ID` falls back to a placeholder — wallet connections will fail but the app won't crash.

## Architecture

**Stack**: React 18 + Vite, Wagmi v2 + RainbowKit (Filecoin / Filecoin Calibration chains), Supabase (Postgres + Auth), Lighthouse Web3 SDK (IPFS/Filecoin pinning), TanStack Query.

**Routing**: Custom hash router in `src/App.jsx`. `parseHash()` maps `window.location.hash` segments to view names. All navigation uses `navTo(hash)` from `src/data/constants.js`. No React Router — adding a new route means adding a case to `parseHash()` and a `case` in the switch inside `App`.

**Auth**: `src/hooks/useAuth.js` unifies two auth methods — EVM wallet via `wagmi` (`useAccount`) and email/password via Supabase Auth. `connected = isConnected || !!emailSession`. The user `identity` is the wallet address (when wallet-connected) or `email-prefix.fil` (when email-authenticated).

**Data flow**: Three custom hooks in `src/hooks/` own all Supabase operations:
- `usePosts` — fetches posts on mount (falls back to `SEED_POSTS` until Supabase responds), exposes `createPost`
- `useVotes` — `toggleVote` upserts/deletes in the `votes` table
- `useComments` — `addComment` inserts into `comments` table

All hooks live at the `App` level and pass handlers down as props. There is no global state manager (no Redux, no Zustand, no Context API for state — only the provider wrappers in `main.jsx` for wagmi/RainbowKit/Query).

**Reactions and replies** are local-only state (not persisted to Supabase). `reactPost`, `reactComment`, and `replyComment` manipulate the `posts` array in `App` state directly.

**IPFS uploads**: `src/hooks/useLighthouse.js` wraps the Lighthouse SDK. Called from `NewPostView` when the user attaches evidence files. Returns a CID hash.

**Static/seed data**: `src/data/constants.js` holds all static data (categories, ambassadors, proposals, events, meetings, docs, banners, notifications). `src/data/seed.js` provides `SEED_POSTS` used as the initial posts state before Supabase responds.

**Supabase schema**: `supabase/schema.sql`. Three tables — `posts`, `votes`, `comments` — all with Row Level Security. Anyone can read; inserts require `authenticated` role.

## Key Patterns

- `ME` object in `constants.js` is mutated directly in `App.jsx` to reflect the connected identity and avatar. This is intentional global mutable state for the logged-in user.
- `flash(msg)` triggers the toast via local state; pages can also fire `window.dispatchEvent(new CustomEvent('orbit-toast', { detail: msg }))` to reach it from anywhere.
- `LandingView` and `MaintenanceView` suppress the `Navbar` (`maximized = true`).
- CSS lives in `src/styles/forum.css` (forum layout) and `src/styles/orbit.css` (design system tokens/components). The root `orbit.css` and `forum.css` are legacy files — prefer `src/styles/`.

## Testing

Tests use Vitest + `@testing-library/react`. Supabase is mocked via `vi.mock('../lib/supabase', ...)`. Test files co-locate with hooks (`src/hooks/*.test.js`). `src/test-setup.js` imports `@testing-library/jest-dom` for DOM matchers.
