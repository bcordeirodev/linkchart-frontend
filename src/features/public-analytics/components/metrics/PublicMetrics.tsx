import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import type { PublicAnalyticsData } from '../../types';

interface PublicMetricsProps {
	analyticsData: PublicAnalyticsData;
}

const cardBase = {
	background: 'rgba(255,255,255,0.04)',
	border: '1px solid rgba(255,255,255,0.07)',
	borderRadius: '12px',
	p: '18px 16px'
} as const;

const labelSx = {
	fontSize: '0.625rem',
	color: 'rgba(255,255,255,0.3)',
	fontWeight: 500,
	textTransform: 'uppercase' as const,
	letterSpacing: '0.5px',
	mb: 1
};

const subSx = {
	fontSize: '0.625rem',
	color: 'rgba(255,255,255,0.2)',
	mt: 0.75
};

export function PublicMetrics({ analyticsData }: PublicMetricsProps) {
	const createdDate = analyticsData.created_at ? new Date(analyticsData.created_at) : null;
	const isValid = createdDate !== null && !isNaN(createdDate.getTime());
	const dateLabel = isValid ? format(createdDate, 'dd/MM/yyyy', { locale: ptBR }) : '—';
	const timeLabel = isValid ? format(createdDate, 'HH:mm', { locale: ptBR }) : '';

	return (
		<Box
			sx={{
				display: 'grid',
				gridTemplateColumns: { xs: '1fr 1fr', md: '2fr 1fr 1fr 1fr' },
				gap: '10px'
			}}
		>
			{/* Cliques — destaque */}
			<Box sx={{ ...cardBase, borderColor: 'rgba(99,102,241,0.15)', gridColumn: { xs: 'span 2', md: 'span 1' } }}>
				<Typography sx={labelSx}>Total de cliques</Typography>
				<Typography
					sx={{ fontSize: { xs: '2.5rem', md: '2.75rem' }, fontWeight: 900, color: '#818cf8', lineHeight: 1 }}
				>
					{analyticsData.total_clicks.toLocaleString('pt-BR')}
				</Typography>
				<Typography sx={subSx}>desde a criação</Typography>
			</Box>

			{/* Status */}
			<Box sx={cardBase}>
				<Typography sx={labelSx}>Status</Typography>
				<Box
					sx={{
						display: 'inline-flex',
						alignItems: 'center',
						background: analyticsData.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
						border: '1px solid',
						borderColor: analyticsData.is_active ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
						borderRadius: '6px',
						px: 1.25,
						py: 0.5,
						mt: 0.5
					}}
				>
					<Typography
						sx={{
							fontSize: '0.75rem',
							fontWeight: 600,
							color: analyticsData.is_active ? '#34d399' : '#f87171'
						}}
					>
						{analyticsData.is_active ? 'Ativo' : 'Inativo'}
					</Typography>
				</Box>
				<Typography sx={subSx}>link operacional</Typography>
			</Box>

			{/* Criado em */}
			<Box sx={cardBase}>
				<Typography sx={labelSx}>Criado em</Typography>
				<Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
					{dateLabel}
				</Typography>
				{timeLabel ? <Typography sx={subSx}>às {timeLabel}</Typography> : null}
			</Box>

			{/* Analytics */}
			<Box sx={cardBase}>
				<Typography sx={labelSx}>Analytics</Typography>
				<Box
					sx={{
						display: 'inline-flex',
						alignItems: 'center',
						background: analyticsData.has_analytics ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.05)',
						border: '1px solid',
						borderColor: analyticsData.has_analytics ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.08)',
						borderRadius: '6px',
						px: 1.25,
						py: 0.5,
						mt: 0.5
					}}
				>
					<Typography
						sx={{
							fontSize: '0.75rem',
							fontWeight: 600,
							color: analyticsData.has_analytics ? '#a5b4fc' : 'rgba(255,255,255,0.3)'
						}}
					>
						{analyticsData.has_analytics ? 'Disponível' : 'Sem dados'}
					</Typography>
				</Box>
				<Typography sx={subSx}>dados coletados</Typography>
			</Box>
		</Box>
	);
}
