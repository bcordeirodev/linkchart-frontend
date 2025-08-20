'use client';

import { Box, Typography, Chip, Fade, Slide, Grow } from '@mui/material';
import { Rocket } from '@mui/icons-material';
import { pulse } from '@/utils/animations';

interface HeroSectionProps {
	title?: string;
	subtitle?: string;
	chipText?: string;
}

/**
 * Seção hero reutilizável para landing pages
 * Inclui título, subtítulo e chip promocional com animações
 */
export function HeroSection({
	title = 'Encurte. Rastreie. Domine.',
	subtitle = 'Plataforma avançada para encurtamento de URLs com analytics em tempo real e QR codes automáticos.',
	chipText = '✨ Novo: Limite de cliques personalizável!'
}: HeroSectionProps) {
	return (
		<Fade
			in
			timeout={800}
		>
			<Box sx={{ textAlign: 'center', mb: 4 }}>
				<Slide
					direction="down"
					in
					timeout={1000}
				>
					<Typography
						variant="h1"
						sx={{
							fontSize: { xs: '2rem', md: '3rem' },
							fontWeight: 800,
							mb: 2,
							background: 'linear-gradient(135deg, #0A74DA 0%, #00A4EF 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							lineHeight: 1.1
						}}
					>
						{title}
					</Typography>
				</Slide>

				<Slide
					direction="up"
					in
					timeout={1200}
				>
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{
							mb: 3,
							maxWidth: 500,
							mx: 'auto',
							fontWeight: 400
						}}
					>
						{subtitle}
					</Typography>
				</Slide>

				<Grow
					in
					timeout={4500}
				>
					<Chip
						icon={<Rocket />}
						label={chipText}
						color="primary"
						variant="filled"
						sx={{
							fontWeight: 600,
							animation: `${pulse} 2s infinite`
						}}
					/>
				</Grow>
			</Box>
		</Fade>
	);
}

export default HeroSection;
