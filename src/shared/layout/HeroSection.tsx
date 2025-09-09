import { Fade, Slide, Grow, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Rocket } from '@mui/icons-material';

// Styled Components
import { HeroContainer, HeroTitle, HeroSubtitle, HeroChip } from '../ui/base/styles/UI.styled';

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
	const [heroMounted, setHeroMounted] = useState(false);

	useEffect(() => {
		// Garante que o hero está montado antes de iniciar a animação
		const timer = setTimeout(() => setHeroMounted(true), 100);
		return () => clearTimeout(timer);
	}, []);

	return (
		<Box>
			<Fade
				in={heroMounted}
				timeout={800}
				mountOnEnter
				unmountOnExit
			>
				<Box>
					<HeroContainer>
						<Slide
							direction="down"
							in
							timeout={1000}
						>
							<HeroTitle variant="h1">{title}</HeroTitle>
						</Slide>

						<Slide
							direction="up"
							in
							timeout={1200}
						>
							<HeroSubtitle variant="h6">{subtitle}</HeroSubtitle>
						</Slide>

						<Grow
							in
							timeout={1500}
						>
							<HeroChip
								icon={<Rocket />}
								label={chipText}
								color="primary"
								variant="filled"
							/>
						</Grow>
					</HeroContainer>
				</Box>
			</Fade>
		</Box>
	);
}

export default HeroSection;
