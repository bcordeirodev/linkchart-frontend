"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ChevronDown } from "lucide-react";
import { m } from "framer-motion";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { SHORTER_CONTENT_MAX_WIDTH } from "@/features/shorter/constants";
import {
  getPublicElevatedSx,
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
 *
 * Accessibility notes:
 * - Each trigger is a `<button>` with `aria-expanded` and `aria-controls`.
 * - Each answer panel is always present in the DOM (never conditionally
 *   rendered) so `aria-controls` references a valid id at all times.
 *   Framer-motion animates `height` between 0 and "auto" for the
 *   show/hide effect without removing the element.
 * - Panel ids are derived from a `useId()` base so they are stable across
 *   SSR and client renders.
 */
export function ShorterFaq() {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  /** Stable base id shared across all FAQ items in this instance. */
  const baseId = useId();

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
          /** Stable trigger id: `{baseId}-q-{i}` */
          const triggerId = `${baseId}-q-${i}`;
          /** Stable panel id: `{baseId}-a-{i}` */
          const panelId = `${baseId}-a-${i}`;
          return (
            <Box
              key={i}
              sx={{
                ...getPublicElevatedSx(theme),
                overflow: "hidden",
                transition: "border-color 200ms ease, background 200ms ease",
                ...(isOpen && {
                  borderColor: alpha(theme.palette.primary.main, 0.32),
                  bgcolor: alpha(
                    theme.palette.primary.main,
                    isDark ? 0.04 : 0.02,
                  ),
                  boxShadow: `inset 3px 0 0 ${alpha(theme.palette.primary.main, isDark ? 0.5 : 0.4)}`,
                }),
              }}
            >
              {/* Question trigger — real <button> for keyboard/AT support */}
              <Box
                component="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => handleToggle(i)}
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

              {/*
               * Answer panel — always in the DOM so aria-controls is always
               * valid.  Framer-motion drives height 0 ↔ "auto"; `overflow:
               * hidden` clips the content during animation.
               */}
              <m.div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                aria-hidden={!isOpen}
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden" }}
              >
                <Box
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
              </m.div>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default ShorterFaq;
