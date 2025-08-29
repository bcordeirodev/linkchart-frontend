import { BaseService } from './base.service';
import { API_CONFIG } from '@/constants/api';

/**
 * Serviço para gerenciamento de Reports
 *
 * Herda do BaseService para:
 * - Tratamento de erro padronizado
 * - Logging centralizado
 * - Type safety
 * - Fallbacks automáticos
 */

export interface DashboardReport {
    summary: {
        total_clicks: number;
        unique_visitors: number;
        conversion_rate: number;
        top_performing_links: Array<{
            id: number;
            title: string;
            clicks: number;
        }>;
    };
    charts: {
        clicks_over_time: Array<{ date: string; clicks: number }>;
        top_countries: Array<{ country: string; clicks: number }>;
        device_breakdown: Array<{ device: string; clicks: number }>;
    };
}

export interface ExecutiveReport {
    executive_summary: {
        period: string;
        total_links: number;
        total_clicks: number;
        growth_rate: number;
        key_insights: string[];
    };
    performance_metrics: {
        best_performing_link: {
            id: number;
            title: string;
            clicks: number;
        };
        geographic_reach: {
            countries: number;
            top_country: string;
        };
        audience_insights: {
            primary_device: string;
            peak_hour: number;
        };
    };
}

/**
 * Classe de serviço para Reports usando BaseService
 */
class ReportsService extends BaseService {
    constructor() {
        super('ReportsService');
    }

    /**
     * Busca relatório de dashboard para um link
     */
    async getDashboardReport(linkId: string): Promise<DashboardReport> {
        this.validateId(linkId, 'Link ID');

        const fallbackData: DashboardReport = {
            summary: {
                total_clicks: 0,
                unique_visitors: 0,
                conversion_rate: 0,
                top_performing_links: []
            },
            charts: {
                clicks_over_time: [],
                top_countries: [],
                device_breakdown: []
            }
        };

        return this.get<DashboardReport>(API_CONFIG.ENDPOINTS.REPORTS_DASHBOARD(linkId), {
            fallback: fallbackData,
            context: 'get_dashboard_report'
        });
    }

    /**
     * Busca relatório executivo para um link
     */
    async getExecutiveReport(linkId: string): Promise<ExecutiveReport> {
        this.validateId(linkId, 'Link ID');

        const fallbackData: ExecutiveReport = {
            executive_summary: {
                period: '30 days',
                total_links: 0,
                total_clicks: 0,
                growth_rate: 0,
                key_insights: []
            },
            performance_metrics: {
                best_performing_link: {
                    id: 0,
                    title: '',
                    clicks: 0
                },
                geographic_reach: {
                    countries: 0,
                    top_country: ''
                },
                audience_insights: {
                    primary_device: '',
                    peak_hour: 0
                }
            }
        };

        return this.get<ExecutiveReport>(API_CONFIG.ENDPOINTS.REPORTS_EXECUTIVE(linkId), {
            fallback: fallbackData,
            context: 'get_executive_report'
        });
    }
}

// Instância singleton do serviço
export const reportsService = new ReportsService();
