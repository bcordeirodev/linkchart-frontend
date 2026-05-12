"use client";

import { Trans, useTranslation } from "react-i18next";
import {
  Box,
  Container,
  Divider,
  Link,
  Paper,
  Typography,
} from "@mui/material";

import { PublicLayout } from "@/shared/layout";

interface FaqItem {
  q: string;
  a: string;
}

const mailLink = <Link href="mailto:linkcharts@gmail.com" />;
const githubLink = (
  <Link
    href="https://github.com/bcordeirodev"
    target="_blank"
    rel="noopener noreferrer"
  />
);

/** Support page — client component to support runtime language switching via react-i18next. */
export default function SupportPage() {
  const { t } = useTranslation("legal");

  const faqItems = t("support.faq.items", { returnObjects: true }) as FaqItem[];

  return (
    <PublicLayout chrome="minimal" variant="simple">
      <Container
        maxWidth="md"
        sx={{ pt: { xs: 7, md: 8 }, pb: { xs: 6, md: 8 } }}
      >
        <Typography variant="h4" fontWeight={800} gutterBottom>
          {t("support.title")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {t("support.subtitle")}
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {/* Contact */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {t("support.contact.heading")}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography color="text.secondary">
              <Trans
                i18nKey="support.contact.emailText"
                ns="legal"
                components={{ mailLink }}
              />
            </Typography>
            <Typography color="text.secondary">
              <Trans
                i18nKey="support.contact.bugsText"
                ns="legal"
                components={{ githubLink }}
              />
            </Typography>
          </Box>
        </Box>

        {/* FAQ */}
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          {t("support.faq.heading")}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {faqItems.map(({ q, a }) => (
            <Paper key={q} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography fontWeight={600} gutterBottom>
                {q}
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {a}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </PublicLayout>
  );
}
