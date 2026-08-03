"use client";
import { Box, Collapse, Typography } from "@mui/material";
import { useCallback, useId, useState } from "react";

import { AppIcon } from "@/shared/ui/icons";
import { SectionLabel } from "@/shared/ui/base";

interface FormSectionProps {
  /** Uppercase section label, e.g. "Básico". */
  label: string;
  /** One-line summary shown below the label (e.g. "Opcional — senha, ..."). */
  caption?: string;
  /** Renders a chevron and makes the header a click target. Default `false`. */
  collapsible?: boolean;
  /** Initial open state when `collapsible`. Default `false`. */
  defaultOpen?: boolean;
  /** Section content. */
  children: React.ReactNode;
  /** When `true`, drops the top spacing (used for the first section). */
  isFirst?: boolean;
}

/**
 * Renders a `SectionLabel` header (`/ LABEL` caps mono + hairline, "instrumento
 * técnico" grammar) above a group of form fields, with an optional hint line
 * and a chevron toggle when `collapsible`. Replaces the earlier ad hoc
 * `Typography variant="overline"` + top-divider treatment — same field-group
 * anchor role `SectionLabel` already plays on `/links`, `/bio` and the
 * analytics/reports pages post-redesign, just reused here for in-form
 * sections instead of page/panel sections.
 *
 * When `collapsible`, the entire label row (including the trailing hairline)
 * is the click/tap target — same full-row toggle affordance the previous
 * implementation had — with the chevron rendered in `SectionLabel`'s `action`
 * slot instead of a separate trailing icon.
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

  const chevron = collapsible ? (
    <Box
      aria-hidden
      sx={{
        color: "text.secondary",
        display: "flex",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 150ms ease",
      }}
    >
      <AppIcon intent="expand" size={18} />
    </Box>
  ) : null;

  return (
    <Box sx={{ pt: isFirst ? 0 : 2.5 }}>
      <Box
        role={collapsible ? "button" : undefined}
        tabIndex={collapsible ? 0 : undefined}
        aria-expanded={collapsible ? open : undefined}
        aria-controls={collapsible ? contentId : undefined}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        sx={{
          cursor: collapsible ? "pointer" : "default",
          userSelect: "none",
        }}
      >
        <SectionLabel headingLevel={2} action={chevron}>
          {label}
        </SectionLabel>
      </Box>
      {caption ? (
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.75 }}>
          {caption}
        </Typography>
      ) : null}

      {collapsible ? (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box id={contentId} sx={{ pt: 1.5, pb: 0.5 }}>
            {children}
          </Box>
        </Collapse>
      ) : (
        <Box sx={{ pt: 1.5 }}>{children}</Box>
      )}
    </Box>
  );
}

export default FormSection;
