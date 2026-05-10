"use client";
import { useMediaQuery, useTheme } from "@mui/material";
import type { Theme } from "@mui/material/styles";

/**
 * Convenience wrapper around MUI's `useMediaQuery` that gives the query
 * function access to the active theme.
 *
 * @param query - callback that receives the MUI `Theme` and returns a media
 *                query string (e.g. `(t) => t.breakpoints.down('sm')`).
 * @returns `true` while the query matches the current viewport.
 */
export default function useThemeMediaQuery(query: (theme: Theme) => string) {
  const theme = useTheme();
  return useMediaQuery(query(theme));
}
