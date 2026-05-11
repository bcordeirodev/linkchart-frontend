# 0002 — MUI + Emotion sobre Tailwind

- Status: Accepted
- Data: 2026-05-10
- Autores: equipe Link Charts

## Contexto

A aplicação tem uma carga grande de componentes complexos prontos: `material-react-table` para a listagem, `@mui/x-date-pickers` para filtros temporais, snackbar via Notistack, modais e drawers. Ao decidir o sistema de estilos, queríamos alinhar tabelas, charts e formulários sob um mesmo idioma visual com modo dark/light coerente, sem precisar montar tudo do zero.

## Decisão

Usamos **Material-UI 6** com **Emotion** como engine de estilos, integrado ao App Router via `@mui/material-nextjs/v15-appRouter` (`AppRouterCacheProvider`). O design system é configurado em `src/lib/theme/` (tokens, paletas, breakpoints, `MainThemeProvider`). Sem Tailwind. Sem CSS Modules. Estilos pontuais usam o prop `sx` ou `styled` do Emotion.

## Alternativas consideradas

- **Tailwind CSS** — Utility-first, ótimo para layouts custom; mas perde a vantagem de componentes complexos prontos do MUI (tabela, datepicker, autocomplete). Implementar tudo isso "à mão" não compensa para o tamanho do time.
- **Chakra UI** — Componentes razoáveis, mas catálogo de tabela/data display é mais raso; integração com `material-react-table` ficaria forçada.
- **Sem framework (CSS custom)** — Escala mal para o número de componentes.

## Consequências

### Positivas

- Componentes complexos prontos: DataGrid, DatePicker, Snackbar, Drawer, Dialog.
- Theming via tokens centralizados; modo dark consistente sem CSS custom por componente.
- `material-react-table` integra-se diretamente.
- `sx` permite estilo inline com tokens do theme — muito mais legível que classes Tailwind para casos de domínio.

### Negativas

- Bundle maior que Tailwind (mitigado por `experimental.optimizePackageImports` no `next.config.ts`).
- Aprender API de `sx` + Emotion + theme tokens (3 conceitos para 1 cenário).
- Customizações profundas em componentes MUI requerem `styleOverrides` no theme — sintaxe mais hostil que utility classes.
- SSR com Emotion + RSC tem pegadinhas (necessário `AppRouterCacheProvider`).
