# GuildManagerApp

Cliente desktop para a WarcraftLogs Integration API, construído com **Tauri 2.0 + SolidJS + TypeScript + TailwindCSS**.

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Tauri | 2.x | Runtime desktop nativo (Rust) |
| SolidJS | 1.9 | UI reativa granular |
| TypeScript | 5.x | Tipagem estática |
| TailwindCSS | 3.x | Estilização utility-first |
| Vite | 6.x | Build e dev server |
| @solidjs/router | 0.14 | Roteamento hash-based |

## Pré-requisitos

- [Node.js](https://nodejs.org) 18+
- [Rust](https://rustup.rs) (stable)
- [Tauri CLI prerequisites](https://tauri.app/start/prerequisites/) para seu OS

## Instalação

```bash
bun install
```

## Desenvolvimento

```bash
# Inicia o app Tauri em modo dev (abre janela nativa)
bun tauri dev

# Apenas o frontend (sem janela nativa)
bun dev
```

## Build

```bash
bun tauri build
```

## Configuração

Edite `.env` para apontar para sua API:

```
VITE_API_URL=https://localhost:5001
```

## Estrutura

```
src/
├── api/
│   └── client.ts          # Cliente HTTP tipado com auto-refresh JWT
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx   # Layout autenticado (TitleBar + Sidebar + Outlet)
│   │   ├── TitleBar.tsx   # Titlebar frameless com controles de janela
│   │   └── Sidebar.tsx    # Navegação lateral com status WCL
│   └── ui/
│       └── index.tsx      # Spinner, ErrorBanner, RankBar, etc.
├── pages/
│   ├── LoginPage.tsx       # Login / Register
│   ├── DashboardPage.tsx   # Visão geral + reports recentes
│   ├── ReportsPage.tsx     # Lista + modal de importação
│   ├── ReportDetailPage.tsx# Fights + performance por fight
│   └── SettingsPage.tsx    # Conta + OAuth WCL (janela integrada)
├── stores/
│   └── auth.ts             # Estado global de autenticação (signals)
└── types/
    └── api.ts              # Tipos TypeScript da API

src-tauri/
├── src/
│   ├── main.rs             # Entry point Rust
│   └── lib.rs              # Comandos Tauri (open_wcl_auth_window, wcl_auth_complete)
├── capabilities/
│   └── default.json        # Permissões Tauri 2.0
└── tauri.conf.json         # Configuração da aplicação
```

## Fluxo OAuth WCL

A tela de **Configurações** gerencia a vinculação da conta WarcraftLogs:

1. Usuário clica em **Autorizar WarcraftLogs**
2. O frontend chama `invoke("open_wcl_auth_window", { url })` → Rust abre uma `WebviewWindow` nativa com a URL do WarcraftLogs
3. O usuário autoriza no site oficial dentro da janela integrada
4. O backend da API recebe o callback OAuth, persiste o token e emite o evento `wcl-auth-complete`
5. O frontend recebe o evento, fecha a janela e atualiza o status
6. A partir deste ponto, importações usam automaticamente `/api/v2/user`

## Autenticação da API

- Access token JWT armazenado em `sessionStorage`
- Refresh automático via `POST /api/auth/refresh` em caso de 401
- Ao efetuar logout, o refresh token é revogado no servidor
