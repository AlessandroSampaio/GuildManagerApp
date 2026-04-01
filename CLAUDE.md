# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
bun tauri dev        # Start Tauri desktop app in dev mode
bun dev              # Start frontend only (no native window)

# Build
bun tauri build      # Build native desktop app
bun run build        # Vite frontend build only

# Version bump
bun run bump         # Sync version across package.json and src-tauri/Cargo.toml
```

No test suite is configured.

## Architecture

GuildManagerApp is a **Tauri 2.x desktop app** that acts as a client for the WarcraftLogs Integration API. It manages guild raid data, player scoring, and reporting.

### Frontend

- **Framework:** SolidJS with fine-grained signals (not React)
- **Routing:** `@solidjs/router` with `HashRouter`; routes defined in `src/App.tsx`
- **Server state:** TanStack Solid Query (`@tanstack/solid-query`) — custom hooks live in `src/lib/queries/`
- **Forms:** `@modular-forms/solid` + Zod schemas (`src/schemas/`)
- **Styling:** TailwindCSS 3 with a custom palette in `tailwind.config.js`
- **Build:** Vite 6 with `vite-plugin-solid`

### Backend / IPC

- **Runtime:** Tauri 2.x (Rust); entry points are `src-tauri/src/main.rs` and `lib.rs`
- **IPC:** TauRPC 1.8 — type-safe Rust↔JS proxies in `src/ipc/index.ts` (`windowIpc`, `wclAuthIpc`, `fileOpsIpc`)
- **OAuth:** Embedded WebView for WarcraftLogs OAuth; handled by `src-tauri/src/wcl_auth.rs` and `src/pages/WclCallbackPage.tsx`
- **Auto-update:** `src-tauri/src/updater.rs` via `tauri-plugin-updater`

### Key Patterns

**Data flow:**
`src/api/*.ts` (HTTP fetch wrapper) → `src/lib/queries/*.ts` (TanStack Query hooks) → page/component

- `src/api/client.ts`: generic `req<T>()` with auto Bearer injection and 401/refresh retry
- `src/stores/auth.ts`: SolidJS signal-based auth store; tokens in `sessionStorage`
- `src/lib/query-keys.ts`: typed key factory used across all query hooks

**Route guards:** `Guard` (auth check) and `AdminGuard` (role check) wrap protected routes in `App.tsx`.

**WebSocket hooks:** `src/lib/useImportWs.ts`, `useRaidWeekWs.ts`, `useGuildSyncWs.ts` for real-time progress streaming.

**Excel export:** `src/lib/export-xlsx.ts` using `xlsx` / `xlsx-js-style`.

### Directory Layout

```
src/
  api/          HTTP API modules (one file per domain)
  components/   layout/, ui/, forms/, icons/
  helpers/      formatters, role utils, week helpers, constants
  ipc/          Tauri IPC bindings
  lib/
    queries/    TanStack Query custom hooks
    *.ts        WebSocket hooks, query client, query keys, xlsx export
  pages/        Route-level components (13 pages)
  schemas/      Zod validation schemas
  stores/       SolidJS signal stores (auth only)
  types/        TypeScript interfaces
src-tauri/      Rust Tauri backend
```
