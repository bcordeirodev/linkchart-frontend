/**
 * 🏷️ TAB DESCRIPTION - COMPONENTE BASE
 * Componente para descrições de tabs com ícone e highlight
 */

import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { createGlassCard } from '@/lib/theme';

interface TabDescriptionProps {
	icon: string;
	title: string;
	description: string;
	highlight?: string;
	metadata?: string;
}

/**
 * Componente TabDescription seguindo padrões arquiteturais
 * Usado para descrever o conteúdo de cada tab
 */
function TabDescription({ icon, title, description, highlight, metadata }: TabDescriptionProps) {
	const theme = useTheme();

	return (
		<Box sx={{ ...createGlassCard(theme, 'neutral'), p: 3, mb: 3 }}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
				<Typography
					component="span"
					sx={{ fontSize: '1.5rem' }}
				>
					{icon}
				</Typography>
				<Typography
					variant="h6"
					component="h2"
				>
					{title}
				</Typography>
			</Box>

			<Typography
				variant="body2"
				color="text.secondary"
				sx={{ mb: 1 }}
			>
				{description}
			</Typography>

			{highlight && (
				<Typography
					variant="caption"
					sx={{
						color: 'primary.main',
						fontWeight: 500,
						display: 'block'
					}}
				>
					💡 {highlight}
				</Typography>
			)}

			{metadata && (
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}
				>
					📊 {metadata}
				</Typography>
			)}
		</Box>
	);
}

export default TabDescription;
