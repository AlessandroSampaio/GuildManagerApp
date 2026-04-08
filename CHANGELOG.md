# Changelog

Todas as mudanças notáveis do projeto são documentadas aqui.
Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)

## [Unreleased]

## [0.4.2] - 2026-04-08

### Added
- Adiciona informações de penalidades na visualização detalhada de pontos

## [0.4.1] - 2026-04-06

### Added
- Adiciona cores por desempenho na visualização simplificada de pontos
- Adiciona possibilidade de ordenação na visualização simplificada de pontos

### Fixed
- Corrige falha no cache de dados do `RaiderIo`
- Corrige falha na importação de personagens via `Blizzard API`
- Corrige falha na sincronização de membros da guilda

## [0.4.0] - 2026-04-05

### Added
- Adiciona integração com a `Blizzard`
- Adiciona integração com `RaiderIo`
- Adiciona o conceito de `Core`
- Adiciona página com detalhamento de score do personagem
- Adiciona a função Mantenha-me Conectado
- Adiciona visualização simplificada à página `PlayerScoringPage`
- Adiciona a página de `Perfil`

### Changed
- A página de `Dashboard` agora exibe os personagens do usuário atual caso a conta esteja vinculada com a blizzard
- Alteração de senha movida para a página de `Perfil`
- O menu `Configuração` passa a ser restrito para admins

### Fixed
- Corrigido problema de validação de usuário
- Corrigido problema de navegação entre o `Personagem` e a página de `Detalhes de Personagem`

## [0.3.6] - 2026-04-01

### Fixed
- Resolvida sincronização durante adição/remoção de penalidades em uma `RaidWeek`

## [0.3.5] - 2026-03-28

### Added
- Adiciona função de ressincronização/reimport logs

## [0.3.4] - 2026-03-27
### Added
- Adiciona detalhamento de log de auditoria ao click
- Adiciona badge de track de conexão ao servidor durante detalhamento de raid week

### Fixed
- Largura da coluna Ação na página de auditoria

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
