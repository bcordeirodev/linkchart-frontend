# CLAUDE.md (frontend-next)

Diretrizes de estética e motion específicas do frontend, complementares ao `CLAUDE.md` da raiz do repositório.

<frontend_aesthetics>
Identidade visual "instrumento técnico" (spec 2026-08-03). Toda UI nova DEVE:

- Tipografia: headings/números grandes em Space Grotesk (var --font-space-grotesk);
  corpo em Inter; URLs, slugs, eixos de gráfico e micro-labels em JetBrains Mono
  (var --font-jetbrains-mono). Números de métrica com tabular-nums e salto de
  escala 3x+ sobre a caption. Nunca introduzir outra fonte.
- Nada de stat card com ícone-chip no canto, nem ícone decorativo ao lado de
  título — métricas de overview usam OverviewMetricRow (números soltos +
  hairlines); seções usam SectionLabel (caps mono com prefixo /).
- Superfícies: 3 níveis (solto no fundo / card hairline 1px / painel sutil).
  Sem card dentro de card, sem elevação por cinza. Raio via radiusTokens.
- Gráficos: sempre via ApexChartWrapper (herda apexBaseTheme). Donut é proibido —
  usar barra empilhada horizontal. Cores só de dataVizPalette (azul dominante).
  Toda explicação visível sob o gráfico permanece obrigatória.
- Cor: dark + azul primário intocados; laranja = só aviso; verde = só sucesso;
  chips coloridos com fonte branca no dark.
- Motion: um page-load orquestrado por tela (classes reveal/reveal-N, CSS-only,
  respeita prefers-reduced-motion). Sem micro-interações espalhadas.

</frontend_aesthetics>
