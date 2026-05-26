"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { SHORTER_CONTENT_MAX_WIDTH } from "@/features/shorter/constants";
import {
  getPublicInsetSx,
  getPublicSectionHeadingSx,
} from "@/lib/theme/publicPageStyles";

interface FaqItem {
  q: string;
  a: string;
}

/**
 * Expandable FAQ section for /shorter.
 *
 * Renders the 12 real-query questions as visible editorial content.
 * Complements the FAQPage JSON-LD schema so both crawlers and users
 * can read the same answers. Content is driven by i18n so it adapts
 * to pt-BR (default) and English automatically.
 */
export function ShorterFaq() {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = t("shorter.faq.items", { returnObjects: true }) as FaqItem[];

  if (!Array.isArray(items) || items.length === 0) return null;

  /** Toggle: clicking an open item closes it; clicking a different one opens it. */
  const handleToggle = (i: number) =>
    setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <Box
      component="section"
      aria-labelledby="shorter-faq-heading"
      sx={{
        mt: { xs: 6, md: 8 },
        mb: 2,
        maxWidth: SHORTER_CONTENT_MAX_WIDTH,
        mx: "auto",
      }}
    >
      <Typography
        id="shorter-faq-heading"
        component="h2"
        sx={getPublicSectionHeadingSx(theme)}
      >
        {t("shorter.faq.sectionTitle")}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <Box
              key={i}
              sx={{
                ...getPublicInsetSx(theme),
                overflow: "hidden",
                transition: "border-color 200ms ease, background 200ms ease",
                ...(isOpen && {
                  borderColor: alpha(theme.palette.primary.main, 0.32),
                  bgcolor: alpha(
                    theme.palette.primary.main,
                    theme.palette.mode === "dark" ? 0.04 : 0.02,
                  ),
                }),
              }}
            >
              {/* Question button */}
              <Box
                component="button"
                onClick={() => handleToggle(i)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
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
                    alignItems: "center",
                    color: theme.palette.text.secondary,
                    transition: "transform 220ms ease",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <ChevronDown size={18} />
                </Box>
              </Box>

              {/* Answer */}
              {isOpen && (
                <Box
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
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
                        theme.palette.mode === "dark" ? 0.72 : 0.75,
                      ),
                      m: 0,
                    }}
                  >
                    {item.a}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default ShorterFaq;

