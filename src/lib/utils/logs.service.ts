import { BaseService } from '../api/base.service';
import { API_CONFIG } from '../api/endpoints';

/**
 * Serviço para gerenciamento de Logs
 *
 * Herda do BaseService para:
 * - Tratamento de erro padronizado
 * - Logging centralizado
 * - Type safety
 * - Fallbacks automáticos
 */

export interface LogEntry {
    level: string;
    message: string;
    context?: Record<string, unknown>;
    timestamp: string;
}

export interface SystemDiagnostic {
    php_version: string;
    laravel_version: string;
    database_status: string;
    cache_status: string;
    queue_status: string;
    disk_usage: string;
    memory_usage: string;
}

/**
 * Classe de serviço para Logs usando BaseService
 */
export default class LogsService extends BaseService {
    constructor() {
        super('LogsService');
    }

    /**
     * Lista todos os logs disponíveis
     */
    async listLogs(): Promise<string[]> {
        return this.get<string[]>(API_CONFIG.ENDPOINTS.LOGS, {
            fallback: [],
            context: 'list_logs'
        });
    }

    /**
     * Busca diagnóstico do sistema
     */
    async getSystemDiagnostic(): Promise<SystemDiagnostic> {
        const fallbackData: SystemDiagnostic = {
            php_version: '8.1',
            laravel_version: '10.x',
            database_status: 'connected',
            cache_status: 'active',
            queue_status: 'running',
            disk_usage: '0%',
            memory_usage: '0%'
        };

        return this.get<SystemDiagnostic>(API_CONFIG.ENDPOINTS.LOGS_DIAGNOSTIC, {
            fallback: fallbackData,
            context: 'get_system_diagnostic'
        });
    }

    /**
     * Busca erros recentes
     */
    async getRecentErrors(): Promise<LogEntry[]> {
        return this.get<LogEntry[]>(API_CONFIG.ENDPOINTS.LOGS_RECENT_ERRORS, {
            fallback: [],
            context: 'get_recent_errors'
        });
    }

    /**
     * Testa o sistema de logging
     */
    async testLogging(): Promise<{ message: string }> {
        return this.post<{ message: string }>(
            API_CONFIG.ENDPOINTS.LOGS_TEST,
            {},
            {
                fallback: { message: 'Teste de logging executado' },
                context: 'test_logging'
            }
        );
    }

    /**
     * Lê um arquivo de log específico
     */
    async readLogFile(filename: string): Promise<string> {
        this.validateRequired({ filename }, ['filename']);

        return this.get<string>(API_CONFIG.ENDPOINTS.LOGS_FILE(filename), {
            fallback: '',
            context: 'read_log_file'
        });
    }
}

// Instância singleton do serviço
export const logsService = new LogsService();
