"use client";

import { Trans, useTranslation } from "react-i18next";
import { Box, Container, Divider, Link, Typography } from "@mui/material";

import PublicLayout from "@/shared/layout/PublicLayout";

const sectionSx = { mb: 4 };
const headingSx = { fontWeight: 700, mb: 1.5 };
const bodySx = { color: "text.secondary", lineHeight: 1.8 };
const listSx = { color: "text.secondary", pl: 3, mt: 1, lineHeight: 2 };

interface LabelTextItem {
  label: string;
  text: string;
}

interface CookieRow {
  name: string;
  purpose: string;
  duration: string;
  category: string;
}

interface CookieHeaders {
  cookie: string;
  purpose: string;
  duration: string;
  category: string;
}

const mailLink = <Link href="mailto:linkcharts@gmail.com" />;

/** Privacy Policy page — client component to support runtime language switching via react-i18next. */
export default function PrivacyPage() {
  const { t } = useTranslation("legal");

  const s2Items = t("privacy.s2.items", { returnObjects: true }) as Record<string, LabelTextItem>;
  const s3Items = t("privacy.s3.items", { returnObjects: true }) as Record<string, LabelTextItem>;
  const s4Items = t("privacy.s4.items", { returnObjects: true }) as Record<string, LabelTextItem>;
  const s5Rights = t("privacy.s5.rights", { returnObjects: true }) as string[];
  const s7Items = t("privacy.s7.items", { returnObjects: true }) as Record<string, LabelTextItem>;
  const s9Rights = t("privacy.s9.rights", { returnObjects: true }) as Record<string, LabelTextItem>;
  const cookieHeaders = t("privacy.s10.headers", { returnObjects: true }) as CookieHeaders;
  const cookieRows = t("privacy.s10.rows", { returnObjects: true }) as CookieRow[];

  return (
    <PublicLayout chrome="minimal" variant="simple">
      <Container maxWidth="md" sx={{ pt: { xs: 7, md: 8 }, pb: { xs: 6, md: 8 } }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          {t("privacy.title")}
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ mb: 4 }}>
          {t("privacy.effectiveDate")}
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {/* 1 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>{t("privacy.s1.heading")}</Typography>
          <Typography sx={bodySx}>
            <Trans i18nKey="privacy.s1.body" ns="legal" components={{ mailLink }} />
          </Typography>
        </Box>

        {/* 2 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>{t("privacy.s2.heading")}</Typography>
          <Typography sx={bodySx}>{t("privacy.s2.intro")}</Typography>
          <Box component="ul" sx={listSx}>
            {Object.values(s2Items).map(({ label, text }) => (
              <li key={label}>
                <strong>{label}:</strong> {text}
              </li>
            ))}
          </Box>
        </Box>

        {/* 3 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>{t("privacy.s3.heading")}</Typography>
          <Box component="ul" sx={listSx}>
            {Object.values(s3Items).map(({ label, text }) => (
              <li key={label}>
                <strong>{label}</strong> {text}
              </li>
            ))}
          </Box>
        </Box>

        {/* 4 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>{t("privacy.s4.heading")}</Typography>
          <Typography sx={bodySx}>{t("privacy.s4.intro")}</Typography>
          <Box component="ul" sx={listSx}>
            {Object.values(s4Items).map(({ label, text }) => (
              <li key={label}>
                <strong>{label}:</strong> {text}
              </li>
            ))}
          </Box>
        </Box>

        {/* 5 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>{t("privacy.s5.heading")}</Typography>
          <Typography sx={bodySx}>{t("privacy.s5.intro")}</Typography>
          <Box component="ul" sx={listSx}>
            {s5Rights.map((right) => (
              <li key={right}>{right}</li>
            ))}
          </Box>
          <Typography sx={{ ...bodySx, mt: 1 }}>
            <Trans i18nKey="privacy.s5.contact" ns="legal" components={{ mailLink }} />
          </Typography>
        </Box>

        {/* 6 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>{t("privacy.s6.heading")}</Typography>
          <Typography sx={bodySx}>{t("privacy.s6.body")}</Typography>
        </Box>

        {/* 7 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>{t("privacy.s7.heading")}</Typography>
          <Box component="ul" sx={listSx}>
            {Object.values(s7Items).map(({ label, text }) => (
              <li key={label}>
                <strong>{label}:</strong> {text}
              </li>
            ))}
          </Box>
        </Box>

        {/* 8 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>{t("privacy.s8.heading")}</Typography>
          <Typography sx={bodySx}>{t("privacy.s8.body")}</Typography>
        </Box>

        {/* 9 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>{t("privacy.s9.heading")}</Typography>
          <Typography sx={bodySx}>{t("privacy.s9.intro")}</Typography>
          <Box component="ul" sx={listSx}>
            {Object.values(s9Rights).map(({ label, text }) => (
              <li key={label}>
                <strong>{label}:</strong> {text}
              </li>
            ))}
          </Box>
          <Typography sx={{ ...bodySx, mt: 1 }}>
            <Trans i18nKey="privacy.s9.contact" ns="legal" components={{ mailLink }} />
          </Typography>
        </Box>

        {/* 10 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>{t("privacy.s10.heading")}</Typography>
          <Box sx={{ overflowX: "auto" }}>
            <Box
              component="table"
              sx={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", color: "text.secondary" }}
            >
              <Box component="thead">
                <Box component="tr" sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                  {[cookieHeaders.cookie, cookieHeaders.purpose, cookieHeaders.duration, cookieHeaders.category].map((h) => (
                    <Box key={h} component="th" sx={{ textAlign: "left", py: 1, pr: 2, fontWeight: 600, color: "text.primary" }}>
                      {h}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {cookieRows.map(({ name, purpose, duration, category }) => (
                  <Box component="tr" key={name} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                    <Box component="td" sx={{ py: 1, pr: 2, fontFamily: "monospace", fontSize: "0.8rem" }}>{name}</Box>
                    <Box component="td" sx={{ py: 1, pr: 2 }}>{purpose}</Box>
                    <Box component="td" sx={{ py: 1, pr: 2 }}>{duration}</Box>
                    <Box component="td" sx={{ py: 1 }}>{category}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* 11 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>{t("privacy.s11.heading")}</Typography>
          <Typography sx={bodySx}>{t("privacy.s11.body")}</Typography>
        </Box>

        {/* 12 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>{t("privacy.s12.heading")}</Typography>
          <Typography sx={bodySx}>
            {t("privacy.s12.line1")}<br />
            {t("privacy.s12.emailLabel")}{" "}
            <Link href="mailto:linkcharts@gmail.com">linkcharts@gmail.com</Link><br />
            {t("privacy.s12.githubLabel")}{" "}
            <Link href="https://github.com/bcordeirodev" target="_blank" rel="noopener noreferrer">
              github.com/bcordeirodev
            </Link>
          </Typography>
        </Box>
      </Container>
    </PublicLayout>
  );
}
