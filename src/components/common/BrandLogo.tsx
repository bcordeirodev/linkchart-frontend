'use client';

import { Avatar, Typography, Box } from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';
import { float } from '@/utils/animations';

interface BrandLogoProps {
	size?: 'small' | 'medium' | 'large';
	showText?: boolean;
	onClick?: () => void;
}

const sizes = {
	small: { avatar: 32, fontSize: '1.2rem' },
	medium: { avatar: 48, fontSize: '1.5rem' },
	large: { avatar: 64, fontSize: '2rem' }
};

/**
 * Componente de logo da marca reutilizável
 * Usado em headers, footers e outras partes da aplicação
 */
export function BrandLogo({ size = 'medium', showText = true, onClick }: BrandLogoProps) {
	const { avatar, fontSize } = sizes[size];

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 2,
				cursor: onClick ? 'pointer' : 'default'
			}}
			onClick={onClick}
		>
			<Avatar
				sx={{
					width: avatar,
					height: avatar,
					background: 'linear-gradient(135deg, #0A74DA 0%, #00A4EF 100%)',
					animation: `${float} 3s ease-in-out infinite`
				}}
			>
				<LinkIcon sx={{ fontSize: avatar * 0.6 }} />
			</Avatar>
			{showText && (
				<Typography
					variant="h5"
					sx={{
						fontWeight: 700,
						fontSize,
						background: 'linear-gradient(135deg, #0A74DA 0%, #00A4EF 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent'
					}}
				>
					LinkChart
				</Typography>
			)}
		</Box>
	);
}

export default BrandLogo;
