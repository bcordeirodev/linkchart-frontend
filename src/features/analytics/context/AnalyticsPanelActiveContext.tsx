"use client";

/**
 * @file Whether the analytics panel around a hook is the one being looked at.
 *
 * The link analytics tabs use a mount-once pattern: a tab that has been opened
 * stays in the DOM behind `display: none` so its state survives tab switching.
 * The side effect is that every visited tab's data hooks stay live — change the
 * period and all of them refetch at once, though only one is on screen.
 *
 * Rather than thread an `enabled` prop through five tab components and their
 * children, each panel publishes whether it is active and the analytics hooks
 * read it. The default is `true`, so any consumer outside the tabs (reports,
 * public analytics, tests) behaves exactly as before.
 */

import { createContext, useContext } from "react";

import type { ReactNode } from "react";

const AnalyticsPanelActiveContext = createContext(true);

interface AnalyticsPanelActiveProviderProps {
  /** True while this panel is the visible one. */
  active: boolean;
  children: ReactNode;
}

/**
 * Marks its subtree as belonging to an active (or hidden) analytics panel.
 */
export function AnalyticsPanelActiveProvider({
  active,
  children,
}: AnalyticsPanelActiveProviderProps) {
  return (
    <AnalyticsPanelActiveContext.Provider value={active}>
      {children}
    </AnalyticsPanelActiveContext.Provider>
  );
}

/**
 * Whether the surrounding analytics panel is currently visible.
 *
 * Hooks should AND this into their `enabled` so a hidden tab holds its cached
 * data but does not fetch. Returns `true` outside any provider.
 *
 * @returns `true` when the panel is on screen (or there is no panel).
 */
export function useAnalyticsPanelActive(): boolean {
  return useContext(AnalyticsPanelActiveContext);
}
