// src/features/links/components/list/LinkDetailDrawer.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Button,
	Divider,
	Drawer,
	IconButton,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import {
	HiChartBar,
	HiClipboardDocument,
	HiPencilSquare,
	HiXMark,
} from 'react-icons/hi2';

import { getLinkStatus, STATUS_MAP } from '@/features/links/utils/linkStatus';
import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';
import useClipboard from '@/hooks/useClipboard';
import type { LinkResponse } from '@/types';

interface LinkDetailDrawerProps {
	link: LinkResponse | null;
	onClose: () => void;
}

function formatDate(value: string | null | undefined): string {
	if (!value) { return '—'; }
	try {
		return new Date(value).toLocaleDateString('pt-BR');
	} catch {
		return '—';
	}
}

function SectionLabel({ children }: { children: React.ReactNode }) {
	return (
		<Typography
			variant='caption'
			color='text.secondary'
			sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, mb: 1, display: 'block' }}
		>
			{children}
		</Typography>
	);
}

export function LinkDetailDrawer({ link, onClose }: LinkDetailDrawerProps) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [urlExpanded, setUrlExpanded] = useState(false);

	const { copied, copy } = useClipboard({
		timeout: 1500,
		onSuccess: () => dispatch(showMessage({ message: 'URL copiada!', variant: 'success' })),
	});

	const status = link ? getLinkStatus(link) : 'inactive';
	const { color: statusColor, label: statusLabel } = STATUS_MAP[status];
	const hasSchedule = !!(link?.starts_in || link?.expires_at);
	const hasUtm = !!(
		link?.utm_source ||
		link?.utm_medium ||
		link?.utm_campaign ||
		link?.utm_term ||
		link?.utm_content
	);

	const goTo = (path: string) => {
		onClose();
		navigate(path);
	};

	return (
		<Drawer
			anchor='right'
			open={!!link}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: { xs: '100vw', sm: 400 },
					display: 'flex',
					flexDirection: 'column',
				},
			}}
		>
			{!!link && (
				<Box
					key={String(link.id)}
					sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
				>
					{/* Header */}
					<Box
						sx={{
							px: 3,
							pt: 2,
							pb: 1.5,
							display: 'flex',
							alignItems: 'flex-start',
							justifyContent: 'space-between',
							flexShrink: 0,
						}}
					>
						<Box>
							<Typography
								variant='h6'
								sx={{ fontWeight: 700, lineHeight: 1.2 }}
							>
								{link.slug || link.custom_slug}
							</Typography>
							<Stack
								direction='row'
								spacing={0.75}
								alignItems='center'
								sx={{ mt: 0.5 }}
							>
								<Box
									sx={{
										width: 8,
										height: 8,
										borderRadius: '50%',
										bgcolor: statusColor,
										flexShrink: 0,
									}}
								/>
								<Typography
									variant='caption'
									color='text.secondary'
								>
									{statusLabel}
								</Typography>
							</Stack>
						</Box>
						<IconButton
							size='small'
							onClick={onClose}
							sx={{ ml: 1, mt: -0.5 }}
						>
							<HiXMark size={18} />
						</IconButton>
					</Box>

					<Divider />

					{/* Scrollable body */}
					<Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2 }}>
						{/* URL Original */}
						<Box sx={{ mb: 2 }}>
							<SectionLabel>URL Original</SectionLabel>
							<Typography
								variant='body2'
								sx={{
									wordBreak: 'break-all',
									...(urlExpanded
										? {}
										: {
												display: '-webkit-box',
												WebkitLineClamp: 2,
												WebkitBoxOrient: 'vertical',
												overflow: 'hidden',
											}),
								}}
							>
								{link.original_url}
							</Typography>
							{link.original_url.length > 80 && (
								<Typography
									variant='caption'
									color='primary'
									sx={{ cursor: 'pointer', mt: 0.5, display: 'block' }}
									onClick={() => setUrlExpanded((v) => !v)}
								>
									{urlExpanded ? 'ver menos' : 'ver completa'}
								</Typography>
							)}
						</Box>

						{/* URL Encurtada */}
						<Box sx={{ mb: 2 }}>
							<SectionLabel>URL Encurtada</SectionLabel>
							<Stack
								direction='row'
								alignItems='center'
								spacing={1}
							>
								<Box
									sx={{
										flex: 1,
										px: 1.5,
										py: 0.75,
										bgcolor: 'rgba(25, 118, 210, 0.08)',
										borderRadius: 1,
										fontFamily: 'monospace',
										fontSize: '0.8125rem',
										color: 'primary.main',
										fontWeight: 600,
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}}
								>
									{link.short_url}
								</Box>
								<Tooltip title={copied ? 'Copiado!' : 'Copiar'}>
									<IconButton
										size='small'
										onClick={() => copy(link.short_url)}
									>
										<HiClipboardDocument size={16} />
									</IconButton>
								</Tooltip>
							</Stack>
						</Box>

						<Divider sx={{ my: 1.5 }} />

						{/* Estatísticas */}
						<Box sx={{ mb: 2 }}>
							<SectionLabel>Estatísticas</SectionLabel>
							<Stack direction='row' spacing={4}>
								<Box>
									<Typography variant='h5' sx={{ fontWeight: 700 }}>
										{link.clicks ?? 0}
									</Typography>
									<Typography variant='caption' color='text.secondary'>
										Clicks totais
									</Typography>
								</Box>
								<Box>
									<Typography variant='h5' sx={{ fontWeight: 700 }}>
										{link.click_limit ?? '∞'}
									</Typography>
									<Typography variant='caption' color='text.secondary'>
										Limite
									</Typography>
								</Box>
							</Stack>
						</Box>

						{/* Agendamento */}
						{hasSchedule ? (
							<>
								<Divider sx={{ my: 1.5 }} />
								<Box sx={{ mb: 2 }}>
									<SectionLabel>Agendamento</SectionLabel>
									<Stack direction='row' spacing={4}>
										<Box>
											<Typography variant='caption' color='text.secondary' display='block'>
												Início
											</Typography>
											<Typography variant='body2' sx={{ fontWeight: 600 }}>
												{formatDate(link.starts_in)}
											</Typography>
										</Box>
										<Box>
											<Typography variant='caption' color='text.secondary' display='block'>
												Término
											</Typography>
											<Typography variant='body2' sx={{ fontWeight: 600 }}>
												{formatDate(link.expires_at)}
											</Typography>
										</Box>
									</Stack>
								</Box>
							</>
						) : null}

						{/* UTM */}
						{hasUtm ? (
							<>
								<Divider sx={{ my: 1.5 }} />
								<Box sx={{ mb: 2 }}>
									<SectionLabel>Parâmetros UTM</SectionLabel>
									<Stack spacing={0.5}>
										{!!link.utm_source && <Typography variant='body2'><b>Source:</b> {link.utm_source}</Typography>}
										{!!link.utm_medium && <Typography variant='body2'><b>Medium:</b> {link.utm_medium}</Typography>}
										{!!link.utm_campaign && <Typography variant='body2'><b>Campaign:</b> {link.utm_campaign}</Typography>}
										{!!link.utm_term && <Typography variant='body2'><b>Term:</b> {link.utm_term}</Typography>}
										{!!link.utm_content && <Typography variant='body2'><b>Content:</b> {link.utm_content}</Typography>}
									</Stack>
								</Box>
							</>
						) : null}

						<Divider sx={{ my: 1.5 }} />

						{/* Datas */}
						<Stack spacing={0.5}>
							<Typography variant='caption' color='text.secondary'>
								Criado em: <b>{formatDate(link.created_at)}</b>
							</Typography>
							<Typography variant='caption' color='text.secondary'>
								Atualizado: <b>{formatDate(link.updated_at)}</b>
							</Typography>
						</Stack>
					</Box>

					{/* Footer */}
					<Box
						sx={{
							px: 3,
							py: 2,
							flexShrink: 0,
							borderTop: 1,
							borderColor: 'divider',
						}}
					>
						<Stack direction='row' spacing={1.5}>
							<Button
								variant='contained'
								startIcon={<HiChartBar size={16} />}
								onClick={() => goTo(`/link/analytic/${link.id}`)}
								sx={{ flex: 1 }}
							>
								Analytics
							</Button>
							<Button
								variant='outlined'
								startIcon={<HiPencilSquare size={16} />}
								onClick={() => goTo(`/link/edit/${link.id}`)}
								sx={{ flex: 1 }}
							>
								Editar
							</Button>
						</Stack>
					</Box>
				</Box>
			)}
		</Drawer>
	);
}
