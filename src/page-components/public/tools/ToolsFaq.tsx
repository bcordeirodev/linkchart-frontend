"use client";

import { Box, Collapse, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getPublicElevatedSx,
  getPublicSectionHeadingSx,
} from "@/lib/theme/publicPageStyles";

import type { ToolsI18nKey } from "./types";

/** A single FAQ entry (i18n-driven). */
interface FaqItem {
  q: string;
  a: string;
}

/** Props for {@link ToolsFaq}. */
interface ToolsFaqProps {
  /** i18n prefix (under the `tools` namespace) holding `faq.{sectionTitle,items[]}`. */
  i18nKey: ToolsI18nKey;
}

/**
 * Shared FAQ accordion for the public `/ferramentas/*` tool pages.
 *
 * Reads `${i18nKey}.faq.{sectionTitle,items[]}` (items are `{q,a}`) from the
 * `tools` i18n namespace. Mirrors the `/guia/*` FAQ accordion so both public
 * families behave identically, while keeping the tool copy in its own
 * namespace.
 */
export function ToolsFaq({ i18nKey }: ToolsFaqProps) {
  const theme = useTheme();
  const { t } = useTranslation("tools");
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const baseId = useId();

  const faqItems = t(`${i18nKey}.faq.items`, {
    returnObjects: true,
  }) as FaqItem[];

  return (
    <Box component="section" aria-labelledby="tools-faq-heading">
      <Typography
        id="tools-faq-heading"
        component="h2"
        sx={getPublicSectionHeadingSx(theme)}
      >
        {t(`${i18nKey}.faq.sectionTitle`)}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {Array.isArray(faqItems) &&
          faqItems.map((item, i) => {
            const isOpen = openFaq === i;
            const triggerId = `${baseId}-tq-${i}`;
            const panelId = `${baseId}-ta-${i}`;
            return (
              <Box
                key={item.q}
                sx={{
                  ...getPublicElevatedSx(theme),
                  overflow: "hidden",
                  ...(isOpen && {
                    borderColor: alpha(primary, 0.32),
                    boxShadow: `inset 3px 0 0 ${alpha(primary, isDark ? 0.5 : 0.4)}`,
                  }),
                }}
              >
                <Box
                  component="button"
                  id={triggerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenFaq((prev) => (prev === i ? null : i))}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    px: { xs: 2, md: 2.5 },
                    py: { xs: 1.75, md: 2 },
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    gap: 2,
                    textAlign: "left",
                    color: "inherit",
                  }}
                >
                  <Typography
                    component="h3"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      lineHeight: 1.5,
                      color: theme.palette.text.primary,
                      flex: 1,
                      m: 0,
                    }}
                  >
                    {item.q}
                  </Typography>
                  <Box
                    sx={{
                      flexShrink: 0,
                      display: "flex",
                      color: theme.palette.text.secondary,
                      transition: "transform 220ms ease",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      "@media (prefers-reduced-motion: reduce)": {
                        transition: "none",
                      },
                    }}
                  >
                    <ChevronDown size={18} />
                  </Box>
                </Box>
                <Collapse in={isOpen} timeout={220}>
                  <Box
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    sx={{
                      px: { xs: 2, md: 2.5 },
                      pb: { xs: 2, md: 2.25 },
                      pt: 0,
                    }}
                  >
                    <Typography
                      component="p"
                      sx={{
                        fontSize: "0.8125rem",
                        lineHeight: 1.65,
                        color: alpha(
                          theme.palette.text.primary,
                          isDark ? 0.72 : 0.75,
                        ),
                        m: 0,
                      }}
                    >
                      {item.a}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
}
