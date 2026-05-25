"use client";
import type { ReactNode } from "react";
import { Box, CircularProgress } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Check,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

import { radiusTokens } from "@/lib/theme/designSystem";

import type { SlugAvailabilityStatus } from "../../hooks/useSlugAvailability";
import type { UrlSafetyStatus } from "../../hooks/useUrlSafetyCheck";

const SUCCESS_ICON = { size: 14, strokeWidth: 2 } as const;

export type UrlSafetyLabels = {
  checking: string;
  safe: string;
  unsafe: (threats: string) => string;
  error: string;
};

export type SlugAvailabilityLabels = {
  checking: string;
  available: string;
  taken: string;
};

const feedbackWrapSx = {
  display: "block",
  mt: 0.75,
  pl: 0.25,
  minHeight: 22,
} as const;

/**
 * Subtle success chip aligned with app/public inset panels — icon in success
 * tone, label in neutral text (not full green body copy).
 */
export function SuccessStatusChip({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}): ReactNode {
  return (
    <Box
      component={motion.span}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      sx={(theme) => {
        const isDark = theme.palette.mode === "dark";
        const success = theme.palette.success.main;

        return {
          display: "inline-flex",
          alignItems: "flex-start",
          gap: 0.75,
          mt: 0.25,
          px: 1.25,
          py: 0.625,
          maxWidth: "100%",
          borderRadius: `${radiusTokens.sm}px`,
          border: `1px solid ${alpha(
            theme.palette.divider,
            isDark ? 0.35 : 0.55,
          )}`,
          bgcolor: alpha(theme.palette.text.primary, isDark ? 0.04 : 0.035),
          boxShadow: "none",
          verticalAlign: "middle",
          "& .success-chip-icon": {
            display: "inline-flex",
            flexShrink: 0,
            mt: "1px",
            color: success,
          },
          "& .success-chip-label": {
            fontSize: "0.6875rem",
            fontWeight: 500,
            lineHeight: 1.45,
            letterSpacing: "0.01em",
            color: isDark
              ? alpha(theme.palette.text.primary, 0.72)
              : theme.palette.text.secondary,
            whiteSpace: "normal",
          },
        };
      }}
    >
      <Box component="span" className="success-chip-icon">
        {icon}
      </Box>
      <Box component="span" className="success-chip-label">
        {label}
      </Box>
    </Box>
  );
}

export function InlineStatusRow({
  icon,
  label,
  bold = false,
  color = "text.secondary",
}: {
  icon: ReactNode;
  label: string;
  bold?: boolean;
  color?: string;
}): ReactNode {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        fontSize: "0.6875rem",
        color,
        fontWeight: bold ? 600 : 500,
        lineHeight: 1.45,
      }}
    >
      {icon}
      <span>{label}</span>
    </Box>
  );
}

/**
 * URL safety feedback for helper areas (create, quick create, /shorter).
 */
export function getUrlSafetyHelperNode(
  status: Exclude<UrlSafetyStatus, "idle">,
  threats: string[],
  labels: UrlSafetyLabels,
): ReactNode {
  if (status === "safe") {
    return (
      <SuccessStatusChip
        icon={<ShieldCheck {...SUCCESS_ICON} />}
        label={labels.safe}
      />
    );
  }

  if (status === "checking") {
    return (
      <InlineStatusRow
        icon={<CircularProgress size={11} color="inherit" />}
        label={labels.checking}
      />
    );
  }

  if (status === "unsafe") {
    return (
      <InlineStatusRow
        icon={<ShieldAlert {...SUCCESS_ICON} />}
        label={labels.unsafe(threats.join(", "))}
        bold
        color="error.main"
      />
    );
  }

  return (
    <InlineStatusRow
      icon={<ShieldOff {...SUCCESS_ICON} />}
      label={labels.error}
    />
  );
}

/**
 * Slug availability feedback when the user types a custom slug.
 */
export function getSlugAvailabilityHelperNode(
  status: Exclude<SlugAvailabilityStatus, "idle">,
  labels: SlugAvailabilityLabels,
): ReactNode {
  if (status === "available") {
    return (
      <SuccessStatusChip
        icon={<Check {...SUCCESS_ICON} />}
        label={labels.available}
      />
    );
  }

  if (status === "checking") {
    return (
      <InlineStatusRow
        icon={<CircularProgress size={11} color="inherit" />}
        label={labels.checking}
      />
    );
  }

  return (
    <InlineStatusRow
      icon={<XCircle {...SUCCESS_ICON} />}
      label={labels.taken}
      bold
      color="error.main"
    />
  );
}

/** Wrapper for field feedback below inputs (consistent spacing). */
export function FormFieldFeedback({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  if (!children) {
    return null;
  }
  return <Box sx={feedbackWrapSx}>{children}</Box>;
}

/** Builds URL safety labels from the `links` namespace. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildUrlSafetyLabels(t: any): UrlSafetyLabels {
  return {
    checking: t("form.safety.checking") as string,
    safe: t("form.safety.safe") as string,
    unsafe: (threats: string) => t("form.safety.unsafe", { threats }) as string,
    error: t("form.safety.error") as string,
  };
}

/** Builds slug availability labels from the `links` namespace. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildSlugAvailabilityLabels(t: any): SlugAvailabilityLabels {
  return {
    checking: t("form.slugAvailability.checking") as string,
    available: t("form.slugAvailability.available") as string,
    taken: t("form.slugAvailability.taken") as string,
  };
}

/** Builds URL safety labels from the `public` /shorter namespace. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildPublicUrlSafetyLabels(t: any): UrlSafetyLabels {
  return {
    checking: t("shorter.form.safety.checking") as string,
    safe: t("shorter.form.safety.safe") as string,
    unsafe: (threats: string) =>
      t("shorter.form.safety.unsafe", { threats }) as string,
    error: t("shorter.form.safety.error") as string,
  };
}

/** Builds slug availability labels from the `public` /shorter namespace. */

export function buildPublicSlugAvailabilityLabels(
  t: any,
): SlugAvailabilityLabels {
  return {
    checking: t("shorter.form.slugAvailability.checking") as string,
    available: t("shorter.form.slugAvailability.available") as string,
    taken: t("shorter.form.slugAvailability.taken") as string,
  };
}
