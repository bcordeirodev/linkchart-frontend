import React from 'react';

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

        // Log detalhado no console
        this.logToConsole(errorInfo);

        // Em produção, enviar para serviço de monitoramento
        if (import.meta.env.PROD) {
            this.sendToMonitoring(errorInfo);
        }
    }

    /**
     * Log detalhado no console
     */
    private logToConsole(errorInfo: ErrorInfo): void {
        console.group(`🔍 ErrorHandler - ${errorInfo.message}`);
        console.error('Mensagem:', errorInfo.message);
        console.error('Stack Trace:', errorInfo.stack);
        console.error('Timestamp:', errorInfo.timestamp);
        console.error('URL:', errorInfo.url);
        console.error('User Agent:', errorInfo.userAgent);

        if (errorInfo.context && Object.keys(errorInfo.context).length > 0) {
            console.error('Contexto:', errorInfo.context);
        }

        console.error('Total de Erros no Handler:', this.errors.length);
        console.groupEnd();
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
     * Registra erro de validação
     */
    public logValidationError(field: string, value: unknown, rule: string): void {
        this.logError(`Validation Error: ${field} failed ${rule}`, {
            field,
            value,
            rule,
            type: 'validation_error'
        });
    }

    /**
     * Registra erro de componente React
     */
    public logReactError(error: Error, componentName?: string, props?: Record<string, unknown>): void {
        this.logError(error, {
            componentName,
            props,
            type: 'react_error'
        });
    }

    /**
     * Registra erro de hook
     */
    public logHookError(error: Error, hookName: string, dependencies?: unknown[]): void {
        this.logError(error, {
            hookName,
            dependencies,
            type: 'hook_error'
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
        console.log('🧹 ErrorHandler: Todos os erros foram limpos');
    }

    /**
     * Envia erro para serviço de monitoramento (Sentry, etc.)
     */
    private sendToMonitoring(errorInfo: ErrorInfo): void {
        // Implementar integração com Sentry ou outro serviço
        if (import.meta.env.VITE_SENTRY_DSN) {
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

    /**
     * Obtém estatísticas de erros por tipo
     */
    public getErrorStats(): Record<string, number> {
        const stats: Record<string, number> = {};

        this.errors.forEach((error) => {
            const type = error.context?.type as string || 'unknown';
            stats[type] = (stats[type] || 0) + 1;
        });

        return stats;
    }

    /**
     * Mostra resumo dos erros no console
     */
    public showErrorSummary(): void {
        const stats = this.getErrorStats();

        console.group('📊 ErrorHandler - Resumo de Erros');
        console.log('Total de Erros:', this.errors.length);
        console.log('Erros por Tipo:', stats);

        if (this.errors.length > 0) {
            console.log('Último Erro:', this.errors[this.errors.length - 1]);
        }

        console.groupEnd();
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

        // Adiciona ao window para acesso global
        (window as any).errorHandler = errorHandler;
        (window as any).showErrorSummary = () => errorHandler.showErrorSummary();
        (window as any).clearErrors = () => errorHandler.clearErrors();
        (window as any).getErrorStats = () => errorHandler.getErrorStats();
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

// Função para capturar erros de componentes React
export const withReactErrorHandling = <P extends Record<string, unknown>>(
    Component: React.ComponentType<P>,
    componentName?: string
) => {
    const WrappedComponent = (props: P) => {
        try {
            return React.createElement(Component, props);
        } catch (error) {
            errorHandler.logReactError(
                error instanceof Error ? error : new Error(String(error)),
                componentName || Component.name,
                props
            );

            // Renderiza fallback em caso de erro
            return React.createElement('div', {
                className: 'p-4 border border-red-200 bg-red-50 rounded'
            }, [
                React.createElement('p', {
                    key: 'error',
                    className: 'text-red-600'
                }, `Erro ao renderizar componente ${componentName || Component.name}`),
                React.createElement('p', {
                    key: 'details',
                    className: 'text-sm text-red-500'
                }, 'Verifique o console para mais detalhes')
            ]);
        }
    };

    WrappedComponent.displayName = `withReactErrorHandling(${componentName || Component.name})`;
    return WrappedComponent;
};
