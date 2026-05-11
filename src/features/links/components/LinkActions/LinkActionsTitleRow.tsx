"use client";
import { Box, Typography } from "@mui/material";

interface LinkActionsTitleRowProps {
  /** Link title; falls back to `shortUrl` when undefined. */
  title?: string;
  /** Short URL shown as subtitle. */
  shortUrl?: string;
}

/**
 * Pure presentational title block of the LinkActions toolbar.
 *
 * Displays the link's title (falling back to the short URL when the
 * title is still loading) and the short URL as a subtitle. Truncates
 * both lines with ellipsis to avoid layout shift on long titles.
 *
 * Action buttons (Copy, overflow trigger) are positioned by the parent
 * orchestrator and are NOT rendered inside this component.
 */
export function LinkActionsTitleRow({
  title,
  shortUrl,
}: LinkActionsTitleRowProps) {
  return (
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography
        variant="h6"
        component="h1"
        sx={{
          fontSize: { xs: "1rem", sm: "1.125rem" },
          fontWeight: 700,
          lineHeight: 1.2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title || shortUrl || ""}
      </Typography>
      {shortUrl ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.8125rem" },
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {shortUrl}
        </Typography>
      ) : null}
    </Box>
  );
}

export default LinkActionsTitleRow;
