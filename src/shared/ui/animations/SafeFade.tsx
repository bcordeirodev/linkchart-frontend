import { Box, BoxProps } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

interface SafeFadeProps extends Omit<BoxProps, 'children'> {
	children: ReactNode;
	in?: boolean;
	timeout?: number;
	delay?: number;
}

/**
 * Componente de fade seguro que evita erros de scrollTop
 * Substitui o Fade do Material-UI que causa problemas
 */
export function SafeFade({ children, in: inProp = true, timeout = 600, delay = 0, sx, ...boxProps }: SafeFadeProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (inProp) {
			const timer = setTimeout(() => {
				setIsVisible(true);
			}, delay);
			return () => clearTimeout(timer);
		} else {
			setIsVisible(false);
		}
	}, [inProp, delay]);

	return (
		<Box
			{...boxProps}
			sx={{
				opacity: isVisible ? 1 : 0,
				transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
				transition: `all ${timeout}ms cubic-bezier(0.4, 0, 0.2, 1)`,
				...sx
			}}
		>
			{children}
		</Box>
	);
}

export default SafeFade;
