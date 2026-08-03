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
