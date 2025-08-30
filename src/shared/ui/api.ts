/**
 * Shared UI API Types
 */

export interface ApiError {
    message: string;
    status: number;
    code?: string;
}

export interface ChartSeries {
    name: string;
    data: number[];
    color?: string;
}
