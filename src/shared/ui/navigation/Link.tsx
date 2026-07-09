/**
 * 🔗 LINK COMPONENT - LINK CHART
 * Componente de link inteligente e flexível
 *
 * @description
 * Componente de link melhorado que detecta automaticamente se deve usar
 * Next.js App Router Link ou anchor tag, com integração completa ao Material-UI.
 *
 * @features
 * - ✅ Detecção automática de links externos
 * - ✅ Integração com Next.js App Router
 * - ✅ Suporte completo ao Material-UI
 * - ✅ Acessibilidade aprimorada
 * - ✅ TypeScript completo
 * - ✅ Suporte a sx props
 *
 * @since 2.0.0
 */

import { Link as MuiLink } from "@mui/material";
import { styled } from "@mui/material/styles";
import { forwardRef } from "react";
import NextLink from "next/link";

import type { LinkProps as MuiLinkProps } from "@mui/material";
import type { ReactNode, AnchorHTMLAttributes } from "react";

/**
 * Props do componente Link
 */
export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** URL de destino (interno ou externo) */
  to?: string;
  /** URL de destino (alias para to) */
  href?: string;
  /** Conteúdo do link */
  children?: ReactNode;
  /** Classe CSS */
  className?: string;
  /** Role para acessibilidade */
  role?: string;
  /** Target do link */
  target?: string;
  /** Rel do link */
  rel?: string;
  /** Propriedades de estilo do Material-UI */
  sx?: MuiLinkProps["sx"];
  /** Cor do link */
  color?: MuiLinkProps["color"];
  /** Variante do link */
  variant?: MuiLinkProps["variant"];
  /** Se deve remover o underline */
  underline?: MuiLinkProps["underline"];
  /** Se o link está desabilitado */
  disabled?: boolean;
}

/**
 * Componente estilizado para links externos
 */
const StyledExternalLink = styled(MuiLink)<LinkProps>(
  ({ theme, disabled }) => ({
    textDecoration: "none",
    color: "inherit",
    transition: theme.transitions.create(["color", "opacity"], {
      duration: theme.transitions.duration.shorter,
    }),
    ...(disabled && {
      opacity: 0.5,
      pointerEvents: "none",
      cursor: "default",
    }),
    "&:hover": {
      textDecoration: "underline",
      ...(disabled && {
        textDecoration: "none",
      }),
    },
  }),
);

/**
 * Componente estilizado para links internos
 */
const StyledInternalLink = styled(MuiLink)<LinkProps>(
  ({ theme, disabled }) => ({
    textDecoration: "none",
    color: "inherit",
    transition: theme.transitions.create(["color", "opacity"], {
      duration: theme.transitions.duration.shorter,
    }),
    ...(disabled && {
      opacity: 0.5,
      pointerEvents: "none",
      cursor: "default",
    }),
    "&:hover": {
      textDecoration: "underline",
      ...(disabled && {
        textDecoration: "none",
      }),
    },
  }),
);

/**
 * Verifica se um link é externo
 */
const isExternalLink = (url: string): boolean => {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:") ||
    url.startsWith("ftp://") ||
    url.startsWith("//") ||
    url.includes("://")
  );
};

/**
 * Smart link that picks the right primitive: external URLs render a styled `<a>` with `target="_blank"` + `rel="noopener noreferrer"`; relative paths render a `next/link` wrapped in MUI `<Link>`.
 *
 * Accepts either `to` or `href` (synonyms). Returns a plain `<span>` when both are empty so callers can drop in/out of link behaviour without conditional JSX. `isExternalLink` matches `http(s)://`, `mailto:`, `tel:`, `ftp://`, `//` and any `://`.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const {
    to,
    href,
    children,
    className,
    role,
    target,
    rel,
    sx,
    color = "primary",
    variant = "inherit",
    underline = "hover",
    disabled = false,
    ...rest
  } = props;

  const linkUrl = to || href || "";

  // Se não há URL, retorna apenas o conteúdo
  if (!linkUrl) {
    return <span className={className}>{children}</span>;
  }

  // Se é um link externo, usa anchor tag
  if (isExternalLink(linkUrl)) {
    const externalProps = {
      href: linkUrl,
      target: target || "_blank",
      rel: rel || "noopener noreferrer",
      className,
      role,
      sx,
      color,
      variant,
      underline,
      disabled,
      ref,
      ...rest,
    };

    return (
      <StyledExternalLink {...externalProps} href={linkUrl}>
        {children}
      </StyledExternalLink>
    );
  }

  // Para links internos, usa Next.js Link com Material-UI
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const InternalLinkComponent = StyledInternalLink as any;
  return (
    <InternalLinkComponent
      component={NextLink}
      href={linkUrl}
      className={className}
      role={role}
      sx={sx}
      color={color}
      variant={variant}
      underline={underline}
      disabled={disabled}
      ref={ref}
      {...rest}
    >
      {children}
    </InternalLinkComponent>
  );
});

Link.displayName = "Link";

export default Link;
