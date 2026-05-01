# AGENTS.md

## Commands

```bash
cd client && npm start     # dev server on port 3000
cd client && npm run build  # production build
cd client && npm test      # run tests (Jest via react-scripts)
```

Single test: `npm test -- --testPathPattern=ComponentName`

## Structure

- **client/** — Frontend React app (only folder; no server exists)
- **cliente_clase/** — Alternative client version (legacy)
- **docs/** — Case study documentation

## Key Context Files

- `client/CLAUDE.md` — Detailed frontend architecture (read first)
- `CLAUDE.md` — Minimal root file

## Gotchas

- No server/backend folder in repo (expects external API via `REACT_APP_API_URL` in `.env`)
- Uses `react-scripts` (CRA), not Vite or Next.js — no configurable linter/typechecker
- JWT auth tokens stored in `localStorage` keys: `authToken`, `appUser`
- Role routing: `ADMIN`, `TEACHER`, `STUDENT`, `VISITOR`
- All games share `{GameName}AccessPanel.jsx` + `{GameName}GameView.jsx` structure
- TanStack Query config: `staleTime: Infinity`, `gcTime: 15min`

## References

- `client/src/config/activityConfig.js` — Activity types (frozen)
- `client/src/utils/roles.js` — Role definitions
- `client/src/config/navigation.js` — Role-based sidebar