import { Box, Stack, Typography } from "@mui/material";

import BioAvatar from "./BioAvatar";
import BioFooterBadge from "./BioFooterBadge";
import BioLinkButton from "./BioLinkButton";
import { getBioPalette } from "./bioPalette";

import type { BioPageData } from "./types";

interface BioPublicPageProps {
  /** Bio payload resolved server-side from `GET /api/public/bio/{handle}`. */
  data: BioPageData;
}

/**
 * Derives the avatar's initial letter from the page title, falling back to
 * the handle (and finally a neutral placeholder) if the title is blank.
 *
 * @param title - the creator's display name.
 * @param handle - the creator's handle, used as a fallback source.
 * @returns a single uppercased character.
 */
function getAvatarInitial(title: string, handle: string): string {
  const source = title.trim() || handle.trim();
  return source ? source.charAt(0).toUpperCase() : "?";
}

/**
 * Public link-in-bio page — renders a creator's `title`, `bio` and stacked
 * link buttons. This is a Server Component: the payload is already resolved
 * by `app/(public)/b/[handle]/page.tsx`, so there's no loading state or
 * client-side data fetching here.
 *
 * Deliberately ignores the app's global MUI theme/dark-light toggle: colors
 * come entirely from {@link getBioPalette}, driven by `data.theme` (the page
 * owner's choice), not the visitor's app preference — most visitors arrive
 * from Instagram/WhatsApp and never see the app chrome at all.
 *
 * Two page-scoped visual details (selected-text color, scrollbar theming)
 * target pseudo-elements/at-rules `sx` can't express, so they ship as a
 * plain `<style>` tag scoped to `.bio-page` — a Server Component can render
 * one with zero client JS, and the `html:has(.bio-page)` scrollbar rule
 * keeps the theming off every other route without touching the app's global
 * stylesheet (which this page doesn't own).
 */
export default function BioPublicPage({ data }: BioPublicPageProps) {
  const palette = getBioPalette(data.theme);
  const initial = getAvatarInitial(data.title, data.handle);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
/* Reset autossuficiente: esta página é aberta fria (Instagram/WhatsApp) e
   NÃO pode depender do CssBaseline/hidratação dos providers do app — sem
   isto o body mantém margin 8px + content-box (padding estoura o viewport
   com scroll horizontal) e a fonte cai na serifa default do browser. */
html:has(.bio-page) { overflow-x: clip; }
html:has(.bio-page) body { margin: 0; }
.bio-page, .bio-page *, .bio-page *::before, .bio-page *::after { box-sizing: border-box; }
.bio-page { font-family: var(--font-inter, "Inter"), ui-sans-serif, system-ui, -apple-system, sans-serif; }
.bio-page ::selection { background: ${palette.selectionBg}; }
html:has(.bio-page) { scrollbar-width: thin; scrollbar-color: ${palette.scrollbarThumb} transparent; }
html:has(.bio-page)::-webkit-scrollbar { width: 8px; }
html:has(.bio-page)::-webkit-scrollbar-track { background: transparent; }
html:has(.bio-page)::-webkit-scrollbar-thumb { background-color: ${palette.scrollbarThumb}; border-radius: 999px; }
/* Entrada em cascata, CSS puro (Server Component, zero JS): avatar/título
   primeiro, cada botão 45ms depois do anterior via --i. Quem prefere menos
   movimento vê a página pronta, sem animação. */
@keyframes bio-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.bio-page [data-bio-rise] { animation: bio-rise 420ms cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: calc(var(--i, 0) * 45ms); }
@media (prefers-reduced-motion: reduce) { .bio-page [data-bio-rise] { animation: none; } }
`,
        }}
      />
      <Box
        className="bio-page"
        sx={{
          minHeight: "100dvh",
          width: "100%",
          bgcolor: palette.background,
          backgroundImage: palette.backgroundImage,
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 3,
        }}
      >
        {/* `my: "auto"` (e não flex-grow): página curta fica opticamente
            centrada entre o topo e o badge — sem o vazio gigante embaixo dos
            itens — e página longa flui normalmente, sem risco de clipe que o
            justify-content: center teria com overflow. */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 480,
            my: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: { xs: 4, sm: 5 },
          }}
        >
          <Box data-bio-rise style={{ "--i": 0 } as React.CSSProperties}>
            <BioAvatar
              initial={initial}
              palette={palette}
              // Thumb quando existe (nítida no círculo de ~116px, mais leve);
              // original como fallback p/ avatares anteriores à miniatura. O
              // og:image (bioMetadata) segue usando o ORIGINAL de propósito.
              avatarUrl={data.avatar_thumb_url ?? data.avatar_url}
              displayName={data.title.trim() || data.handle}
            />
          </Box>

          <Typography
            component="h1"
            data-bio-rise
            style={{ "--i": 1 } as React.CSSProperties}
            sx={{
              mt: 2.5,
              fontSize: "clamp(1.5rem, 1.2rem + 1.4vw, 1.875rem)",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: palette.textPrimary,
              textAlign: "center",
              wordBreak: "break-word",
            }}
          >
            {data.title}
          </Typography>

          {/* Sem line-clamp: o campo já é limitado a 280 caracteres na origem,
              e cortar a bio no meio (feedback 2026-08-02) mutila a apresentação
              da pessoa. 46ch mantém linhas confortáveis de ler. */}
          {data.bio ? (
            <Typography
              sx={{
                mt: 1.25,
                maxWidth: "46ch",
                fontSize: "0.875rem",
                lineHeight: 1.65,
                color: palette.textSecondary,
                textAlign: "center",
                overflowWrap: "break-word",
                // Quebras balanceadas: sem linhas órfãs curtas no fim do
                // parágrafo (progressive enhancement; ignorado onde não há
                // suporte).
                textWrap: "pretty",
              }}
            >
              {data.bio}
            </Typography>
          ) : null}

          {data.items.length > 0 ? (
            <Stack spacing={1.5} sx={{ width: "100%", mt: 4 }}>
              {data.items.map((item, index) => (
                <Box
                  key={item.id}
                  data-bio-rise
                  style={{ "--i": index + 2 } as React.CSSProperties}
                >
                  <BioLinkButton
                    label={item.label}
                    url={item.url}
                    faviconUrl={item.favicon_url ?? null}
                    destinationHost={item.destination_host ?? null}
                    palette={palette}
                  />
                </Box>
              ))}
            </Stack>
          ) : null}
        </Box>

        <Box sx={{ flexShrink: 0, pb: { xs: 3.5, sm: 4 } }}>
          <BioFooterBadge palette={palette} />
        </Box>
      </Box>
    </>
  );
}
