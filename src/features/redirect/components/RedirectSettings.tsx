import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SafeTypography from '@/shared/ui/base/SafeTypography';

interface RedirectSettingsProps {
	onSave?: (settings: RedirectSettings) => void;
	initialSettings?: Partial<RedirectSettings>;
}

export interface RedirectSettings {
	enablePreview: boolean;
	previewDelay: number;
	showClickCount: boolean;
	showDestination: boolean;
	requireConfirmation: boolean;
	enableSafetyCheck: boolean;
	customMessage?: string;
	allowDirectRedirect: boolean;
}

const defaultSettings: RedirectSettings = {
	enablePreview: true,
	previewDelay: 3,
	showClickCount: true,
	showDestination: true,
	requireConfirmation: false,
	enableSafetyCheck: true,
	allowDirectRedirect: true
};

/**
 * Componente para configurar opções avançadas de redirecionamento
 */
export default function RedirectSettings({ onSave, initialSettings = {} }: RedirectSettingsProps) {
	const [settings, setSettings] = useState<RedirectSettings>({
		...defaultSettings,
		...initialSettings
	});

	const handleSettingChange = (key: keyof RedirectSettings, value: boolean | number | string) => {
		setSettings((prev) => ({
			...prev,
			[key]: value
		}));
	};

	const handleSave = () => {
		onSave?.(settings);
	};

	const handleReset = () => {
		setSettings({ ...defaultSettings, ...initialSettings });
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="max-w-2xl mx-auto"
		>
			<Card elevation={2}>
				<CardContent>
					<Stack spacing={3}>
						{/* Header */}
						<Box className="flex items-center gap-2">
							<SettingsIcon color="primary" />
							<SafeTypography variant="h6">Configurações de Redirecionamento</SafeTypography>
						</Box>

						<Divider />

						{/* Preview Settings */}
						<Box>
							<Box className="flex items-center gap-2 mb-3">
								<VisibilityIcon
									fontSize="small"
									color="action"
								/>
								<SafeTypography
									variant="subtitle1"
									color="primary"
								>
									Visualização
								</SafeTypography>
							</Box>

							<Stack spacing={2}>
								<FormControlLabel
									control={
										<Switch
											checked={settings.enablePreview}
											onChange={(e) => handleSettingChange('enablePreview', e.target.checked)}
										/>
									}
									label="Mostrar página de preview antes do redirecionamento"
								/>

								{settings.enablePreview && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: 'auto' }}
									>
										<TextField
											label="Delay do redirecionamento (segundos)"
											type="number"
											size="small"
											value={settings.previewDelay}
											onChange={(e) =>
												handleSettingChange('previewDelay', parseInt(e.target.value) || 0)
											}
											inputProps={{ min: 0, max: 30 }}
											helperText="0 = redirecionamento imediato"
										/>
									</motion.div>
								)}

								<FormControlLabel
									control={
										<Switch
											checked={settings.showClickCount}
											onChange={(e) => handleSettingChange('showClickCount', e.target.checked)}
										/>
									}
									label="Mostrar número de cliques no preview"
								/>

								<FormControlLabel
									control={
										<Switch
											checked={settings.showDestination}
											onChange={(e) => handleSettingChange('showDestination', e.target.checked)}
										/>
									}
									label="Mostrar URL de destino no preview"
								/>
							</Stack>
						</Box>

						<Divider />

						{/* Security Settings */}
						<Box>
							<Box className="flex items-center gap-2 mb-3">
								<SecurityIcon
									fontSize="small"
									color="action"
								/>
								<SafeTypography
									variant="subtitle1"
									color="primary"
								>
									Segurança
								</SafeTypography>
							</Box>

							<Stack spacing={2}>
								<FormControlLabel
									control={
										<Switch
											checked={settings.enableSafetyCheck}
											onChange={(e) => handleSettingChange('enableSafetyCheck', e.target.checked)}
										/>
									}
									label="Verificar segurança do link antes do redirecionamento"
								/>

								<FormControlLabel
									control={
										<Switch
											checked={settings.requireConfirmation}
											onChange={(e) =>
												handleSettingChange('requireConfirmation', e.target.checked)
											}
										/>
									}
									label="Sempre exigir confirmação do usuário"
								/>

								<FormControlLabel
									control={
										<Switch
											checked={settings.allowDirectRedirect}
											onChange={(e) =>
												handleSettingChange('allowDirectRedirect', e.target.checked)
											}
										/>
									}
									label="Permitir redirecionamento direto via /api/r/"
								/>
							</Stack>
						</Box>

						<Divider />

						{/* Performance Settings */}
						<Box>
							<Box className="flex items-center gap-2 mb-3">
								<SpeedIcon
									fontSize="small"
									color="action"
								/>
								<SafeTypography
									variant="subtitle1"
									color="primary"
								>
									Personalização
								</SafeTypography>
							</Box>

							<TextField
								label="Mensagem personalizada (opcional)"
								multiline
								rows={2}
								fullWidth
								value={settings.customMessage || ''}
								onChange={(e) => handleSettingChange('customMessage', e.target.value)}
								placeholder="Ex: Você está sendo redirecionado para um site externo..."
								helperText="Esta mensagem será exibida na página de preview"
							/>
						</Box>

						{/* Preview of Current Settings */}
						<Box className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
							<SafeTypography
								variant="subtitle2"
								className="mb-2"
							>
								Configuração atual:
							</SafeTypography>
							<Stack
								direction="row"
								spacing={1}
								flexWrap="wrap"
								gap={1}
							>
								{settings.enablePreview && (
									<Chip
										label={`Preview: ${settings.previewDelay}s`}
										size="small"
										color="primary"
										variant="outlined"
									/>
								)}
								{settings.showClickCount && (
									<Chip
										label="Mostrar cliques"
										size="small"
										variant="outlined"
									/>
								)}
								{settings.enableSafetyCheck && (
									<Chip
										label="Verificação de segurança"
										size="small"
										color="success"
										variant="outlined"
									/>
								)}
								{settings.requireConfirmation && (
									<Chip
										label="Confirmação obrigatória"
										size="small"
										color="warning"
										variant="outlined"
									/>
								)}
								{!settings.allowDirectRedirect && (
									<Chip
										label="Sem redirect direto"
										size="small"
										color="error"
										variant="outlined"
									/>
								)}
							</Stack>
						</Box>
					</Stack>
				</CardContent>

				<CardActions className="justify-end gap-2">
					<Button
						variant="outlined"
						onClick={handleReset}
					>
						Resetar
					</Button>
					<Button
						variant="contained"
						onClick={handleSave}
					>
						Salvar Configurações
					</Button>
				</CardActions>
			</Card>
		</motion.div>
	);
}
