# Changelog

Todas as mudanças notáveis do projeto são documentadas aqui.
Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)

## [Unreleased]

## [0.3.3] - 2026-03-26
### Added
- Adiciona suporte a ambientes linux

## [0.3.2] - 2026-03-26
### Added
- RaidWeeks agora reflete alterações realizadas por outros usuários sem a necessidade de atualizar a página

## [0.3.1] - 2026-03-26
### Added
- Criação de changelog usando o modelo [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)

## [0.3.0] - 2026-03-26
### Added
- Versionamento centralizado via `package.json` como fonte única de verdade
- Script `bun run bump <versão>` para sincronizar `package.json` e `Cargo.toml`
- Versão exibida dinamicamente em `LoginPage` e `TitleBar` via `getVersion()`

### Fixed
- `releaseDraft: false` — release agora é publicada imediatamente (antes ficava como draft)
- `VITE_API_URL` injetado via GitHub Secret no build de produção
- `createUpdaterArtifacts: true` adicionado ao bundle para gerar `latest.json`

## [0.2.1] - 2026-03-01
### Added
- Auto update com `tauri-plugin-updater`
- Componente `UpdateNotification` com banner de nova versão
- GitHub Actions workflow de release automático via tag `v*`
