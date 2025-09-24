/**
 * 🎨 SVG ICON COMPONENT - LINK CHART
 * Componente de ícone SVG moderno e flexível
 *
 * @description
 * Componente melhorado para renderização de ícones SVG com suporte completo
 * a temas, tamanhos dinâmicos e integração com Material-UI.
 *
 * @features
 * - ✅ Suporte a ícones SVG externos
 * - ✅ Integração com Material-UI Icons
 * - ✅ Cores temáticas dinâmicas
 * - ✅ Tamanhos responsivos
 * - ✅ Performance otimizada
 * - ✅ TypeScript completo
 *
 * @since 2.0.0
 */

import { Box, Icon } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { forwardRef } from 'react';

import type { BoxProps } from '@mui/material';
import type { ReactNode } from 'react';

/**
 * Props do componente SvgIcon
 */
export interface SvgIconProps extends Omit<BoxProps, 'ref'> {
	/** Conteúdo do ícone (string para SVG path ou ReactNode para ícone MUI) */
	children?: ReactNode | string;
	/** Cor do ícone */
	color?: 'inherit' | 'disabled' | 'primary' | 'secondary' | 'action' | 'error' | 'info' | 'success' | 'warning';
	/** Tamanho do ícone */
	size?: number | string;
	/** Propriedades SVG */
	fill?: string;
	xmlns?: string;
	viewBox?: string;
}

/**
 * Componente estilizado para o container do ícone
 */
const StyledIconContainer = styled(Box)<SvgIconProps>(({ theme, size = 24, color = 'inherit' }) => {
	const colorMap = {
		primary: theme.palette.primary.main,
		secondary: theme.palette.secondary.main,
		info: theme.palette.info.main,
		success: theme.palette.success.main,
		warning: theme.palette.warning.main,
		action: theme.palette.action.active,
		error: theme.palette.error.main,
		disabled: theme.palette.action.disabled,
		inherit: 'currentColor'
	};

	return {
		width: size,
		height: size,
		minWidth: size,
		minHeight: size,
		fontSize: size,
		lineHeight: size,
		color: colorMap[color],
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexShrink: 0,
		transition: theme.transitions.create(['color', 'transform'], {
			duration: theme.transitions.duration.shorter
		}),
		'& svg': {
			width: '100%',
			height: '100%',
			fill: 'currentColor'
		}
	};
});

/**
 * Componente de ícone SVG melhorado
 */
export const SvgIcon = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
	const {
		children,
		className,
		color = 'inherit',
		size = 24,
		fill = 'currentColor',
		xmlns = 'http://www.w3.org/2000/svg',
		viewBox = '0 0 24 24',
		...other
	} = props;

	// Se não há children, retorna null
	if (!children) {
		return null;
	}

	// Se children é um ReactNode (componente MUI Icon), renderiza diretamente
	if (typeof children !== 'string') {
		return (
			<StyledIconContainer
				{...other}
				size={size}
				color={color}
				className={clsx('svg-icon', className)}
			>
				{children}
			</StyledIconContainer>
		);
	}

	// Se é uma string simples (nome do ícone Material-UI), usa o componente Icon
	if (!children.includes(':') && !children.includes('/')) {
		return (
			<StyledIconContainer
				{...other}
				size={size}
				color={color}
				className={clsx('svg-icon material-icon', className)}
			>
				<Icon>{children}</Icon>
			</StyledIconContainer>
		);
	}

	// Se contém ':', trata como path de ícone SVG externo
	let iconPath = children;

	if (children.includes(':')) {
		iconPath = children.replace(':', '.svg#');
	}

	return (
		<StyledIconContainer
			{...other}
			component='svg'
			size={size}
			color={color}
			fill={fill}
			xmlns={xmlns}
			viewBox={viewBox}
			className={clsx('svg-icon external-svg', className)}
			ref={ref}
		>
			<use xlinkHref={`/assets/icons/${iconPath}`} />
		</StyledIconContainer>
	);
});

SvgIcon.displayName = 'SvgIcon';

// Compatibility exports
export const FuseSvgIcon = SvgIcon;

export default SvgIcon;
