"use client";

import { HelpCircle } from "lucide-react";
import { IconButton, Tooltip } from "@mui/material";

import type { ReactNode } from "react";

export interface HelpHintProps {
  /** Texto explicativo mostrado no tooltip (já traduzido). */
  label: string;
  /** Nome acessível do gatilho. Default: o próprio `label`. */
  ariaLabel?: string;
  /** Tamanho do ícone em px. Default 15. */
  size?: number;
  /** Override do ícone do gatilho. Default: <HelpCircle />. */
  icon?: ReactNode;
}

/**
 * Afordância "?" discreta e muted que revela uma explicação curta ao passar o
 * mouse ou focar. Use ao lado de títulos ou ações para esclarecer o que algo faz
 * sem poluir o layout. Theme-aware e acessível por teclado (botão focável + Tooltip do MUI).
 *
 * @param props Configuração do hint.
 * @returns Botão-ícone com tooltip.
 */
export function HelpHint({ label, ariaLabel, size = 15, icon }: HelpHintProps) {
  return (
    <Tooltip title={label} arrow enterTouchDelay={0} leaveTouchDelay={4000}>
      <IconButton
        aria-label={ariaLabel ?? label}
        size="small"
        sx={{
          color: "text.disabled",
          p: 0.25,
          "&:hover": { color: "text.secondary" },
        }}
      >
        {icon ?? <HelpCircle width={size} height={size} />}
      </IconButton>
    </Tooltip>
  );
}

export default HelpHint;
