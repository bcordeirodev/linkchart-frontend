import { forwardRef } from 'react';
import Typography from '@mui/material/Typography';
import type { TypographyProps } from '@mui/material/Typography';

/**
 * Componente Typography seguro que evita problemas de hidratação
 * Usa 'div' como componente padrão ao invés de 'p' para evitar aninhamento inválido
 */
const SafeTypography = forwardRef<HTMLDivElement, TypographyProps>((props, ref) => {
	const { component = 'div', ...rest } = props;

	return (
		<Typography
			ref={ref}
			component={component}
			{...rest}
		/>
	);
});

SafeTypography.displayName = 'SafeTypography';

export default SafeTypography;
