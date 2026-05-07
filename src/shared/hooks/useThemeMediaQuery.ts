"use client";
import { useMediaQuery, useTheme } from "@mui/material";
import type { Theme } from "@mui/material/styles";

export default function useThemeMediaQuery(query: (theme: Theme) => string) {
  const theme = useTheme();
  return useMediaQuery(query(theme));
}
