"use client";

import { Trans, useTranslation } from "react-i18next";
import { Box, Container, Divider, Link, Typography } from "@mui/material";

import { typographyScale } from "@/lib/theme/designSystem";
import { PublicLayout } from "@/shared/layout";

const sectionSx = { mb: 4 };
const headingSx = { fontWeight: 700, mb: 1.5 };
const bodySx = { color: "text.secondary", lineHeight: 1.8 };

const mailLink = <Link href="mailto:linkcharts@gmail.com" />;
const privacyLink = <Link href="/privacy" />;

/**
 * Terms of Service page — client component to support runtime language switching via react-i18next.
 *
 * @returns {JSX.Element} Rendered Terms of Service page with i18n support
 */
export default function TermsPage() {
  const { t } = useTranslation("legal");

  const s3Items = t("terms.s3.items", { returnObjects: true }) as string[];

  return (
    <PublicLayout chrome="minimal" variant="simple">
      <Container
        maxWidth="md"
        sx={{
          pt: { xs: 7, md: 8 },
          pb: { xs: 6, md: 8 },
          // Comfortable prose measure — `Container`'s own `maxWidth="md"`
          // (960px) is a page-gutter width, not a reading width; capping in
          // `ch` (not px) keeps the line length ~70 characters regardless of
          // the body font's actual size.
          maxWidth: "70ch",
        }}
      >
        {/*
          700, not 800: `app/layout.tsx` loads Space Grotesk at 400/500/700
          only, so 800 asks the browser to synthesise a faux-bold instead of
          rendering the real cut (same gotcha documented on
          `getPublicDisplaySx` in publicPageStyles.ts).
        */}
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {t("terms.title")}
        </Typography>
        <Typography
          variant="body2"
          color="text.disabled"
          sx={{ mb: 4, fontFamily: typographyScale.code.fontFamily }}
        >
          {t("terms.effectiveDate")}
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {/* 1 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            {t("terms.s1.heading")}
          </Typography>
          <Typography sx={bodySx}>
            <Trans
              i18nKey="terms.s1.body"
              ns="legal"
              components={{ privacyLink }}
            />
          </Typography>
        </Box>

        {/* 2 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            {t("terms.s2.heading")}
          </Typography>
          <Typography sx={bodySx}>{t("terms.s2.body")}</Typography>
        </Box>

        {/* 3 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            {t("terms.s3.heading")}
          </Typography>
          <Typography sx={bodySx}>{t("terms.s3.intro")}</Typography>
          <Box
            component="ul"
            sx={{ color: "text.secondary", pl: 3, mt: 1, lineHeight: 2 }}
          >
            {s3Items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </Box>
        </Box>

        {/* 4 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            {t("terms.s4.heading")}
          </Typography>
          <Typography sx={bodySx}>{t("terms.s4.body")}</Typography>
        </Box>

        {/* 5 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            {t("terms.s5.heading")}
          </Typography>
          <Typography sx={bodySx}>
            <Trans
              i18nKey="terms.s5.body"
              ns="legal"
              components={{ mailLink }}
            />
          </Typography>
        </Box>

        {/* 6 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            {t("terms.s6.heading")}
          </Typography>
          <Typography sx={bodySx}>{t("terms.s6.body")}</Typography>
        </Box>

        {/* 7 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            {t("terms.s7.heading")}
          </Typography>
          <Typography sx={bodySx}>{t("terms.s7.body")}</Typography>
        </Box>

        {/* 8 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            {t("terms.s8.heading")}
          </Typography>
          <Typography sx={bodySx}>{t("terms.s8.body")}</Typography>
        </Box>

        {/* 9 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            {t("terms.s9.heading")}
          </Typography>
          <Typography sx={bodySx}>{t("terms.s9.body")}</Typography>
        </Box>

        {/* 10 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            {t("terms.s10.heading")}
          </Typography>
          <Typography sx={bodySx}>
            <Trans
              i18nKey="terms.s10.body"
              ns="legal"
              components={{ mailLink }}
            />
          </Typography>
        </Box>
      </Container>
    </PublicLayout>
  );
}
