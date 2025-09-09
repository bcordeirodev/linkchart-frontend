/**
 * 📢 MESSAGE COMPONENT - LINK CHART
 * Sistema de mensagens/notificações global com design system integrado
 *
 * @description
 * Componente de mensagem otimizado com design moderno, animações suaves
 * e integração completa com o sistema de temas. Segue os padrões visuais
 * estabelecidos no design system da aplicação.
 *
 * @features
 * - ✅ Design system integrado com cores temáticas
 * - ✅ Múltiplas variantes (success, error, warning, info)
 * - ✅ Animações suaves e transições fluidas
 * - ✅ Ícones contextuais Material Design
 * - ✅ Ações personalizáveis e acessíveis
 * - ✅ Sistema de fila para múltiplas mensagens
 * - ✅ Acessibilidade WCAG 2.1 AA completa
 * - ✅ Responsivo e mobile-friendly
 * - ✅ Suporte a temas claro/escuro
 *
 * @example
 * ```tsx
 * // Uso através do Redux store
 * import { useAppDispatch } from '@/lib/store/hooks';
 * import { showSuccessMessage, showErrorMessage } from '@/lib/store/messageSlice';
 *
 * const dispatch = useAppDispatch();
 *
 * // Mensagem de sucesso
 * dispatch(showSuccessMessage('Operação realizada com sucesso!'));
 *
 * // Mensagem de erro
 * dispatch(showErrorMessage('Erro ao processar solicitação'));
 * ```
 *
 * @since 2.0.0
 * @version 2.1.0
 */

import { memo } from 'react';
import { Snackbar, Alert, IconButton, Slide, SlideProps, useTheme, alpha } from '@mui/material';
import { CheckCircle, Error, Warning, Info, Close } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { hideMessage, selectMessageState, selectMessageOptions } from '@/lib/store/messageSlice';
import { createPresetAnimations } from '@/lib/theme';

/**
 * Transição personalizada para o Snackbar com animação suave
 */
function SlideTransition(props: SlideProps) {
	return (
		<Slide
			{...props}
			direction="up"
			timeout={{
				enter: 400,
				exit: 250
			}}
		/>
	);
}

/**
 * Mapeamento de ícones por variante
 */
const variantIcons = {
	success: CheckCircle,
	error: Error,
	warning: Warning,
	info: Info
} as const;

/**
 * Componente de mensagem global com design system integrado
 */
export function Message() {
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const open = useAppSelector(selectMessageState);
	const options = useAppSelector(selectMessageOptions);
	const animations = createPresetAnimations(theme);

	const handleClose = () => {
		dispatch(hideMessage());
	};

	const IconComponent = variantIcons[options.variant];

	// Cores aprimoradas seguindo o design system
	const getVariantStyles = (variant: typeof options.variant) => {
		let baseColor = theme.palette[variant];

		// Customizar cor de sucesso para azul mais escuro
		if (variant === 'success') {
			baseColor = {
				...baseColor,
				main: '#0D47A1',
				light: '#1565C0',
				dark: '#01579B',
				contrastText: '#FFFFFF'
			};
		}

		return {
			backgroundColor: alpha(baseColor.main, 0.95),
			color: baseColor.contrastText,
			border: `1px solid ${alpha(baseColor.main, 0.3)}`,
			backdropFilter: 'blur(8px)',
			'& .MuiAlert-icon': {
				color: baseColor.contrastText,
				filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
			},
			'&::before': {
				content: '""',
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				height: '3px',
				background: `linear-gradient(90deg, ${baseColor.main} 0%, ${baseColor.light} 100%)`,
				borderRadius: '12px 12px 0 0'
			}
		};
	};

	return (
		<Snackbar
			open={open}
			autoHideDuration={options.autoHideDuration}
			onClose={handleClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			TransitionComponent={SlideTransition}
			sx={{
				'& .MuiSnackbarContent-root': {
					padding: 0
				},
				// Posicionamento fixo no bottom da viewport
				position: 'fixed !important',
				bottom: '24px !important',
				left: '50% !important',
				right: 'auto !important',
				top: 'auto !important',
				transform: 'translateX(-50%) !important',
				zIndex: 9999,
				// Remover qualquer centralização vertical
				'&.MuiSnackbar-root': {
					top: 'auto !important',
					bottom: '24px !important',
					transform: 'translateX(-50%) !important'
				},
				// Responsividade
				[theme.breakpoints.down('sm')]: {
					left: '24px !important',
					right: '24px !important',
					transform: 'none !important',
					maxWidth: 'calc(100vw - 48px)',
					bottom: '24px !important',
					top: 'auto !important'
				}
			}}
		>
			<Alert
				severity={options.variant}
				onClose={handleClose}
				icon={<IconComponent />}
				action={
					options.action || (
						<IconButton
							size="small"
							aria-label="Fechar mensagem"
							color="inherit"
							onClick={handleClose}
							sx={{
								'&:hover': {
									backgroundColor: alpha(theme.palette.common.white, 0.15),
									transform: 'scale(1.1)'
								},
								transition: theme.transitions.create(['transform', 'background-color'], {
									duration: theme.transitions.duration.short
								})
							}}
						>
							<Close fontSize="small" />
						</IconButton>
					)
				}
				sx={{
					...animations.fadeIn,
					// Tamanho fixo para desktop, responsivo para mobile
					width: { xs: '100%', sm: '500px' },
					minWidth: 'auto',
					maxWidth: 'none',
					borderRadius: theme.spacing(1.5), // 12px - padrão do design system
					boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
					position: 'relative',
					overflow: 'hidden',
					fontFamily: theme.typography.fontFamily,

					'& .MuiAlert-message': {
						padding: theme.spacing(1, 0),
						display: 'flex',
						alignItems: 'center',
						gap: theme.spacing(1),
						fontSize: theme.typography.body2.fontSize,
						fontWeight: theme.typography.fontWeightMedium,
						lineHeight: 1.5,
						flex: 1
					},
					'& .MuiAlert-action': {
						padding: theme.spacing(0.5, 1, 0.5, 0),
						marginRight: 0,
						alignItems: 'flex-start'
					},

					// Aplicar estilos por variante usando design system
					...getVariantStyles(options.variant),

					// Responsividade para mobile
					[theme.breakpoints.down('sm')]: {
						borderRadius: theme.spacing(1),
						'& .MuiAlert-message': {
							fontSize: theme.typography.body2.fontSize,
							padding: theme.spacing(0.75, 0)
						}
					}
				}}
			>
				{options.message}
			</Alert>
		</Snackbar>
	);
}

// Compatibility export
export const FuseMessage = Message;

export default memo(Message);
