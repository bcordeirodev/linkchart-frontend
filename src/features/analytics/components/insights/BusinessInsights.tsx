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
import { useTheme, alpha } from '@mui/material/styles';

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

	if (!insights || insights.length === 0) {
		return (
			<Alert
				severity='info'
				sx={{
					m: 2,
					borderRadius: '16px',
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

	const getPriorityColors = (priority: string) => {
		const colorMap = {
			high: {
				main: theme.palette.error.main,
				light: theme.palette.error.light,
				bg: alpha(theme.palette.error.main, 0.1),
				border: alpha(theme.palette.error.main, 0.3)
			},
			medium: {
				main: theme.palette.warning.main,
				light: theme.palette.warning.light,
				bg: alpha(theme.palette.warning.main, 0.1),
				border: alpha(theme.palette.warning.main, 0.3)
			},
			low: {
				main: theme.palette.success.main,
				light: theme.palette.success.light,
				bg: alpha(theme.palette.success.main, 0.1),
				border: alpha(theme.palette.success.main, 0.3)
			}
		};
		return colorMap[priority as keyof typeof colorMap] || colorMap.low;
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
						color: 'text.primary',
						fontFamily: 'Inter, system-ui, sans-serif'
					}}
				>
					💡 Insights de Negócio
				</Typography>
			) : null}

			{/* Insights organizados por categoria */}
			<Stack spacing={3}>
				{organizedInsights.map((insight, index) => {
					const colors = getPriorityColors(insight.priority);
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
								elevation={3}
								sx={{
									borderRadius: '16px',
									border: `1px solid ${colors.border}`,
									backgroundColor: colors.bg,
									backdropFilter: 'blur(10px)',
									transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
									'&:hover': {
										boxShadow: theme.shadows[8],
										transform: 'translateY(-4px)',
										borderColor: colors.main
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
												backgroundColor: colors.main,
												color: 'white',
												borderRadius: '12px'
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
														color: 'text.primary',
														fontFamily: 'Inter, system-ui, sans-serif'
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
														backgroundColor: colors.main,
														color: 'white',
														fontWeight: 600,
														fontSize: '0.75rem',
														'& .MuiChip-icon': {
															color: 'white',
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
													fontFamily: 'Inter, system-ui, sans-serif',
													mb: 2
												}}
											>
												{insight.description}
											</Typography>

											{/* Categoria com divisória sutil */}
											<Divider sx={{ my: 1, borderColor: colors.border }} />

											<Typography
												variant='caption'
												sx={{
													color: colors.main,
													fontWeight: 600,
													textTransform: 'uppercase',
													letterSpacing: 0.5,
													fontFamily: 'Inter, system-ui, sans-serif'
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
						borderRadius: '16px',
						backgroundColor: alpha(theme.palette.success.main, 0.1),
						border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
						'& .MuiAlert-icon': {
							fontSize: '1.5rem'
						}
					}}
				>
					<Typography
						variant='body2'
						sx={{
							fontFamily: 'Inter, system-ui, sans-serif',
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
