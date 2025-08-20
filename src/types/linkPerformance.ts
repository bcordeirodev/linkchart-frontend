/**
 * Tipos para dados de Performance dos Links
 * Focado apenas em métricas de performance e analytics
 * 
 * @file linkPerformance.ts (anteriormente rateLimit.ts)
 * @description Tipos relacionados ao desempenho e métricas dos links
 */

export interface LinkPerformanceSummary {
	total_redirects_24h: number; // Total de redirecionamentos nas últimas 24h
	unique_visitors: number; // Visitantes únicos
	avg_response_time: number; // Tempo médio de redirecionamento em ms
	most_accessed_link: string; // Link mais acessado
	success_rate: number; // Taxa de sucesso dos redirecionamentos
	total_links_with_traffic: number; // Links que receberam tráfego
}

export interface LinkHourlyData {
	hour: string;
	total_redirects: number; // Total de redirecionamentos
	successful_redirects: number; // Redirecionamentos bem-sucedidos
	unique_ips: number; // IPs únicos
	avg_response_time: number; // Tempo médio de resposta
	top_slugs: Record<string, number>; // Links mais acessados
}

export interface LinkPerformanceDetails {
	slug: string; // Slug do link
	title: string; // Título do link
	total_redirects: number; // Total de redirecionamentos
	avg_response_time: number; // Tempo médio de resposta em ms
	success_rate: number; // Taxa de sucesso (%)
	last_accessed: string; // Último acesso
}

export interface LinkPerformanceDashboard {
	summary: LinkPerformanceSummary;
	hourly_data: LinkHourlyData[];
	link_performance: LinkPerformanceDetails[];
	traffic_sources: {
		referer: string;
		redirects: number;
		percentage: number;
	}[];
	geographic_data: {
		country: string;
		redirects: number;
		percentage: number;
	}[];
	device_data: {
		device: string;
		redirects: number;
		percentage: number;
	}[];
}

export interface PerformanceComponentProps {
	data: LinkPerformanceDashboard;
}
