/**
 * 📊 DEMO CHARTS - COMPONENTE BASE
 * Gráficos de demonstração para estados sem dados
 */

import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ApexChartWrapper from '../data-display/ApexChartWrapper';

interface DemoChartsProps {
	type?: 'area' | 'bar' | 'pie' | 'line';
	height?: number;
	title?: string;
}

/**
 * Componente DemoCharts seguindo padrões arquiteturais
 * Exibe gráficos de demonstração quando não há dados reais
 */
export function DemoCharts({ type = 'area', height = 300, title = 'Dados de Demonstração' }: DemoChartsProps) {
	const theme = useTheme();

	// Dados de demonstração
	const demoData = {
		area: {
			series: [
				{
					name: 'Cliques',
					data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
				}
			],
			options: {
				chart: { type: 'area', toolbar: { show: false } },
				colors: [theme.palette.primary.main],
				xaxis: { categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'] },
				fill: { type: 'gradient' }
			}
		},
		bar: {
			series: [
				{
					name: 'Visitas',
					data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
				}
			],
			options: {
				chart: { type: 'bar', toolbar: { show: false } },
				colors: [theme.palette.secondary.main],
				xaxis: { categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'] }
			}
		},
		pie: {
			series: [44, 55, 13, 43, 22],
			options: {
				chart: { type: 'pie' },
				labels: ['Desktop', 'Mobile', 'Tablet', 'Smart TV', 'Outros'],
				colors: [
					theme.palette.primary.main,
					theme.palette.secondary.main,
					theme.palette.success.main,
					theme.palette.warning.main,
					theme.palette.error.main
				]
			}
		},
		line: {
			series: [
				{
					name: 'Performance',
					data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
				}
			],
			options: {
				chart: { type: 'line', toolbar: { show: false } },
				colors: [theme.palette.info.main],
				xaxis: { categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'] }
			}
		}
	};

	const chartData = demoData[type];

	return (
		<Box>
			{title && (
				<Typography
					variant="h6"
					sx={{ mb: 2, textAlign: 'center', opacity: 0.7 }}
				>
					{title}
				</Typography>
			)}

			<ApexChartWrapper
				series={chartData.series}
				options={chartData.options}
				type={type}
				height={height}
			/>

			<Typography
				variant="caption"
				color="text.secondary"
				sx={{
					display: 'block',
					textAlign: 'center',
					mt: 1,
					fontStyle: 'italic'
				}}
			>
				💡 Dados de demonstração - Compartilhe seus links para ver dados reais
			</Typography>
		</Box>
	);
}

export default DemoCharts;
