/**
 * 📢 MESSAGE COMPONENT — LINK CHART
 * Toast/notificação global no idioma visual do design system.
 *
 * Surface-style com accent stripe lateral, ícone tonalizado (subtleBg+main),
 * progress bar de auto-hide e badge de fila. Cores via `semanticDark`/`semanticLight`,
 * radius/elevation/motion via tokens do designSystem.
 *
 * @since 3.0.0 — redesign alinhado ao design system Link Charts
 */

import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Snackbar, IconButton, Slide, Box, Typography, useTheme, alpha } from '@mui/material';
import { memo } from 'react';

import { ICON_MD } from '@/lib/theme/iconDefaults';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { hideMessage, selectMessageState, selectMessageOptions, selectMessageQueue } from '@/lib/store/messageSlice';
import {
	darkNeutral,
	elevationLightTokens,
	elevationTokens,
	lightNeutral,
	motionTokens,
	radiusTokens,
	semanticDark,
	semanticLight
} from '@/lib/theme';

import type { LucideProps } from 'lucide-react';
import type { MessageVariant } from '@/lib/store/messageSlice';
import type { SlideProps } from '@mui/material';

const variantIcons: Record<MessageVariant, React.ComponentType<LucideProps>> = {
	success: CheckCircle,
	error: XCircle,
	warning: AlertTriangle,
	info: Info
};

/** Transições estáveis (módulo) com direção pré-resolvida — evita remount do subtree. */
function SlideUp(props: SlideProps) {
	return (
		<Slide
			{...props}
			direction='up'
		/>
	);
}

SlideUp.displayName = 'SlideUp';

function SlideDown(props: SlideProps) {
	return (
		<Slide
			{...props}
			direction='down'
		/>
	);
}

SlideDown.displayName = 'SlideDown';

export function Message() {
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const open = useAppSelector(selectMessageState);
	const options = useAppSelector(selectMessageOptions);
	const queue = useAppSelector(selectMessageQueue);

	const isDark = theme.palette.mode === 'dark';
	const semantic = isDark ? semanticDark : semanticLight;
	const neutral = isDark ? darkNeutral : lightNeutral;
	const elevation = isDark ? elevationTokens : elevationLightTokens;

	const tone = semantic[options.variant];
	const IconComponent = variantIcons[options.variant];

	const SlideTransition = options.anchorOrigin.vertical === 'top' ? SlideDown : SlideUp;

	const handleClose = () => dispatch(hideMessage());

	const hasAutoHide = typeof options.autoHideDuration === 'number' && options.autoHideDuration > 0;
	const queueCount = queue.length;

	return (
		<Snackbar
			open={open}
			autoHideDuration={options.autoHideDuration ?? null}
			onClose={handleClose}
			anchorOrigin={options.anchorOrigin}
			TransitionComponent={SlideTransition}
			sx={{
				maxWidth: { xs: 'calc(100vw - 32px)', sm: 480 },
				width: { xs: 'calc(100vw - 32px)', sm: 'auto' }
			}}
		>
			<Box
				key={options.id}
				role='alert'
				aria-live='polite'
				sx={{
					position: 'relative',
					display: 'flex',
					alignItems: 'flex-start',
					gap: 1.5,
					p: 1.5,
					pl: 2,
					width: '100%',
					minWidth: { sm: 360 },
					backgroundColor: theme.palette.background.paper,
					backgroundImage: `linear-gradient(${alpha(tone.main, isDark ? 0.06 : 0.04)}, ${alpha(tone.main, isDark ? 0.06 : 0.04)})`,
					border: `1px solid ${tone.border}`,
					borderRadius: `${radiusTokens.lg}px`,
					boxShadow: elevation.lg,
					backdropFilter: 'blur(12px)',
					overflow: 'hidden',
					transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						bottom: 0,
						left: 0,
						width: 4,
						backgroundColor: tone.main
					}
				}}
			>
				<Box
					aria-hidden='true'
					sx={{
						flexShrink: 0,
						width: 36,
						height: 36,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: `${radiusTokens.md}px`,
						backgroundColor: tone.subtleBg,
						color: tone.main
					}}
				>
					<IconComponent {...ICON_MD} />
				</Box>

				<Box sx={{ flex: 1, minWidth: 0, pt: 0.25 }}>
					<Typography
						component='div'
						sx={{
							color: theme.palette.text.primary,
							fontSize: '0.875rem',
							lineHeight: 1.43,
							fontWeight: 500,
							wordBreak: 'break-word'
						}}
					>
						{options.message}
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
					{queueCount > 0 && (
						<Box
							aria-label={`${queueCount} mensagens na fila`}
							sx={{
								px: 0.75,
								py: 0.25,
								minWidth: 24,
								height: 20,
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: 999,
								backgroundColor: alpha(theme.palette.text.primary, isDark ? 0.08 : 0.06),
								color: theme.palette.text.secondary,
								fontSize: '0.6875rem',
								fontWeight: 600,
								lineHeight: 1
							}}
						>
							+{queueCount}
						</Box>
					)}

					{options.action ?? (
						<IconButton
							size='small'
							aria-label='Fechar mensagem'
							onClick={handleClose}
							sx={{
								color: neutral.text.tertiary,
								borderRadius: `${radiusTokens.sm}px`,
								transition: `background-color ${motionTokens.duration.fast} ${motionTokens.easing.default}, color ${motionTokens.duration.fast} ${motionTokens.easing.default}`,
								'&:hover': {
									backgroundColor: theme.palette.action.hover,
									color: theme.palette.text.primary
								}
							}}
						>
							<X {...ICON_MD} />
						</IconButton>
					)}
				</Box>

				{hasAutoHide ? (
					<Box
						aria-hidden='true'
						sx={{
							position: 'absolute',
							left: 4,
							right: 0,
							bottom: 0,
							height: 2,
							overflow: 'hidden',
							'@keyframes lcMessageProgress': {
								from: { transform: 'scaleX(1)' },
								to: { transform: 'scaleX(0)' }
							},
							'&::after': {
								content: '""',
								display: 'block',
								height: '100%',
								width: '100%',
								backgroundColor: tone.main,
								opacity: 0.6,
								transformOrigin: 'left center',
								animation: `lcMessageProgress ${options.autoHideDuration}ms linear forwards`
							}
						}}
					/>
				) : null}
			</Box>
		</Snackbar>
	);
}

export const FuseMessage = Message;

export default memo(Message);
