/**
 * Sistema de monitoramento de erros
 * Centraliza o tratamento e logging de erros
 */

export interface ErrorInfo {
    message: string;
    stack?: string;
    context?: Record<string, unknown>;
    timestamp: string;
    userAgent?: string;
    url?: string;
}

export interface ErrorReport {
    errors: ErrorInfo[];
    totalErrors: number;
    lastError?: ErrorInfo;
}

class ErrorHandler {
    private errors: ErrorInfo[] = [];
    private maxErrors = 100; // Limite de erros em memória

    /**
     * Registra um erro
     */
    public logError(error: Error | string, context?: Record<string, unknown>): void {
        const errorInfo: ErrorInfo = {
            message: typeof error === 'string' ? error : error.message,
            stack: error instanceof Error ? error.stack : undefined,
            context,
            timestamp: new Date().toISOString(),
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
            url: typeof window !== 'undefined' ? window.location.href : undefined
        };

        this.errors.push(errorInfo);

        // Manter apenas os últimos erros
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(-this.maxErrors);
        }

        // Log no console em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
            console.error('Error logged:', errorInfo);
        }

        // Em produção, enviar para serviço de monitoramento
        if (process.env.NODE_ENV === 'production') {
            this.sendToMonitoring(errorInfo);
        }
    }

    /**
     * Registra erro de API
     */
    public logApiError(endpoint: string, status: number, response?: unknown): void {
        this.logError(`API Error: ${endpoint} returned ${status}`, {
            endpoint,
            status,
            response,
            type: 'api_error'
        });
    }

    /**
     * Registra erro de fallback
     */
    public logFallbackError(originalError: string, fallbackUsed: string): void {
        this.logError(`Fallback used: ${fallbackUsed}`, {
            originalError,
            fallbackUsed,
            type: 'fallback_error'
        });
    }

    /**
     * Registra erro de autenticação
     */
    public logAuthError(error: string): void {
        this.logError(`Authentication Error: ${error}`, {
            type: 'auth_error'
        });
    }

    /**
     * Obtém relatório de erros
     */
    public getErrorReport(): ErrorReport {
        return {
            errors: [...this.errors],
            totalErrors: this.errors.length,
            lastError: this.errors[this.errors.length - 1]
        };
    }

    /**
     * Limpa erros antigos
     */
    public clearErrors(): void {
        this.errors = [];
    }

    /**
     * Envia erro para serviço de monitoramento (Sentry, etc.)
     */
    private sendToMonitoring(errorInfo: ErrorInfo): void {
        // Implementar integração com Sentry ou outro serviço
        if (process.env.SENTRY_DSN) {
            // Sentry.captureException(errorInfo);
        }

        // Log para console em produção (remover em produção real)
        console.error('Production error:', errorInfo);
    }

    /**
     * Verifica se há muitos erros recentes
     */
    public hasTooManyErrors(minutes = 5): boolean {
        const cutoff = new Date(Date.now() - minutes * 60 * 1000);
        const recentErrors = this.errors.filter((error) => new Date(error.timestamp) > cutoff);
        return recentErrors.length > 10; // Mais de 10 erros em 5 minutos
    }
}

// Instância singleton
export const errorHandler = new ErrorHandler();

// Hook para capturar erros não tratados
export const setupGlobalErrorHandling = (): void => {
    if (typeof window !== 'undefined') {
        // Capturar erros não tratados
        window.addEventListener('error', (event) => {
            errorHandler.logError(event.error || event.message, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                type: 'unhandled_error'
            });
        });

        // Capturar promessas rejeitadas
        window.addEventListener('unhandledrejection', (event) => {
            errorHandler.logError(`Unhandled Promise Rejection: ${event.reason}`, {
                reason: event.reason,
                type: 'unhandled_promise'
            });
        });
    }
};

// Função utilitária para wrapper de erro
export const withErrorHandling = <T extends unknown[], R>(fn: (...args: T) => R | Promise<R>, context?: string) => {
    return async (...args: T): Promise<R> => {
        try {
            return await fn(...args);
        } catch (error) {
            errorHandler.logError(error instanceof Error ? error : String(error), {
                context,
                functionName: fn.name,
                args: args.map((arg) => (typeof arg === 'object' ? '[Object]' : String(arg)))
            });
            throw error;
        }
    };
};
