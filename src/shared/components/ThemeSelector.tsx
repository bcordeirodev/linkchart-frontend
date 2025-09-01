/**
 * 🎨 THEME SELECTOR COMPONENT - LINK CHART
 * Componente avançado para seleção de múltiplos temas
 *
 * @description
 * Este componente permite aos usuários escolher entre todos os temas
 * disponíveis da aplicação através de uma interface elegante com
 * preview de cores e transições suaves.
 *
 * @features
 * - ✅ Seleção de múltiplos temas
 * - ✅ Preview de cores em tempo real
 * - ✅ Interface dropdown elegante
 * - ✅ Persistência de preferências
 * - ✅ Indicador de tema ativo
 *
 * @example
 * ```tsx
 * import { ThemeSelector } from '@/shared/components/ThemeSelector';
 *
 * function SettingsPanel() {
 *   return (
 *     <Box>
 *       <Typography>Escolha seu tema:</Typography>
 *       <ThemeSelector />
 *     </Box>
 *   );
 * }
 * ```
 *
 * @since 1.0.0
 * @version 2.0.0
 */

import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Box,
	Chip,
	Typography,
	useTheme,
	SelectChangeEvent
} from '@mui/material';
import { Palette, Check } from '@mui/icons-material';
import { useMainTheme, useFuseSettings, themesConfig } from '@/lib/theme';
import { availableThemeIds, getThemeOption, isDarkTheme } from '@/lib/themeOptions';
import { useCallback } from 'react';

/**
 * Props do componente ThemeSelector
 * @interface ThemeSelectorProps
 */
export interface ThemeSelectorProps {
	/** Variante do componente */
	variant?: 'outlined' | 'filled' | 'standard';
	/** Tamanho do componente */
	size?: 'small' | 'medium';
	/** Largura do componente */
	fullWidth?: boolean;
	/** Classe CSS adicional */
	className?: string;
	/** Callback executado após mudança de tema */
	onThemeChange?: (themeId: string) => void;
}

/**
 * Informações de cada tema para exibição
 */
const themeInfo = {
	Default: {
		label: 'Padrão Claro',
		description: 'Tema claro com cores da marca',
		primaryColor: '#0A74DA',
		isDark: false
	},
	'Default Dark': {
		label: 'Padrão Escuro',
		description: 'Tema escuro com cores da marca',
		primaryColor: '#0A74DA',
		isDark: true
	},
	'Sky Blue': {
		label: 'Azul Céu Claro',
		description: 'Tema claro com tons de azul céu',
		primaryColor: '#0EA5E9',
		isDark: false
	},
	'Sky Blue Dark': {
		label: 'Azul Céu Escuro',
		description: 'Tema escuro com tons de azul céu',
		primaryColor: '#0EA5E9',
		isDark: true
	}
} as const;

/**
 * Componente para seleção de temas múltiplos
 * @param {ThemeSelectorProps} props - Props do componente
 * @returns {JSX.Element} Seletor de temas
 */
export function ThemeSelector({
	variant = 'outlined',
	size = 'medium',
	fullWidth = true,
	className,
	onThemeChange
}: ThemeSelectorProps) {
	const theme = useTheme();
	const mainTheme = useMainTheme();
	const { settings, setSettings } = useFuseSettings();

	// Tema atual selecionado
	const currentTheme = settings?.theme?.main || 'Default';

	/**
	 * Manipula a mudança de tema
	 */
	const handleThemeChange = useCallback(
		(event: SelectChangeEvent<string>) => {
			const newThemeId = event.target.value;
			const themeOption = getThemeOption(newThemeId);

			if (themeOption && setSettings) {
				// Atualizar todas as seções com o tema selecionado
				setSettings({
					...settings,
					theme: themeOption.section
				});

				// Salvar preferência no localStorage
				localStorage.setItem('linkChart_theme', newThemeId);
				localStorage.setItem('linkChart_theme_mode', isDarkTheme(newThemeId) ? 'dark' : 'light');

				// Callback opcional
				onThemeChange?.(newThemeId);
			}
		},
		[settings, setSettings, onThemeChange]
	);

	/**
	 * Renderiza um item do menu de seleção
	 */
	const renderMenuItem = (themeId: string) => {
		const info = themeInfo[themeId as keyof typeof themeInfo];
		if (!info) return null;

		const isSelected = currentTheme === themeId;

		return (
			<MenuItem
				key={themeId}
				value={themeId}
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 2,
					py: 1.5,
					'&.Mui-selected': {
						backgroundColor: `${theme.palette.primary.main}15`
					}
				}}
			>
				{/* Preview da cor */}
				<Box
					sx={{
						width: 24,
						height: 24,
						borderRadius: '50%',
						backgroundColor: info.primaryColor,
						border: `2px solid ${theme.palette.divider}`,
						flexShrink: 0,
						position: 'relative'
					}}
				>
					{isSelected && (
						<Check
							sx={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								color: 'white',
								fontSize: '0.8rem'
							}}
						/>
					)}
				</Box>

				{/* Informações do tema */}
				<Box sx={{ flex: 1, minWidth: 0 }}>
					<Typography
						variant="body2"
						sx={{
							fontWeight: isSelected ? 600 : 400,
							color: theme.palette.text.primary
						}}
					>
						{info.label}
					</Typography>
					<Typography
						variant="caption"
						sx={{
							color: theme.palette.text.secondary,
							display: 'block'
						}}
					>
						{info.description}
					</Typography>
				</Box>

				{/* Badge de modo escuro */}
				{info.isDark && (
					<Chip
						label="Escuro"
						size="small"
						variant="outlined"
						sx={{
							fontSize: '0.7rem',
							height: 20,
							'& .MuiChip-label': {
								px: 1
							}
						}}
					/>
				)}
			</MenuItem>
		);
	};

	return (
		<FormControl
			variant={variant}
			size={size}
			fullWidth={fullWidth}
			className={className}
		>
			<InputLabel
				id="theme-selector-label"
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 1
				}}
			>
				<Palette sx={{ fontSize: '1rem' }} />
				Tema da Aplicação
			</InputLabel>
			<Select
				labelId="theme-selector-label"
				value={currentTheme}
				onChange={handleThemeChange}
				label="Tema da Aplicação"
				MenuProps={{
					PaperProps: {
						sx: {
							maxHeight: 300,
							'& .MuiMenuItem-root': {
								borderRadius: 1,
								mx: 1,
								my: 0.5
							}
						}
					}
				}}
				sx={{
					'& .MuiSelect-select': {
						display: 'flex',
						alignItems: 'center',
						gap: 2
					}
				}}
			>
				{availableThemeIds.map(renderMenuItem)}
			</Select>
		</FormControl>
	);
}

export default ThemeSelector;
