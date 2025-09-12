/**
 * 🔒 SAFE TYPOGRAPHY - COMPONENTE BASE
 * Typography com sanitização e segurança
 */

import { Typography, TypographyProps } from '@mui/material';

interface SafeTypographyProps extends TypographyProps {
	sanitize?: boolean;
	maxLength?: number;
}

/**
 * Componente SafeTypography seguindo padrões arquiteturais
 * Typography com tratamento seguro de conteúdo
 */
function SafeTypography({ children, sanitize = false, maxLength, ...other }: SafeTypographyProps) {
	let content = children;

	// Truncar se necessário
	if (maxLength && typeof content === 'string' && content.length > maxLength) {
		content = `${content.substring(0, maxLength)}...`;
	}

	// Sanitização básica se necessário
	if (sanitize && typeof content === 'string') {
		content = content.replace(/<[^>]*>/g, ''); // Remove tags HTML
	}

	return <Typography {...other}>{content}</Typography>;
}

export default SafeTypography;
