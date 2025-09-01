/**
 * 📢 MESSAGE COMPONENT - LINK CHART
 * Sistema de mensagens/notificações global
 *
 * @description
 * Componente de mensagem melhorado com design moderno, animações
 * e integração completa com o sistema de temas.
 *
 * @features
 * - ✅ Design moderno com Material-UI
 * - ✅ Múltiplas variantes com cores temáticas
 * - ✅ Animações suaves
 * - ✅ Ícones contextuais
 * - ✅ Ações personalizáveis
 * - ✅ Fila de mensagens
 * - ✅ Acessibilidade completa
 *
 * @since 2.0.0
 */

import { memo } from 'react';
import { Snackbar, Alert, AlertTitle, IconButton, Slide, SlideProps, useTheme, alpha } from '@mui/material';
import { CheckCircle, Error, Warning, Info, Close } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { hideMessage, selectMessageState, selectMessageOptions, MessageVariant } from '@/lib/store/messageSlice';

/**
 * Transição personalizada para o Snackbar
 */
function SlideTransition(props: SlideProps) {
	return (
		<Slide
			{...props}
			direction="down"
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
 * Componente de mensagem global
 */
export function Message() {
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const open = useAppSelector(selectMessageState);
	const options = useAppSelector(selectMessageOptions);

	const handleClose = () => {
		dispatch(hideMessage());
	};

	const IconComponent = variantIcons[options.variant];

	return (
		<Snackbar
			open={open}
			autoHideDuration={options.autoHideDuration}
			onClose={handleClose}
			anchorOrigin={options.anchorOrigin}
			TransitionComponent={SlideTransition}
			sx={{
				'& .MuiSnackbarContent-root': {
					padding: 0
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
							aria-label="close"
							color="inherit"
							onClick={handleClose}
							sx={{
								'&:hover': {
									backgroundColor: alpha(theme.palette.common.white, 0.1)
								}
							}}
						>
							<Close fontSize="small" />
						</IconButton>
					)
				}
				sx={{
					minWidth: 300,
					maxWidth: 600,
					borderRadius: 2,
					boxShadow: theme.shadows[8],
					'& .MuiAlert-message': {
						padding: '8px 0',
						display: 'flex',
						alignItems: 'center',
						gap: 1,
						fontSize: '0.875rem',
						fontWeight: 500
					},
					'& .MuiAlert-icon': {
						fontSize: '1.25rem',
						opacity: 0.9
					},
					'& .MuiAlert-action': {
						padding: '4px 8px 4px 0',
						marginRight: 0
					},
					// Cores personalizadas por variante
					...(options.variant === 'success' && {
						backgroundColor: theme.palette.success.main,
						color: theme.palette.success.contrastText,
						'& .MuiAlert-icon': {
							color: theme.palette.success.contrastText
						}
					}),
					...(options.variant === 'error' && {
						backgroundColor: theme.palette.error.main,
						color: theme.palette.error.contrastText,
						'& .MuiAlert-icon': {
							color: theme.palette.error.contrastText
						}
					}),
					...(options.variant === 'warning' && {
						backgroundColor: theme.palette.warning.main,
						color: theme.palette.warning.contrastText,
						'& .MuiAlert-icon': {
							color: theme.palette.warning.contrastText
						}
					}),
					...(options.variant === 'info' && {
						backgroundColor: theme.palette.info.main,
						color: theme.palette.info.contrastText,
						'& .MuiAlert-icon': {
							color: theme.palette.info.contrastText
						}
					})
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
