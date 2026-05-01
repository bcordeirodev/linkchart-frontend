import { Box, Typography } from "@mui/material";

import useClipboard from "@/hooks/useClipboard";

import type { PublicLinkData, PublicAnalyticsActions } from "../../types";

interface LinkInfoCardProps {
  linkData: PublicLinkData;
  actions: PublicAnalyticsActions;
}

export function LinkInfoCard({ linkData, actions }: LinkInfoCardProps) {
  const { handleCreateLink, handleVisitLink } = actions;
  const { copy } = useClipboard({ timeout: 1500 });

  return (
    <Box
      sx={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "12px",
        p: { xs: "20px", md: "24px" },
      }}
    >
      <Box
        sx={{
          background: "rgba(99,102,241,0.07)",
          border: "1px solid rgba(99,102,241,0.22)",
          borderRadius: "8px",
          p: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2.5,
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: { xs: "1rem", md: "1.125rem" },
            fontWeight: 700,
            color: "#a5b4fc",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {linkData.short_url}
        </Typography>
        <Box
          component="button"
          onClick={() => copy(linkData.short_url)}
          sx={{
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.32)",
            borderRadius: "6px",
            px: 2,
            py: 0.875,
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "#a5b4fc",
            cursor: "pointer",
            flexShrink: 0,
            "&:hover": { background: "rgba(99,102,241,0.28)" },
          }}
        >
          Copiar
        </Box>
      </Box>

      <Typography
        title={linkData.original_url}
        sx={{
          fontFamily: "monospace",
          fontSize: "0.8125rem",
          color: "rgba(255,255,255,0.28)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          mb: 3,
        }}
      >
        {linkData.original_url}
      </Typography>

      <Box sx={{ display: "flex", gap: 1.5 }}>
        {[
          { label: "Encurtar outro link", onClick: handleCreateLink },
          { label: "Visitar destino", onClick: handleVisitLink },
        ].map(({ label, onClick }) => (
          <Box
            key={label}
            component="button"
            onClick={onClick}
            sx={{
              flex: 1,
              p: "10px 12px",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              fontWeight: 500,
              textAlign: "center",
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)",
              color: "rgba(255,255,255,0.45)",
              transition: "border-color 0.2s, color 0.2s",
              "&:hover": {
                borderColor: "rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.75)",
              },
            }}
          >
            {label}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
