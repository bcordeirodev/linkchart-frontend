// ===========================================
// HEALTH CHECK API ROUTE
// Link Chart Frontend - Next.js 15
// ===========================================

import { NextRequest, NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 * GET /api/health
 * 
 * Retorna o status da aplicação para monitoramento
 * e verificações de saúde em produção
 */
export async function GET(request: NextRequest) {
    try {
        // Verificações básicas de saúde
        const healthData = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            uptime: process.uptime(),
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                external: Math.round(process.memoryUsage().external / 1024 / 1024),
            },
            // Verificações adicionais podem ser adicionadas aqui
            checks: {
                api: await checkApiConnection(),
                // database: await checkDatabaseConnection(), // Implementar se necessário
                // redis: await checkRedisConnection(),       // Implementar se necessário
            }
        };

        return NextResponse.json(healthData, {
            status: 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

    } catch (error) {
        console.error('Health check failed:', error);

        return NextResponse.json(
            {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error',
                version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
                environment: process.env.NODE_ENV || 'development',
            },
            {
                status: 503,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            }
        );
    }
}

/**
 * Verifica conexão com a API backend
 */
async function checkApiConnection(): Promise<{ status: string; responseTime?: number }> {
    try {
        const startTime = Date.now();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL;

        if (!apiUrl) {
            return { status: 'not_configured' };
        }

        // Fazer uma requisição simples para verificar se a API está respondendo
        const response = await fetch(`${apiUrl}/health`, {
            method: 'GET',
            headers: {
                'User-Agent': 'LinkChart-Frontend-HealthCheck',
            },
            // Timeout de 5 segundos
            signal: AbortSignal.timeout(5000)
        });

        const responseTime = Date.now() - startTime;

        if (response.ok) {
            return {
                status: 'healthy',
                responseTime
            };
        } else {
            return {
                status: 'unhealthy',
                responseTime
            };
        }

    } catch (error) {
        console.warn('API health check failed:', error);
        return {
            status: 'error'
        };
    }
}

/**
 * HEAD method para verificações mais leves
 */
export async function HEAD(request: NextRequest) {
    try {
        return new NextResponse(null, {
            status: 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
    } catch (error) {
        return new NextResponse(null, { status: 503 });
    }
}
