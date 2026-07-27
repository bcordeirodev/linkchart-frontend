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
 */
export default function BioPublicPage({ data }: BioPublicPageProps) {
  const palette = getBioPalette(data.theme);
  const initial = getAvatarInitial(data.title, data.handle);

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100%",
        bgcolor: palette.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 2.5,
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
          pt: { xs: 6, sm: 8 },
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
            fontSize: "clamp(1.375rem, 1.1rem + 1vw, 1.625rem)",
            fontWeight: 800,
            lineHeight: 1.25,
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
              fontSize: "0.9375rem",
              lineHeight: 1.5,
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
          <Stack spacing={1.5} sx={{ width: "100%", mt: 4 }}>
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

      <Box sx={{ py: { xs: 4, sm: 5 } }}>
        <BioFooterBadge palette={palette} />
      </Box>
    </Box>
  );
}
