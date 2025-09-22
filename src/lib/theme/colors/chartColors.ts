/**
 * 📊 CORES PADRÃO PARA GRÁFICOS - LINK CHART
 * Paleta de cores centralizada e consistente para todos os gráficos da aplicação
 */

/**
 * Cores principais para gráficos seguindo padrão Material Design
 * Essas cores são otimizadas para acessibilidade e consistência visual
 */
export const chartColors = {
	// Cores principais - usadas em gráficos simples
	primary: '#1976d2', // Azul principal
	success: '#2e7d32', // Verde
	warning: '#ff9800', // Laranja
	error: '#d32f2f', // Vermelho
	info: '#2196f3', // Azul claro
	secondary: '#dc004e', // Rosa

	// Paleta estendida para gráficos múltiplos
	extended: [
		'#1976d2', // Azul principal
		'#2e7d32', // Verde
		'#dc004e', // Rosa
		'#9c27b0', // Roxo
		'#ff9800', // Laranja
		'#d32f2f' // Vermelho
	],

	// Cores para diferentes tipos de dados
	devices: {
		mobile: '#1976d2', // Azul
		desktop: '#2e7d32', // Verde
		tablet: '#ff9800' // Laranja
	},

	geographic: {
		countries: '#2e7d32', // Verde para países
		states: '#ff9800', // Laranja para estados
		cities: '#dc004e' // Rosa para cidades
	},

	temporal: {
		hourly: '#ff9800', // Laranja para dados por hora
		daily: '#1976d2', // Azul para dados diários
		weekly: '#2e7d32' // Verde para dados semanais
	},

	// Cores para heatmaps e intensidade
	heatmap: {
		low: '#e3f2fd', // Azul muito claro
		medium: '#2196f3', // Azul médio
		high: '#1976d2', // Azul escuro
		intense: '#0d47a1' // Azul muito escuro
	}
};

/**
 * Função para obter cor por índice (para gráficos com múltiplas séries)
 */
export function getChartColor(index: number): string {
	return chartColors.extended[index % chartColors.extended.length];
}

/**
 * Função para obter cores de gradiente
 */
export function getGradientColors(baseColor: string) {
	const gradients: Record<string, string[]> = {
		'#1976d2': ['#1976d2', '#64b5f6'], // Azul
		'#2e7d32': ['#2e7d32', '#81c784'], // Verde
		'#ff9800': ['#ff9800', '#ffb74d'], // Laranja
		'#d32f2f': ['#d32f2f', '#e57373'], // Vermelho
		'#dc004e': ['#dc004e', '#f48fb1'], // Rosa
		'#9c27b0': ['#9c27b0', '#ce93d8'] // Roxo
	};

	return gradients[baseColor] || [baseColor, baseColor];
}

export default chartColors;
