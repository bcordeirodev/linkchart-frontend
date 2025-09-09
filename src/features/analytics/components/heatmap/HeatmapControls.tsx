import { Box, IconButton, Tooltip, Slider, FormControlLabel, Switch, Stack, Typography } from '@mui/material';
import { Refresh, Fullscreen } from '@mui/icons-material';

interface HeatmapControlsProps {
	minClicks: number;
	onMinClicksChange: (value: number) => void;
	autoRefresh: boolean;
	onAutoRefreshChange: (enabled: boolean) => void;
	onRefresh: () => void;
	onFullscreen?: () => void;
	loading?: boolean;
	totalPoints: number;
	maxClicks: number;
}

/**
 * 🎛️ HEATMAP CONTROLS - CONTROLES DO MAPA
 *
 * @description
 * Componente responsável pelos controles interativos do mapa de calor:
 * - Filtro de cliques mínimos
 * - Toggle de auto-refresh
 * - Botões de ação (refresh, fullscreen)
 * - Informações de status
 *
 * @responsibilities
 * - Renderizar controles de filtro
 * - Gerenciar interações do usuário
 * - Mostrar estatísticas básicas
 */
export function HeatmapControls({
	minClicks,
	onMinClicksChange,
	autoRefresh,
	onAutoRefreshChange,
	onRefresh,
	onFullscreen,
	loading = false,
	totalPoints,
	maxClicks
}: HeatmapControlsProps) {
	return (
		<Box
			sx={{
				p: 2,
				bgcolor: 'background.paper',
				borderRadius: 1,
				mb: 2,
				border: 1,
				borderColor: 'divider'
			}}
		>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={2}
				alignItems="center"
			>
				{/* Filtro de cliques mínimos */}
				<Box sx={{ minWidth: 200 }}>
					<Typography
						variant="caption"
						gutterBottom
					>
						Cliques Mínimos: {minClicks}
					</Typography>
					<Slider
						value={minClicks}
						onChange={(_, value) => onMinClicksChange(value as number)}
						min={1}
						max={Math.max(10, maxClicks)}
						step={1}
						size="small"
						valueLabelDisplay="auto"
					/>
				</Box>

				{/* Toggle auto-refresh */}
				<FormControlLabel
					control={
						<Switch
							checked={autoRefresh}
							onChange={(e) => onAutoRefreshChange(e.target.checked)}
							size="small"
						/>
					}
					label="Auto-refresh"
				/>

				{/* Estatísticas */}
				<Box sx={{ flexGrow: 1, textAlign: 'center' }}>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						{totalPoints} localizações • Máx: {maxClicks} cliques
					</Typography>
				</Box>

				{/* Botões de ação */}
				<Stack
					direction="row"
					spacing={1}
				>
					<Tooltip title="Atualizar dados">
						<IconButton
							onClick={onRefresh}
							disabled={loading}
							size="small"
						>
							{loading ? <Refresh sx={{ animation: 'spin 1s linear infinite' }} /> : <Refresh />}
						</IconButton>
					</Tooltip>

					{onFullscreen && (
						<Tooltip title="Tela cheia">
							<IconButton
								onClick={onFullscreen}
								size="small"
							>
								<Fullscreen />
							</IconButton>
						</Tooltip>
					)}
				</Stack>
			</Stack>
		</Box>
	);
}

export default HeatmapControls;
