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

/**
 * Key the tour used before dismissal moved to the user's account.
 *
 * Still read once, so someone who already dismissed the tour on this browser is
 * not shown it again just because the server has never heard of them. The value
 * is promoted to the account on the next visit and the key is then dropped.
 */
const LEGACY_TOUR_DONE_KEY = "onboarding.links.tourDone";

/**
 * Whether this browser holds the pre-account "tour seen" flag.
 *
 * @returns `true` when the legacy localStorage flag is set.
 */
function readLegacyTourDone(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return window.localStorage.getItem(LEGACY_TOUR_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Drops the legacy flag once it has been promoted to the user's account.
 */
function clearLegacyTourDone(): void {
  try {
    window.localStorage.removeItem(LEGACY_TOUR_DONE_KEY);
  } catch {
    /* private mode / quota — the account flag is the source of truth anyway */
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
 * Dismissal is stored on the user's account (`onboarding["links.tour"]`), not in
 * `localStorage`, so the tour does not replay on a new browser, a new device or
 * a private window.
 *
 * @param args.ready Gate that defers the auto-run until anchors exist in the DOM.
 * @returns `{ start }` to trigger the tour on demand.
 */
export function useLinksTour({ ready }: UseLinksTourArgs): UseLinksTour {
  const { t } = useTranslation("links");
  const theme = useTheme();
  const { user, isLoading: authLoading, markOnboardingSeen } = useAuth();
  const driverRef = useRef<Driver | null>(null);

  const seen = Boolean(user?.onboarding?.[TOUR_FLAG]);

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

  // One-off migration: someone who dismissed the tour before it moved to the
  // account still carries the old localStorage flag. Promote it instead of
  // replaying the tour at them, then drop the key.
  useEffect(() => {
    if (authLoading || !user || seen || !readLegacyTourDone()) {
      return;
    }
    void markOnboardingSeen(TOUR_FLAG).then(clearLegacyTourDone);
  }, [authLoading, user, seen, markOnboardingSeen]);

  // Auto-run once, on the first visit of a user who has never dismissed it.
  //
  // Gated on the account being resolved: firing while `/api/me` is still in
  // flight would flash the tour at a user who already dismissed it, since
  // `seen` only becomes true once the user lands.
  useEffect(() => {
    if (!ready || authLoading || !user || seen || readLegacyTourDone()) {
      return;
    }
    const id = window.setTimeout(() => start(), 500);
    return () => window.clearTimeout(id);
  }, [ready, authLoading, user, seen, start]);

  // Tear down any live tour on unmount.
  useEffect(() => {
    return () => {
      driverRef.current?.destroy();
    };
  }, []);

  return { start };
}
