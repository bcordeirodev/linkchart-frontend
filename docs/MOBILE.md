# Mobile-First Conventions

The app is mobile-first. Follow these rules in every component and PR.

1. **Base = mobile.** In `sx`, the bare value targets the smallest screen; scale
   up with `sm`/`md`/`lg`. e.g. `gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }`.
2. **Theme breakpoints only.** Never `useMediaQuery("(max-width:720px)")`. Use
   `useThemeMediaQuery`/`useResponsive`. `isMobile` = `< md` (incl. tablet);
   `isPhone` = `< sm` (phone only).
3. **Dialogs** use `ResponsiveDialog` (fullScreen on phones), not raw `<Dialog>`.
4. **Charts** render through `ApexChartWrapper` with `size` (`compact`/`standard`/
   `large`), not a fixed `height`.
5. **No fixed px width > 360** on `sx` containers/cards/dialogs — use `%`,
   `maxWidth` tokens, or responsive objects.
6. **Full height** uses `dvh`/`svh`, not `vh`.
7. **Tables** on phones: hide non-essential columns or use a card fallback; never
   force `minWidth` that causes horizontal scroll.

CI runs `e2e/mobile-responsive.spec.ts` at 375px and fails on horizontal overflow.
