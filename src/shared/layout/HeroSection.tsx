import { Box, Typography, Chip, Fade, Slide, Grow } from '@mui/material';
import { Rocket } from '@mui/icons-material';

// Styled Components
import {
	HeroContainer,
	HeroTitle,
	HeroSubtitle,
	HeroChip
} from '../ui/base/styles/UI.styled';

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
		<Fade in timeout={800}>
			<HeroContainer>
				<Slide direction="down" in timeout={1000}>
					<HeroTitle variant="h1">
						{title}
					</HeroTitle>
				</Slide>

				<Slide direction="up" in timeout={1200}>
					<HeroSubtitle variant="h6">
						{subtitle}
					</HeroSubtitle>
				</Slide>

				<Grow in timeout={1500}>
					<HeroChip
						icon={<Rocket />}
						label={chipText}
						color="primary"
						variant="filled"
					/>
				</Grow>
			</HeroContainer>
		</Fade>
	);
}

export default HeroSection;
