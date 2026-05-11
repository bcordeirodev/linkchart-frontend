/**
 * 🔒 SAFE TYPOGRAPHY - COMPONENTE BASE
 * Typography com sanitização e segurança
 */

import { Typography } from "@mui/material";

import type { TypographyProps } from "@mui/material";

interface SafeTypographyProps extends TypographyProps {
  /** When true, strips all `<...>` tags from string children before rendering (default `false`). */
  sanitize?: boolean;
  /** Truncate string children to this many characters + `"..."`. No effect on ReactNode children. */
  maxLength?: number;
}

/**
 * MUI `<Typography>` with optional HTML-tag stripping and length-based truncation.
 *
 * Both transforms apply only when `children` is a plain string; ReactNode children pass through unchanged. The tag regex is intentionally simple — for untrusted HTML use a real sanitizer (DOMPurify) instead.
 */
function SafeTypography({
  children,
  sanitize = false,
  maxLength,
  ...other
}: SafeTypographyProps) {
  let content = children;

  // Truncar se necessário
  if (maxLength && typeof content === "string" && content.length > maxLength) {
    content = `${content.substring(0, maxLength)}...`;
  }

  // Sanitização básica se necessário
  if (sanitize && typeof content === "string") {
    content = content.replace(/<[^>]*>/g, ""); // Remove tags HTML
  }

  return <Typography {...other}>{content}</Typography>;
}

export default SafeTypography;
