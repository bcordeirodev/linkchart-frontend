import { forwardRef } from 'react';
import ListItemText from '@mui/material/ListItemText';
import type { ListItemTextProps } from '@mui/material/ListItemText';

/**
 * Componente que resolve problemas de hidratação com ListItemText
 * Força o uso de elementos div ao invés de p para evitar aninhamento inválido
 */
const SafeListItemText = forwardRef<HTMLDivElement, ListItemTextProps>((props, ref) => {
	return (
		<ListItemText
			ref={ref}
			{...props}
			primaryTypographyProps={{
				component: 'div',
				...props.primaryTypographyProps
			}}
			secondaryTypographyProps={{
				component: 'div',
				...props.secondaryTypographyProps
			}}
		/>
	);
});

SafeListItemText.displayName = 'SafeListItemText';

export default SafeListItemText;
