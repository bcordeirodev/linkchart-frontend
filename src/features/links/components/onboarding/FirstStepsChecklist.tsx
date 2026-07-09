"use client";

import { CheckCircle2, Circle, Sparkles, X } from "lucide-react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

import type { OnboardingProgress } from "@/features/links/hooks/useOnboardingProgress";

export interface FirstStepsChecklistProps {
  /** Progresso derivado do onboarding. */
  progress: OnboardingProgress;
  /** Href do analytics de um link existente, ou `null` quando ainda não há links. */
  analyticsHref: string | null;
}

/**
 * Card "Primeiros passos" com as duas tarefas da jornada (criar link → conhecer
 * analytics). Cada item vira atalho para a ação; itens concluídos ficam marcados.
 * É dispensável e some sozinho quando o onboarding conclui.
 *
 * @param props Progresso e href de analytics.
 * @returns O card, ou `null` quando não deve ser exibido.
 */
export function FirstStepsChecklist({
  progress,
  analyticsHref,
}: FirstStepsChecklistProps) {
  const { t } = useTranslation("links");

  if (!progress.visible) {
    return null;
  }

  const items = [
    {
      key: "create",
      done: progress.hasCreatedLink,
      label: progress.hasCreatedLink
        ? t("list.onboarding.createLinkDone")
        : t("list.onboarding.createLink"),
      href: "/links/create",
      enabled: !progress.hasCreatedLink,
    },
    {
      key: "analytics",
      done: progress.hasSeenAnalytics,
      label: progress.hasCreatedLink
        ? t("list.onboarding.seeAnalytics")
        : t("list.onboarding.seeAnalyticsLocked"),
      href: analyticsHref,
      enabled: !progress.hasSeenAnalytics && analyticsHref != null,
    },
  ];

  return (
    <EnhancedPaper
      variant="outlined"
      animated={false}
      sx={{ p: { xs: 2, sm: 2.5 } }}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={1}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: { xs: "1.0625rem", sm: "1.125rem" },
              fontWeight: 600,
            }}
          >
            <Sparkles width={18} height={18} />
            {t("list.onboarding.title")}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.375 }}
          >
            {t("list.onboarding.subtitle")}
          </Typography>
        </Box>
        <IconButton
          aria-label={t("list.onboarding.dismiss")}
          size="small"
          onClick={progress.dismiss}
          sx={{ color: "text.disabled", flexShrink: 0 }}
        >
          <X width={16} height={16} />
        </IconButton>
      </Stack>

      <Stack spacing={0.5} sx={{ mt: 1.5 }}>
        {items.map((item) => {
          const content = (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.25}
              sx={{
                py: 1,
                px: 1,
                borderRadius: 1,
                color: item.done ? "text.disabled" : "text.primary",
                textDecoration: item.done ? "line-through" : "none",
                transition: "background-color 120ms",
                ...(item.enabled && {
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }),
                ...(!item.enabled && !item.done && { opacity: 0.55 }),
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  color: item.done ? "success.main" : "text.disabled",
                }}
              >
                {item.done ? (
                  <CheckCircle2 width={18} height={18} />
                ) : (
                  <Circle width={18} height={18} />
                )}
              </Box>
              <Typography variant="body2">{item.label}</Typography>
            </Stack>
          );

          if (item.enabled && item.href) {
            return (
              <Link
                key={item.key}
                href={item.href}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {content}
              </Link>
            );
          }

          return <Box key={item.key}>{content}</Box>;
        })}
      </Stack>
    </EnhancedPaper>
  );
}

export default FirstStepsChecklist;
