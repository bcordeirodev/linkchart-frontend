/**
 * 🧩 TIPOS DE COMPONENTES
 * Props e tipos para todos os componentes da aplicação
 */

import type { SxProps, Theme } from "@mui/material";
import type { ReactNode } from "react";

// ========================================
// 🎨 COMMON COMPONENT TYPES
// ========================================

export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

// ========================================
// 🎯 METRIC CARD TYPES
// ========================================

export interface MetricCardProps extends BaseComponentProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  /** Optional short explanation shown via a HelpHint "?" next to the title. */
  hint?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}
