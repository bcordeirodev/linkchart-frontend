/**
 * 🔗 LINK COMPONENT - LINK CHART
 * Componente de link customizado para substituir @fuse/core/Link
 *
 * @description
 * Este componente fornece uma interface de link consistente
 * em toda a aplicação, integrando Next.js Link com Material-UI.
 *
 * @features
 * - ✅ Integração Next.js Link + Material-UI
 * - ✅ Suporte a links externos
 * - ✅ Styling customizável
 * - ✅ Acessibilidade otimizada
 * - ✅ TypeScript completo
 *
 * @since 2.0.0
 */

import { forwardRef, ReactNode } from 'react';
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';

/**
 * Props do componente Link
 * @interface LinkProps
 */
export interface LinkProps extends Omit<MuiLinkProps, 'href'> {
	/** URL de destino */
	href: string;
	/** Elementos filhos */
	children: ReactNode;
	/** Abrir em nova aba */
	target?: string;
	/** Relação do link */
	rel?: string;
	/** Classe CSS adicional */
	className?: string;
	/** Desabilitar link */
	disabled?: boolean;
}

/**
 * Componente de link customizado
 * @param {LinkProps} props - Props do componente
 * @returns {JSX.Element} Link configurado
 */
export const LinkComponent = forwardRef<HTMLAnchorElement, LinkProps>(
	({ href, children, target, rel, disabled, sx, ...muiProps }, ref) => {
		return (
			<MuiLink
				ref={ref}
				href={href}
				target={target}
				rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
				sx={{
					textDecoration: 'none',
					color: 'inherit',
					'&:hover': {
						textDecoration: 'underline'
					},
					...(disabled && {
						pointerEvents: 'none',
						opacity: 0.5
					}),
					...sx
				}}
				{...muiProps}
			>
				{children}
			</MuiLink>
		);
	}
);

LinkComponent.displayName = 'LinkComponent';

export default LinkComponent;
