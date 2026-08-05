"use client";

import { useCallback, useEffect, useRef } from "react";
import { driver, type Driver } from "driver.js";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/lib/auth/AuthContext";

import "driver.js/dist/driver.css";
import "./linksTour.css";

/** Backend onboarding key for this tour (see `User::ONBOARDING_KEYS`). */
const TOUR_FLAG = "links.tour" as const;

interface UseLinksTour {
  /** Starts the guided tour from the first step. */
  start: () => void;
}

/**
 * Sequential guided tour for the `/links` page, built on driver.js. Highlights
 * the key actions in order (encurtar → visão geral → lista → analytics → ações),
 * one floating tip at a time. Runs ONLY when the user asks for it via the
 * "Ajuda" button — it never auto-starts on login/first visit (removed
 * 2026-08-05 by request). Popover colors are driven from the live MUI theme
 * through CSS variables so it matches light and dark.
 *
 * Dismissal is still recorded on the user's account
 * (`onboarding["links.tour"]`) so the product keeps knowing who has seen it.
 *
 * @returns `{ start }` to trigger the tour on demand.
 */
export function useLinksTour(): UseLinksTour {
  const { t } = useTranslation("links");
  const theme = useTheme();
  const { markOnboardingSeen } = useAuth();
  const driverRef = useRef<Driver | null>(null);

  const applyThemeVars = useCallback(() => {
    const root = document.documentElement;
    root.style.setProperty("--lc-tour-bg", theme.palette.background.paper);
    root.style.setProperty("--lc-tour-fg", theme.palette.text.primary);
    root.style.setProperty("--lc-tour-muted", theme.palette.text.secondary);
    root.style.setProperty("--lc-tour-accent", theme.palette.primary.main);
    root.style.setProperty("--lc-tour-border", theme.palette.divider);
  }, [theme]);

  const start = useCallback(() => {
    applyThemeVars();
    driverRef.current?.destroy();

    // Not every anchor is always on screen: the Analytics CTA only renders for
    // links that already have clicks, and it never renders on mobile (the card
    // body is the tap target there). driver.js turns a missing element into a
    // floating, unanchored popover — a tip pointing at nothing. Dropping those
    // steps keeps the tour honest about what it can actually show.
    const steps = [
      {
        element: '[data-tour="quick-create"]',
        popover: {
          title: t("list.tour.create.title"),
          description: t("list.tour.create.desc"),
        },
      },
      {
        element: '[data-tour="overview"]',
        popover: {
          title: t("list.tour.overview.title"),
          description: t("list.tour.overview.desc"),
        },
      },
      {
        element: '[data-tour="links-list"]',
        popover: {
          title: t("list.tour.list.title"),
          description: t("list.tour.list.desc"),
        },
      },
      {
        element: '[data-tour="analytics"]',
        popover: {
          title: t("list.tour.analytics.title"),
          description: t("list.tour.analytics.desc"),
        },
      },
      {
        element: '[data-tour="link-actions"]',
        popover: {
          title: t("list.tour.actions.title"),
          description: t("list.tour.actions.desc"),
        },
      },
    ].filter((step) => document.querySelector(step.element) !== null);

    if (steps.length === 0) {
      return;
    }

    const instance = driver({
      showProgress: true,
      allowClose: true,
      popoverClass: "linkcharts-tour",
      overlayOpacity: 0.6,
      nextBtnText: t("list.tour.next"),
      prevBtnText: t("list.tour.prev"),
      doneBtnText: t("list.tour.done"),
      progressText: t("list.tour.progress"),
      onDestroyed: () => {
        void markOnboardingSeen(TOUR_FLAG);
      },
      steps,
    });

    driverRef.current = instance;
    instance.drive();
  }, [applyThemeVars, markOnboardingSeen, t]);

  // Tear down any live tour on unmount.
  useEffect(() => {
    return () => {
      driverRef.current?.destroy();
    };
  }, []);

  return { start };
}
