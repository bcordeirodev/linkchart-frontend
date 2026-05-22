"use client";
import { Box, Collapse, Typography } from "@mui/material";
import { useCallback, useId, useState } from "react";

import { AppIcon } from "@/shared/ui/icons";

interface FormSectionProps {
  /** Uppercase section label, e.g. "Básico". */
  label: string;
  /** One-line summary shown next to the label when the section is collapsed. */
  caption?: string;
  /** Renders a chevron and makes the header a click target. Default `false`. */
  collapsible?: boolean;
  /** Initial open state when `collapsible`. Default `false`. */
  defaultOpen?: boolean;
  /** Section content. */
  children: React.ReactNode;
  /** When `true`, drops the top divider (used for the first section). */
  isFirst?: boolean;
}

/**
 * Renders a quiet section header (uppercase label + optional caption) above a
 * group of form fields. When `collapsible`, a chevron toggle expands/collapses
 * the children. Replaces the previous `Chip("Mostrar"/"Ocultar")` pattern used
 * across `LinkFormFields`.
 */
export function FormSection({
  label,
  caption,
  collapsible = false,
  defaultOpen = false,
  children,
  isFirst = false,
}: FormSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  const handleToggle = useCallback(() => {
    if (collapsible) {
      setOpen((prev) => !prev);
    }
  }, [collapsible]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!collapsible) {
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    },
    [collapsible],
  );

  return (
    <Box
      sx={{
        pt: isFirst ? 0 : 2,
        mt: isFirst ? 0 : 1,
        borderTop: isFirst ? 0 : 1,
        borderColor: "divider",
      }}
    >
      <Box
        role={collapsible ? "button" : undefined}
        tabIndex={collapsible ? 0 : undefined}
        aria-expanded={collapsible ? open : undefined}
        aria-controls={collapsible ? contentId : undefined}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: collapsible ? "pointer" : "default",
          userSelect: "none",
          py: 0.5,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            fontSize: "0.6875rem",
            letterSpacing: "0.08em",
            lineHeight: 1.6,
          }}
        >
          {label}
        </Typography>
        {caption ? (
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", flex: 1 }}
          >
            — {caption}
          </Typography>
        ) : null}
        {collapsible ? (
          <Box
            sx={{
              ml: "auto",
              color: "text.secondary",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 150ms ease",
              display: "flex",
            }}
          >
            <AppIcon intent="expand" size={18} />
          </Box>
        ) : null}
      </Box>

      {collapsible ? (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box id={contentId} sx={{ pt: 1.5, pb: 0.5 }}>
            {children}
          </Box>
        </Collapse>
      ) : (
        <Box sx={{ pt: 1 }}>{children}</Box>
      )}
    </Box>
  );
}

export default FormSection;
