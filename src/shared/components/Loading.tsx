/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Componente de loading moderno com animações suaves
 *
 * @description
 * Loading component melhorado com design moderno usando Material-UI.
 * Substitui o FuseLoading com melhor UX e integração com temas.
 */

import { Box, CircularProgress, Typography, useTheme, alpha, Fade } from '@mui/material';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * Props do componente Loading
 */
export interface LoadingProps {
	/** Delay antes de mostrar o loading (ms) */
	delay?: number;
	/** Classe CSS adicional */
	className?: string;
	/** Tamanho do loading */
	size?: 'small' | 'medium' | 'large';
	/** Variante do loading */
	variant?: 'circular' | 'linear' | 'dots';
	/** Texto de loading */
	text?: string;
	/** Se deve ocupar toda a altura */
	fullHeight?: boolean;
	/** Cor personalizada */
	color?: 'primary' | 'secondary' | 'inherit';
}

/**
 * Componente de loading com pontos animados
 */
function DotsLoader({ color, theme }: { color: LoadingProps['color']; theme: any }) {
	return (
		<Box sx={{ display: 'flex', gap: 0.5 }}>
			{[0, 1, 2].map((index) => (
				<motion.div
					key={index}
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.5, 1, 0.5]
					}}
					transition={{
						duration: 1,
						repeat: Infinity,
						delay: index * 0.2
					}}
					style={{
						width: 8,
						height: 8,
						borderRadius: '50%',
						backgroundColor:
							color === 'inherit'
								? 'currentColor'
								: color && (color === 'primary' || color === 'secondary')
									? theme.palette[color].main
									: theme.palette.primary.main
					}}
				/>
			))}
		</Box>
	);
}

/**
 * Componente de loading linear animado
 */
function LinearLoader({ color, theme }: { color: LoadingProps['color']; theme: any }) {
	const getBackgroundColor = () => {
		if (color === 'inherit') {
			return theme.palette.text.primary;
		}
		if (color && (color === 'primary' || color === 'secondary')) {
			return theme.palette[color].main;
		}
		return theme.palette.primary.main; // fallback
	};

	return (
		<Box
			sx={{
				width: 200,
				height: 4,
				backgroundColor: alpha(getBackgroundColor(), 0.2),
				borderRadius: 2,
				overflow: 'hidden',
				position: 'relative'
			}}
		>
			<motion.div
				animate={{
					x: [-200, 200]
				}}
				transition={{
					duration: 1.5,
					repeat: Infinity,
					ease: 'easeInOut'
				}}
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '50%',
					height: '100%',
					backgroundColor: getBackgroundColor(),
					borderRadius: 2
				}}
			/>
		</Box>
	);
}

/**
 * Componente de loading moderno
 */
export function Loading({
	delay = 0,
	className,
	size = 'medium',
	variant = 'circular',
	text,
	fullHeight = true,
	color = 'primary'
}: LoadingProps) {
	const theme = useTheme();
	const [showLoading, setShowLoading] = useState(delay === 0);

	useEffect(() => {
		if (delay > 0) {
			const timer = setTimeout(() => {
				setShowLoading(true);
			}, delay);

			return () => clearTimeout(timer);
		}
	}, [delay]);

	const sizeMap = {
		small: 32,
		medium: 48,
		large: 64
	};

	const containerSx = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 2,
		p: 3,
		...(fullHeight && {
			minHeight: '100vh',
			width: '100%'
		}),
		...(className && { className })
	};

	const renderLoader = () => {
		switch (variant) {
			case 'dots':
				return (
					<DotsLoader
						color={color}
						theme={theme}
					/>
				);
			case 'linear':
				return (
					<LinearLoader
						color={color}
						theme={theme}
					/>
				);
			case 'circular':
			default:
				return (
					<CircularProgress
						size={sizeMap[size]}
						color={color}
						thickness={4}
						sx={{
							'& .MuiCircularProgress-circle': {
								strokeLinecap: 'round'
							}
						}}
					/>
				);
		}
	};

	if (!showLoading) {
		return null;
	}

	return (
		<Fade
			in={showLoading}
			timeout={300}
		>
			<Box sx={containerSx}>
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3 }}
				>
					{renderLoader()}
				</motion.div>

				{text ? (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.1 }}
					>
						<Typography
							variant='body2'
							color='text.secondary'
							sx={{
								fontWeight: 500,
								textAlign: 'center'
							}}
						>
							{text}
						</Typography>
					</motion.div>
				) : null}
			</Box>
		</Fade>
	);
}

export default Loading;
