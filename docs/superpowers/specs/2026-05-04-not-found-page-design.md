# Design Spec — Página 404 (Not Found)

**Data:** 2026-05-04  
**Arquivos afetados:**
- `src/page-components/system/NotFoundPage.tsx`
- `src/shared/layout/ErrorLayout.tsx`

---

## Objetivo

Redesenhar a página 404 para ter personalidade visual alinhada ao produto Link Charts, corrigir um bug de ícone, e eliminar ruído desnecessário (footer, cores hardcoded fora do tema).

---

## Problemas no estado atual

1. **Bug de ícone:** `ErrorLayout` mapeia `icon: "search"` para 404 em `errorConfig`, mas renderiza `<AppIcon intent="error" />` ignorando esse mapeamento.
2. **Cores hardcoded:** `NotFoundPage` usa `#FF6B6B` e `#4ECDC4` — fora do design system e do tema MUI.
3. **Footer desnecessário:** Página de erro não precisa de rodapé com copyright.
4. **Bounce animation genérica:** Sem identidade com o produto.
5. **Ícone errado no círculo:** O círculo mostra erro genérico em vez de ícone contextual (lupa para 404).

---

## Design — Abordagem B (Tipográfica com identidade)

### Layout geral

`ErrorLayout`:
- Mantém header com logo (link para `/`).
- Remove o `<footer>` completamente.
- Background: gradiente `background.default → background.paper`, 135°.
- Overlay decorativo: `radial-gradient` com `primary.main` a 4% opacidade, repetido em padrão de pontos (`background-size: 24px 24px`) — referência sutil a charts/data.

### Elemento "404" de fundo

Em `NotFoundPage`, todo o conteúdo fica dentro de um `Box` wrapper com `position: relative, overflow: hidden`. O "404" é posicionado `absolute` dentro desse wrapper:
- Font-size: `{ xs: "8rem", sm: "12rem", md: "18rem" }`
- Font-weight: `900`
- Color: `primary.main` a 6% opacidade
- `position: absolute, top: "50%", left: "50%", transform: "translate(-50%, -50%)"`
- `user-select: none, pointer-events: none, zIndex: 0`

O conteúdo textual e botões ficam em um Box com `position: relative, zIndex: 1`.

### Ícone central

Círculo `100×100px` (mobile: `80×80px`):
- Gradiente: `primary.light → primary.main`, 135°
- Sombra: `theme.shadows[8]`
- Ícone: `LinkOff` (Lucide, tamanho 48px / mobile 36px), cor `primary.contrastText`
- **Float animation:** `translateY(0) → translateY(-12px) → translateY(0)`, duração 3s, `ease-in-out`, `infinite`

### Correção do bug de ícone

`ErrorLayout` ganha uma prop opcional `iconNode?: ReactNode`. Quando fornecida, substitui o `<AppIcon intent="error" />` hardcoded no círculo. Quando ausente, usa `<AppIcon intent={errorConfig.icon} />` (fix do bug — aproveita o mapeamento já existente).

`NotFoundPage` passa `iconNode={<LinkOff size={isMobile ? 36 : 48} />}` para `ErrorLayout`.

### Texto

```
[h4, fontWeight 700] "Página não encontrada"
[body1, color text.secondary, maxWidth 480] t("notFound.description")
```

Espaçamento entre eles: `mb: 2` no h4, `mb: 4` no body1.

### Botões de ação

`Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center"`:
- `Button variant="contained" size="large"` com `ArrowLeft` (Lucide) — "Voltar"
- `Button variant="outlined" size="large"` com `Home` (Lucide) — "Início"

Largura mínima: `{ xs: "100%", sm: 160 }`.

### Sugestões de navegação

Se `suggestions.length > 0`:
```
[body2, color text.secondary, mb 1] "Talvez você esteja procurando:"
[Stack direction row flexWrap wrap gap 1 justifyContent center]
  → Chip variant="outlined" size="small" clickable component={Link} href={...}
     para cada sugestão
```

Chips usam apenas `component={Link} href={suggestion.href}` — sem `onClick` redundante.

---

## Animações

| Elemento | Animação | Duração | Easing |
|---|---|---|---|
| Ícone circular | float (`translateY 0 → -12px → 0`) | 3s | ease-in-out, infinite |
| Conteúdo principal | fadeInUp (opacity 0→1, translateY 20px→0) | 0.5s | ease-out, once |
| Sugestões | fadeInUp com delay 0.3s | 0.5s | ease-out, once |

---

## Responsividade

| Elemento | xs | sm+ |
|---|---|---|
| "404" de fundo | `8rem` | `12rem` / `18rem` |
| Ícone círculo | 80×80px, ícone 36px | 100×100px, ícone 48px |
| Botões | `width: 100%` stacked | `160px min` lado a lado |

---

## Escopo

**Incluído:**
- `NotFoundPage.tsx` — redesign completo
- `ErrorLayout.tsx` — remover footer, corrigir bug de ícone, adicionar padrão de pontos no background

**Excluído:**
- Outras páginas de erro (`error.tsx`, `(app)/error.tsx`, `(auth)/error.tsx`) — fora de escopo
- i18n strings — usar as existentes sem alteração
- Testes automatizados — não há suite de testes frontend

---

## Checklist de verificação

- [ ] `npm run quality` passa (tsc + lint + format)
- [ ] Visual testado em browser: mobile (375px) e desktop (1280px)
- [ ] Dark mode funcional (cores via tema, não hardcoded)
- [ ] Float animation não causa CLS (usar `will-change: transform`)
- [ ] Sugestões renderizam corretamente para usuário autenticado e anônimo
