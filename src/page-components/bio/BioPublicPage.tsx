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
.bio-page ::selection { background: ${palette.selectionBg}; }
html:has(.bio-page) { scrollbar-width: thin; scrollbar-color: ${palette.scrollbarThumb} transparent; }
html:has(.bio-page)::-webkit-scrollbar { width: 8px; }
html:has(.bio-page)::-webkit-scrollbar-track { background: transparent; }
html:has(.bio-page)::-webkit-scrollbar-thumb { background-color: ${palette.scrollbarThumb}; border-radius: 999px; }
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
        <Box
          sx={{
            width: "100%",
            maxWidth: 480,
            flex: "1 1 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: { xs: 5.5, sm: 7 },
          }}
        >
          <BioAvatar
            initial={initial}
            palette={palette}
            avatarUrl={data.avatar_url}
            displayName={data.title.trim() || data.handle}
          />

          <Typography
            component="h1"
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

          {data.bio ? (
            <Typography
              sx={{
                mt: 1,
                maxWidth: "34ch",
                fontSize: "0.9375rem",
                lineHeight: 1.55,
                color: palette.textSecondary,
                textAlign: "center",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {data.bio}
            </Typography>
          ) : null}

          {data.items.length > 0 ? (
            <Stack spacing={1.5} sx={{ width: "100%", mt: 4.5 }}>
              {data.items.map((item) => (
                <BioLinkButton
                  key={item.id}
                  label={item.label}
                  url={item.url}
                  palette={palette}
                />
              ))}
            </Stack>
          ) : null}
        </Box>

        <Box sx={{ py: { xs: 5, sm: 6 } }}>
          <BioFooterBadge palette={palette} />
        </Box>
      </Box>
    </>
  );
}
