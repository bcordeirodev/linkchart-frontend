"use client";

import { Chip, Stack, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import type { Tag } from "@/types";

import { getTagChipSx } from "./linksPanelStyles";

/** Maximum number of tag chips rendered before collapsing into "+N". */
const MAX_VISIBLE_TAGS = 3;

export interface LinkTagChipsProps {
  /** Tags attached to the link (`LinkResponse.tags`). */
  tags: Tag[] | undefined;
  /** Additional `sx` forwarded to the outer `Stack`. */
  sx?: object;
}

/**
 * Renders up to {@link MAX_VISIBLE_TAGS} colored tag chips, collapsing any
 * remainder into a "+N" overflow chip (hover reveals the hidden names via
 * `Tooltip`). Returns `null` when the link has no tags, so callers can render
 * it unconditionally.
 *
 * Shared by `LinkCardRich` (desktop, inside the metrics footer) and
 * `LinksMobileCards` (mobile, under the destination line) — see
 * `linksPanelStyles.getTagChipSx` for the color recipe.
 */
export function LinkTagChips({ tags, sx }: LinkTagChipsProps) {
  const theme = useTheme();
  const { t } = useTranslation("links");

  if (!tags || tags.length === 0) {
    return null;
  }

  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const overflowTags = tags.slice(MAX_VISIBLE_TAGS);

  return (
    <Stack
      direction="row"
      spacing={0.5}
      useFlexGap
      flexWrap="wrap"
      sx={{ minWidth: 0, ...sx }}
    >
      {visibleTags.map((tag) => (
        <Chip
          key={tag.id}
          size="small"
          label={tag.name}
          sx={getTagChipSx(theme, tag.color)}
        />
      ))}
      {overflowTags.length > 0 ? (
        <Tooltip title={overflowTags.map((tag) => tag.name).join(", ")}>
          <Chip
            size="small"
            label={t("tags.overflow", { count: overflowTags.length })}
            sx={{
              height: 20,
              flexShrink: 0,
              fontSize: "0.6875rem",
              fontWeight: 500,
              color: "text.secondary",
              bgcolor: "action.hover",
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        </Tooltip>
      ) : null}
    </Stack>
  );
}

export default LinkTagChips;
