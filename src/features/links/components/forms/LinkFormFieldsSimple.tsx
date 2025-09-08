/**
 * 📝 LINK FORM FIELDS - OTIMIZADO PARA TEMA
 * Campos de formulário que usam 100% do tema MUI
 */

import {
	Typography,
	Switch,
	FormControlLabel,
	InputAdornment,
	Collapse,
	Grid,
	FormControl,
	InputLabel,
	FilledInput,
	FormHelperText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import { LinkFormData } from './LinkFormSchema';
import { AppIcon } from '@/lib/icons';
import {
	AdvancedSectionContainer,
	CollapsibleSectionContent,
	SectionDescription,
	ToggleButtonContainer
} from '../styles/FormSections.styled';

interface LinkFormFieldsSimpleProps {
	formData: LinkFormData;
	errors: Record<string, string>;
	onChange: (field: keyof LinkFormData, value: any) => void;
	showAdvanced: boolean;
	onToggleAdvanced: (show: boolean) => void;
	showUTM: boolean;
	onToggleUTM: (show: boolean) => void;
	onUrlChange?: (url: string) => void;
	isEdit?: boolean;
}

/**
 * Campos do formulário otimizados para usar tema MUI
 * Remove sx props desnecessários e usa styled components
 */
export function LinkFormFieldsSimple({
	formData,
	errors,
	onChange,
	showAdvanced,
	onToggleAdvanced,
	showUTM,
	onToggleUTM,
	onUrlChange,
	isEdit = false
}: LinkFormFieldsSimpleProps) {
	const theme = useTheme();

	const handleInputChange = (field: keyof LinkFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		onChange(field, value);

		if (field === 'original_url' && onUrlChange) {
			onUrlChange(value);
		}
	};

	const handleNumberChange = (field: keyof LinkFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		onChange(field, value ? Number(value) : undefined);
	};

	const handleDateChange = (field: keyof LinkFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		onChange(field, value ? new Date(value) : null);
	};

	return (
		<Grid container spacing={3}>
			{/* URL Original */}
			<Grid item xs={12}>
				<FormControl variant="filled" fullWidth error={!!errors.original_url} required>
					<InputLabel htmlFor="original_url">URL Original</InputLabel>
					<FilledInput
						id="original_url"
						value={formData.original_url || ''}
						onChange={handleInputChange('original_url')}
						placeholder="https://exemplo.com/pagina-muito-longa"
					/>
					<FormHelperText>{errors.original_url || 'URL que será encurtada'}</FormHelperText>
				</FormControl>
			</Grid>

			{/* Título */}
			<Grid item xs={12} md={8}>
				<FormControl variant="filled" fullWidth error={!!errors.title}>
					<InputLabel htmlFor="title">Título do Link</InputLabel>
					<FilledInput
						id="title"
						value={formData.title || ''}
						onChange={handleInputChange('title')}
						placeholder="Título descritivo para o link"
					/>
					<FormHelperText>
						{errors.title || 'Opcional - será gerado automaticamente se vazio'}
					</FormHelperText>
				</FormControl>
			</Grid>

			{/* Slug */}
			<Grid item xs={12} md={4}>
				<FormControl variant="filled" fullWidth error={!!errors.slug}>
					<InputLabel htmlFor="slug">Slug Personalizado</InputLabel>
					<FilledInput
						id="slug"
						value={formData.slug || ''}
						onChange={handleInputChange('slug')}
						placeholder="meu-link-especial"
					/>
					<FormHelperText>{errors.slug || 'Opcional - será gerado automaticamente'}</FormHelperText>
				</FormControl>
			</Grid>

			{/* Descrição */}
			<Grid item xs={12}>
				<FormControl variant="filled" fullWidth error={!!errors.description}>
					<InputLabel htmlFor="description">Descrição</InputLabel>
					<FilledInput
						id="description"
						value={formData.description || ''}
						onChange={handleInputChange('description')}
						placeholder="Descrição opcional do link"
						multiline
						rows={3}
					/>
					<FormHelperText>{errors.description || 'Descrição opcional'}</FormHelperText>
				</FormControl>
			</Grid>

			{/* Switch Ativo */}
			<Grid item xs={12}>
				<FormControlLabel
					control={
						<Switch
							checked={formData.is_active || false}
							onChange={(e) => onChange('is_active', e.target.checked)}
							color="primary"
						/>
					}
					label="Link ativo"
				/>
			</Grid>

			{/* Configurações Avançadas */}
			<Grid item xs={12}>
				<AdvancedSectionContainer>
					<ToggleButtonContainer className={showAdvanced ? 'expanded' : ''}>
						<Button
							variant="text"
							size="large"
							startIcon={<AppIcon intent={showAdvanced ? 'collapse' : 'expand'} />}
							onClick={() => onToggleAdvanced(!showAdvanced)}
							sx={{
								width: '100%',
								justifyContent: 'flex-start',
								textAlign: 'left',
								fontWeight: 600,
								fontSize: '1rem',
								py: 1,
								textTransform: 'none',
								color: theme.palette.text.primary,
								'&:hover': {
									backgroundColor: theme.palette.action.hover
								}
							}}
						>
							⚙️ Configurações Avançadas
						</Button>
					</ToggleButtonContainer>

					<Collapse in={showAdvanced}>
						<CollapsibleSectionContent>
							<SectionDescription>
								Configure datas de ativação e limites para seu link
							</SectionDescription>

							<Grid container spacing={2}>
								{/* Data de Início */}
								<Grid item xs={12} md={6}>
									<FormControl variant="filled" fullWidth error={!!errors.starts_in}>
										<InputLabel htmlFor="starts_in" shrink>
											Data de Início
										</InputLabel>
										<FilledInput
											id="starts_in"
											type="datetime-local"
											value={
												formData.starts_in
													? new Date(formData.starts_in).toISOString().slice(0, 16)
													: ''
											}
											onChange={handleDateChange('starts_in')}
											startAdornment={
												<InputAdornment position="start">
													<AppIcon intent="schedule" size={18} />
												</InputAdornment>
											}
										/>
										<FormHelperText>{errors.starts_in || 'Quando o link ficará ativo'}</FormHelperText>
									</FormControl>
								</Grid>

								{/* Data de Expiração */}
								<Grid item xs={12} md={6}>
									<FormControl variant="filled" fullWidth error={!!errors.expires_at}>
										<InputLabel htmlFor="expires_at" shrink>
											Data de Expiração
										</InputLabel>
										<FilledInput
											id="expires_at"
											type="datetime-local"
											value={
												formData.expires_at
													? new Date(formData.expires_at).toISOString().slice(0, 16)
													: ''
											}
											onChange={handleDateChange('expires_at')}
											startAdornment={
												<InputAdornment position="start">
													<AppIcon intent="schedule" size={18} />
												</InputAdornment>
											}
										/>
										<FormHelperText>{errors.expires_at || 'Quando o link expirará'}</FormHelperText>
									</FormControl>
								</Grid>

								{/* Limite de Cliques */}
								<Grid item xs={12} md={6}>
									<FormControl variant="filled" fullWidth error={!!errors.click_limit}>
										<InputLabel htmlFor="click_limit">Limite de Cliques</InputLabel>
										<FilledInput
											id="click_limit"
											type="number"
											value={formData.click_limit || ''}
											onChange={handleNumberChange('click_limit')}
											placeholder="1000"
										/>
										<FormHelperText>
											{errors.click_limit || 'Opcional - máximo de cliques permitidos'}
										</FormHelperText>
									</FormControl>
								</Grid>
							</Grid>
						</CollapsibleSectionContent>
					</Collapse>
				</AdvancedSectionContainer>
			</Grid>

			{/* Parâmetros UTM */}
			<Grid item xs={12}>
				<AdvancedSectionContainer>
					<ToggleButtonContainer className={showUTM ? 'expanded' : ''}>
						<Button
							variant="text"
							size="large"
							startIcon={<AppIcon intent={showUTM ? 'collapse' : 'expand'} />}
							onClick={() => onToggleUTM(!showUTM)}
							sx={{
								width: '100%',
								justifyContent: 'flex-start',
								textAlign: 'left',
								fontWeight: 600,
								fontSize: '1rem',
								py: 1,
								textTransform: 'none',
								color: theme.palette.text.primary,
								'&:hover': {
									backgroundColor: theme.palette.action.hover
								}
							}}
						>
							📊 Parâmetros UTM para Tracking
						</Button>
					</ToggleButtonContainer>

					<Collapse in={showUTM}>
						<CollapsibleSectionContent>
							<SectionDescription>
								Configure parâmetros UTM para rastrear a origem dos cliques no Google Analytics
							</SectionDescription>

							<Grid container spacing={2}>
								{/* UTM Source */}
								<Grid item xs={12} md={6}>
									<FormControl variant="filled" fullWidth>
										<InputLabel htmlFor="utm_source">UTM Source</InputLabel>
										<FilledInput
											id="utm_source"
											value={formData.utm_source || ''}
											onChange={handleInputChange('utm_source')}
											placeholder="google, facebook, newsletter"
										/>
									</FormControl>
								</Grid>

								{/* UTM Medium */}
								<Grid item xs={12} md={6}>
									<FormControl variant="filled" fullWidth>
										<InputLabel htmlFor="utm_medium">UTM Medium</InputLabel>
										<FilledInput
											id="utm_medium"
											value={formData.utm_medium || ''}
											onChange={handleInputChange('utm_medium')}
											placeholder="email, social, cpc"
										/>
									</FormControl>
								</Grid>

								{/* UTM Campaign */}
								<Grid item xs={12} md={6}>
									<FormControl variant="filled" fullWidth>
										<InputLabel htmlFor="utm_campaign">UTM Campaign</InputLabel>
										<FilledInput
											id="utm_campaign"
											value={formData.utm_campaign || ''}
											onChange={handleInputChange('utm_campaign')}
											placeholder="summer_sale, product_launch"
										/>
									</FormControl>
								</Grid>

								{/* UTM Term */}
								<Grid item xs={12} md={6}>
									<FormControl variant="filled" fullWidth>
										<InputLabel htmlFor="utm_term">UTM Term</InputLabel>
										<FilledInput
											id="utm_term"
											value={formData.utm_term || ''}
											onChange={handleInputChange('utm_term')}
											placeholder="keyword, termo_busca"
										/>
									</FormControl>
								</Grid>

								{/* UTM Content */}
								<Grid item xs={12}>
									<FormControl variant="filled" fullWidth>
										<InputLabel htmlFor="utm_content">UTM Content</InputLabel>
										<FilledInput
											id="utm_content"
											value={formData.utm_content || ''}
											onChange={handleInputChange('utm_content')}
											placeholder="banner_top, link_rodape"
										/>
									</FormControl>
								</Grid>
							</Grid>
						</CollapsibleSectionContent>
					</Collapse>
				</AdvancedSectionContainer>
			</Grid>
		</Grid>
	);
}

export default LinkFormFieldsSimple;
