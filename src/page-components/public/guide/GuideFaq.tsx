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

import type { GuideI18nKey } from "./types";

/** A single FAQ entry (i18n-driven). */
interface FaqItem {
  q: string;
  a: string;
}

/** Props for {@link GuideFaq}. */
interface GuideFaqProps {
  /** i18n namespace prefix (under `public`) holding `faq.{sectionTitle,items[]}`. */
  i18nKey: GuideI18nKey;
}

/**
 * Shared FAQ accordion for the public `/guia/*` pages.
 *
 * Reads `${i18nKey}.faq.{sectionTitle,items[]}` (items are `{q,a}`) from the
 * `public` i18n namespace. Behavior and markup are identical across every
 * guide page — only the i18n namespace differs — so this is extracted once
 * instead of duplicated per page.
 */
export function GuideFaq({ i18nKey }: GuideFaqProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const baseId = useId();

  const faqItems = t(`${i18nKey}.faq.items`, {
    returnObjects: true,
  }) as FaqItem[];

  return (
    <Box component="section" aria-labelledby="guia-faq-heading">
      <Typography
        id="guia-faq-heading"
        component="h2"
        sx={getPublicSectionHeadingSx(theme)}
      >
        {t(`${i18nKey}.faq.sectionTitle`)}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {Array.isArray(faqItems) &&
          faqItems.map((item, i) => {
            const isOpen = openFaq === i;
            const triggerId = `${baseId}-gq-${i}`;
            const panelId = `${baseId}-ga-${i}`;
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
