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
  const heading = title || shortUrl || "";
  const showUrlLine = Boolean(shortUrl && shortUrl !== heading);

  return (
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography
        variant="h6"
        component="h1"
        sx={{
          fontSize: { xs: "1.375rem", sm: "1.5rem" },
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: 1.3,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {heading}
      </Typography>
      {showUrlLine ? (
        <Box sx={{ mt: 0.375 }}>
          <LinkActionsShortUrl url={shortUrl!} />
        </Box>
      ) : null}
    </Box>
  );
}

export default LinkActionsTitleRow;
