"use client";

import { useCallback, useEffect, useRef } from "react";
import { driver, type Driver } from "driver.js";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import "driver.js/dist/driver.css";
import "./linksTour.css";

const TOUR_DONE_KEY = "onboarding.links.tourDone";

/**
 * Reads the "tour already seen" flag in an SSR-safe way.
 *
 * @returns `true` when the tour was completed/dismissed before.
 */
function readTourDone(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return window.localStorage.getItem(TOUR_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Persists that the tour was seen, ignoring quota/private-mode errors.
 */
function markTourDone(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(TOUR_DONE_KEY, "1");
  } catch {
    /* ignore */
  }
}

interface UseLinksTourArgs {
  /** True once the page content (and the tour anchors) are mounted. */
  ready: boolean;
}

interface UseLinksTour {
  /** Starts the guided tour from the first step. */
  start: () => void;
}

/**
 * Sequential guided tour for the `/links` page, built on driver.js. Highlights
 * the key actions in order (encurtar → visão geral → lista → analytics → ações),
 * one floating tip at a time. Runs automatically on the first visit and can be
 * relaunched via the "Ajuda" button. Popover colors are driven from the live MUI
 * theme through CSS variables so it matches light and dark.
 *
 * @param args.ready Gate that defers the auto-run until anchors exist in the DOM.
 * @returns `{ start }` to trigger the tour on demand.
 */
export function useLinksTour({ ready }: UseLinksTourArgs): UseLinksTour {
  const { t } = useTranslation("links");
  const theme = useTheme();
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
        markTourDone();
      },
      steps: [
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
      ],
    });

    driverRef.current = instance;
    instance.drive();
  }, [applyThemeVars, t]);

  // Auto-run once on the first ready render.
  useEffect(() => {
    if (!ready || readTourDone()) {
      return;
    }
    const id = window.setTimeout(() => start(), 500);
    return () => window.clearTimeout(id);
  }, [ready, start]);

  // Tear down any live tour on unmount.
  useEffect(() => {
    return () => {
      driverRef.current?.destroy();
    };
  }, []);

  return { start };
}
