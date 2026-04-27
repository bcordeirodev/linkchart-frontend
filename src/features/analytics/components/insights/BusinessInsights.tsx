import {
	TrendingUp,
	Devices,
	PriorityHigh,
	Info,
	CheckCircle,
	Schedule,
	Assessment,
	LocationOn,
	Business
} from '@mui/icons-material';
import { Box, Typography, Card, CardContent, Chip, Alert, Stack, Divider, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { elevationLightTokens, elevationTokens, motionTokens, radiusTokens } from '@/lib/theme/designSystem';

interface BusinessInsight {
	type: string;
	title: string;
	description: string;
	priority: 'high' | 'medium' | 'low';
}

interface BusinessInsightsProps {
	insights: BusinessInsight[];
	showTitle?: boolean;
	maxItems?: number;
	priorityFilter?: ('high' | 'medium' | 'low')[];
	categoryFilter?: string[];
}

/**
 * Componente para exibir insights de negócio baseados nos dados reais da API
 * Mostra análises automáticas dos padrões encontrados nos dados
 * Melhorado com stack vertical e cores de prioridade
 */
export function BusinessInsights({
	insights,
	showTitle = true,
	maxItems = 20,
	priorityFilter: _priorityFilter,
	categoryFilter: _categoryFilter
}: BusinessInsightsProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	if (!insights || insights.length === 0) {
		return (
			<Alert
				severity='info'
				sx={{
					m: 2,
					borderRadius: `${radiusTokens.lg}px`,
					'& .MuiAlert-icon': {
						fontSize: '1.5rem'
					}
				}}
			>
				<Typography
					variant='h6'
					gutterBottom
					sx={{ fontWeight: 600 }}
				>
					📊 Insights não disponíveis
				</Typography>
				<Typography
					variant='body2'
					sx={{ color: 'text.secondary' }}
				>
					Não há insights suficientes para exibir. Mais dados são necessários para gerar análises.
				</Typography>
			</Alert>
		);
	}

	const getInsightIcon = (type: string) => {
		const iconMap = {
			geographic: <LocationOn />,
			audience: <Devices />,
			temporal: <TrendingUp />,
			performance: <Assessment />,
			business: <Business />,
			schedule: <Schedule />
		};
		return iconMap[type as keyof typeof iconMap] || <Info />;
	};

	const getPriorityPalette = (priority: string) => {
		const palette = {
			high: theme.palette.error,
			medium: theme.palette.warning,
			low: theme.palette.success
		};
		return palette[priority as keyof typeof palette] || palette.low;
	};

	const getPriorityIcon = (priority: string) => {
		const iconMap = {
			high: <PriorityHigh />,
			medium: <Info />,
			low: <CheckCircle />
		};
		return iconMap[priority as keyof typeof iconMap] || <Info />;
	};

	// Organizar insights por prioridade e categoria
	const organizedInsights = [...insights]
		.sort((a, b) => {
			// Primeiro por prioridade
			const priorityOrder = { high: 3, medium: 2, low: 1 };
			const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];

			if (priorityDiff !== 0) {
				return priorityDiff;
			}

			// Depois por categoria
			const categoryOrder = {
				security: 10,
				performance: 9,
				geographic: 8,
				engagement: 7,
				growth: 6,
				optimization: 5,
				audience: 4,
				temporal: 3,
				conversion: 2,
				business: 1
			};
			return (
				(categoryOrder[b.type as keyof typeof categoryOrder] || 0) -
				(categoryOrder[a.type as keyof typeof categoryOrder] || 0)
			);
		})
		.slice(0, maxItems);

	return (
		<Box sx={{ mt: 2 }}>
			{showTitle ? (
				<Typography
					variant='h6'
					gutterBottom
					sx={{
						mb: 3,
						fontWeight: 600,
						color: 'text.primary'
					}}
				>
					💡 Insights de Negócio
				</Typography>
			) : null}

			{/* Insights organizados por categoria */}
			<Stack spacing={3}>
				{organizedInsights.map((insight, index) => {
					const palette = getPriorityPalette(insight.priority);
					const prevInsight = organizedInsights[index - 1];
					const showCategoryDivider = index > 0 && prevInsight && prevInsight.type !== insight.type;

					return (
						<Box key={index}>
							{/* Divisor de categoria */}
							{showCategoryDivider ? (
								<Box sx={{ mb: 2, mt: 1 }}>
									<Divider
										sx={{
											borderColor: 'divider',
											'&::before, &::after': {
												borderColor: 'divider'
											}
										}}
									>
										<Typography
											variant='caption'
											sx={{
												px: 2,
												color: 'text.secondary',
												fontWeight: 600,
												textTransform: 'uppercase',
												letterSpacing: 1
											}}
										>
											{insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
										</Typography>
									</Divider>
								</Box>
							) : null}

							<Card
								sx={{
									borderRadius: `${radiusTokens.lg}px`,
									backgroundColor: 'background.paper',
									boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
									transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
									'&:hover': {
										boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm
									}
								}}
							>
								<CardContent sx={{ p: 3 }}>
									<Stack
										direction='row'
										alignItems='flex-start'
										spacing={2}
									>
										{/* Ícone representativo */}
										<Avatar
											sx={{
												width: 48,
												height: 48,
												backgroundColor: palette.main,
												color: palette.contrastText,
												borderRadius: `${radiusTokens.md}px`
											}}
										>
											{getInsightIcon(insight.type)}
										</Avatar>

										{/* Conteúdo principal */}
										<Box sx={{ flex: 1, minWidth: 0 }}>
											<Stack
												direction='row'
												alignItems='center'
												spacing={1}
												sx={{ mb: 1 }}
											>
												<Typography
													variant='h6'
													sx={{
														fontWeight: 600,
														color: 'text.primary'
													}}
												>
													{insight.title}
												</Typography>

												{/* Badge de prioridade padronizado */}
												<Chip
													icon={getPriorityIcon(insight.priority)}
													label={insight.priority.toUpperCase()}
													size='small'
													sx={{
														backgroundColor: palette.main,
														color: palette.contrastText,
														fontWeight: 600,
														fontSize: '0.75rem',
														'& .MuiChip-icon': {
															color: palette.contrastText,
															fontSize: '1rem'
														}
													}}
												/>
											</Stack>

											<Typography
												variant='body2'
												sx={{
													lineHeight: 1.6,
													color: 'text.secondary',
													mb: 2
												}}
											>
												{insight.description}
											</Typography>

											{/* Categoria com divisória sutil */}
											<Divider sx={{ my: 1 }} />

											<Typography
												variant='caption'
												sx={{
													color: palette.main,
													fontWeight: 600,
													textTransform: 'uppercase',
													letterSpacing: 0.5
												}}
											>
												📈 {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
											</Typography>
										</Box>
									</Stack>
								</CardContent>
							</Card>
						</Box>
					);
				})}
			</Stack>

			{/* Resumo dos insights */}
			{organizedInsights.length > 0 && (
				<Alert
					severity='success'
					sx={{
						mt: 3,
						borderRadius: `${radiusTokens.lg}px`,
						'& .MuiAlert-icon': {
							fontSize: '1.5rem'
						}
					}}
				>
					<Typography
						variant='body2'
						sx={{
							fontWeight: 500
						}}
					>
						<strong>💡 {organizedInsights.length} insights</strong> gerados automaticamente baseados nos
						seus dados reais. Organizados por prioridade e categoria para melhor análise.
					</Typography>
				</Alert>
			)}
		</Box>
	);
}

export default BusinessInsights;
