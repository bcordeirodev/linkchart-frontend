'use client';

import {
	TextField,
	Box,
	Typography,
	Switch,
	FormControlLabel,
	InputAdornment,
	Collapse,
	Button,
	Grid
} from '@mui/material';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Link as LinkIcon, Schedule, Public, Analytics, ExpandMore, ExpandLess } from '@mui/icons-material';
import { LinkFormData } from './LinkFormSchema';

interface LinkFormFieldsProps {
	control: Control<LinkFormData>;
	errors: FieldErrors<LinkFormData>;
	showAdvanced: boolean;
	onToggleAdvanced: (show: boolean) => void;
	showUTM: boolean;
	onToggleUTM: (show: boolean) => void;
	onUrlChange?: (url: string) => void;
	isEdit?: boolean;
}

/**
 * Campos do formulário de link reutilizáveis
 * Usado tanto na criação quanto na edição
 */
export function LinkFormFields({
	control,
	errors,
	showAdvanced,
	onToggleAdvanced,
	showUTM,
	onToggleUTM,
	onUrlChange,
	isEdit = false
}: LinkFormFieldsProps) {
	return (
		<Box>
			{/* Campos Básicos */}
			<Grid
				container
				spacing={3}
			>
				<Grid
					item
					xs={12}
				>
					<Controller
						name="original_url"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="URL Original"
								placeholder="https://exemplo.com/pagina-muito-longa"
								fullWidth
								required
								error={!!errors.original_url}
								helperText={errors.original_url?.message}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Public color="primary" />
										</InputAdornment>
									)
								}}
								onChange={(e) => {
									field.onChange(e);
									onUrlChange?.(e.target.value);
								}}
							/>
						)}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					md={8}
				>
					<Controller
						name="title"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Título do Link"
								placeholder="Título descritivo para o link"
								fullWidth
								error={!!errors.title}
								helperText={errors.title?.message || 'Opcional - será gerado automaticamente se vazio'}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<LinkIcon color="primary" />
										</InputAdornment>
									)
								}}
							/>
						)}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					md={4}
				>
					<Controller
						name="slug"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Slug Personalizado"
								placeholder="meu-link-especial"
								fullWidth
								error={!!errors.slug}
								helperText={errors.slug?.message || 'Opcional - será gerado automaticamente'}
							/>
						)}
					/>
				</Grid>

				<Grid
					item
					xs={12}
				>
					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Descrição"
								placeholder="Descrição opcional do link"
								fullWidth
								multiline
								rows={2}
								error={!!errors.description}
								helperText={errors.description?.message}
							/>
						)}
					/>
				</Grid>

				<Grid
					item
					xs={12}
				>
					<Controller
						name="is_active"
						control={control}
						render={({ field }) => (
							<FormControlLabel
								control={
									<Switch
										checked={field.value}
										onChange={field.onChange}
										color="primary"
									/>
								}
								label="Link ativo"
							/>
						)}
					/>
				</Grid>
			</Grid>

			{/* Configurações Avançadas */}
			<Box sx={{ mt: 3 }}>
				<Button
					onClick={() => onToggleAdvanced(!showAdvanced)}
					startIcon={showAdvanced ? <ExpandLess /> : <ExpandMore />}
					sx={{ mb: 2 }}
				>
					Configurações Avançadas
				</Button>

				<Collapse in={showAdvanced}>
					<Grid
						container
						spacing={3}
					>
						<Grid
							item
							xs={12}
							md={6}
						>
							<Controller
								name="starts_in"
								control={control}
								render={({ field }) => (
									<DateTimePicker
										label="Data de Início"
										value={field.value}
										onChange={field.onChange}
										slotProps={{
											textField: {
												fullWidth: true,
												error: !!errors.starts_in,
												helperText:
													errors.starts_in?.message ||
													'Opcional - quando o link ficará ativo',
												InputProps: {
													startAdornment: (
														<InputAdornment position="start">
															<Schedule color="primary" />
														</InputAdornment>
													)
												}
											}
										}}
									/>
								)}
							/>
						</Grid>

						<Grid
							item
							xs={12}
							md={6}
						>
							<Controller
								name="expires_at"
								control={control}
								render={({ field }) => (
									<DateTimePicker
										label="Data de Expiração"
										value={field.value}
										onChange={field.onChange}
										slotProps={{
											textField: {
												fullWidth: true,
												error: !!errors.expires_at,
												helperText:
													errors.expires_at?.message || 'Opcional - quando o link expirará',
												InputProps: {
													startAdornment: (
														<InputAdornment position="start">
															<Schedule color="primary" />
														</InputAdornment>
													)
												}
											}
										}}
									/>
								)}
							/>
						</Grid>

						<Grid
							item
							xs={12}
							md={6}
						>
							<Controller
								name="click_limit"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Limite de Cliques"
										type="number"
										placeholder="1000"
										fullWidth
										error={!!errors.click_limit}
										helperText={
											errors.click_limit?.message || 'Opcional - máximo de cliques permitidos'
										}
										onChange={(e) =>
											field.onChange(e.target.value ? Number(e.target.value) : undefined)
										}
									/>
								)}
							/>
						</Grid>
					</Grid>
				</Collapse>
			</Box>

			{/* Parâmetros UTM */}
			<Box sx={{ mt: 3 }}>
				<Button
					onClick={() => onToggleUTM(!showUTM)}
					startIcon={<Analytics />}
					sx={{ mb: 2 }}
				>
					Parâmetros UTM para Tracking
				</Button>

				<Collapse in={showUTM}>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mb: 2 }}
					>
						Configure parâmetros UTM para rastrear a origem dos cliques no Google Analytics
					</Typography>

					<Grid
						container
						spacing={2}
					>
						<Grid
							item
							xs={12}
							md={6}
						>
							<Controller
								name="utm_source"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="UTM Source"
										placeholder="google, facebook, newsletter"
										fullWidth
										size="small"
									/>
								)}
							/>
						</Grid>

						<Grid
							item
							xs={12}
							md={6}
						>
							<Controller
								name="utm_medium"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="UTM Medium"
										placeholder="email, social, cpc"
										fullWidth
										size="small"
									/>
								)}
							/>
						</Grid>

						<Grid
							item
							xs={12}
							md={6}
						>
							<Controller
								name="utm_campaign"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="UTM Campaign"
										placeholder="summer_sale, product_launch"
										fullWidth
										size="small"
									/>
								)}
							/>
						</Grid>

						<Grid
							item
							xs={12}
							md={6}
						>
							<Controller
								name="utm_term"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="UTM Term"
										placeholder="keyword, termo_busca"
										fullWidth
										size="small"
									/>
								)}
							/>
						</Grid>

						<Grid
							item
							xs={12}
						>
							<Controller
								name="utm_content"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="UTM Content"
										placeholder="banner_top, link_rodape"
										fullWidth
										size="small"
									/>
								)}
							/>
						</Grid>
					</Grid>
				</Collapse>
			</Box>
		</Box>
	);
}

export default LinkFormFields;
