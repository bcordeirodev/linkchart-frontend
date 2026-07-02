"use client";
import { Box, Typography } from "@mui/material";

import { LinkActionsShortUrl } from "./LinkActionsShortUrl";

interface LinkActionsTitleRowProps {
  title?: string;
  shortUrl?: string;
}

export function LinkActionsTitleRow({
  title,
  shortUrl,
}: LinkActionsTitleRowProps) {
  // Untitled links fall back to the short URL — without the protocol, which
  // is noise at heading size.
  const heading = title || shortUrl?.replace(/^https?:\/\//, "") || "";
  const showUrlLine = Boolean(shortUrl && title);

  return (
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography
        variant="h6"
        component="h1"
        sx={{
          fontSize: { xs: "1.375rem", sm: "1.5rem" },
          fontWeight: 700,
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {heading}
      </Typography>
      {/* Desktop already shows the short URL inside the copy strip (top
          right); repeating it under the title said the same thing twice.
          On mobile the strip collapses to a plain button, so the URL line
          is the only visible address and stays. */}
      {showUrlLine ? (
        <Box sx={{ mt: 0.375, display: { xs: "block", sm: "none" } }}>
          <LinkActionsShortUrl url={shortUrl!} />
        </Box>
      ) : null}
    </Box>
  );
}

export default LinkActionsTitleRow;
