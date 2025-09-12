/**
 * 🚀 LAZY ANALYTICS COMPONENTS - VERSÃO ROBUSTA
 * 
 * @description
 * Componentes Analytics com lazy loading robusto e error boundaries.
 * Versão simplificada para evitar problemas de importação circular.
 */

import { lazy, Suspense } from 'react';
import { Box, Skeleton, Alert } from '@mui/material';

// Skeletons específicos para cada componente
const PerformanceSkeleton = () => (
    <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={80} sx={{ flex: 1 }} />
            ))}
        </Box>
        <Skeleton variant="rectangular" height={300} />
    </Box>
);

const GeographicSkeleton = () => (
    <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={400} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
            {[...Array(3)].map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={120} sx={{ flex: 1 }} />
            ))}
        </Box>
    </Box>
);

const TemporalSkeleton = () => (
    <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={300} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rectangular" height={150} sx={{ flex: 1 }} />
            <Skeleton variant="rectangular" height={150} sx={{ flex: 1 }} />
        </Box>
    </Box>
);

const AudienceSkeleton = () => (
    <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Skeleton variant="rectangular" height={200} sx={{ flex: 1 }} />
            <Skeleton variant="rectangular" height={200} sx={{ flex: 1 }} />
        </Box>
        <Skeleton variant="rectangular" height={250} />
    </Box>
);

const HeatmapSkeleton = () => (
    <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={350} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rectangular" height={100} sx={{ flex: 1 }} />
            <Skeleton variant="rectangular" height={100} sx={{ flex: 1 }} />
        </Box>
    </Box>
);

// Error Fallback
const ErrorFallback = ({ componentName }: { componentName: string }) => (
    <Alert severity="error" sx={{ m: 2 }}>
        Erro ao carregar {componentName}. Tente recarregar a página.
    </Alert>
);

// Lazy loaded components
const LazyPerformanceAnalysis = lazy(() =>
    import('../perfomance/PerformanceAnalysis').catch(() => ({
        default: () => <ErrorFallback componentName="Performance Analysis" />
    }))
);

const LazyGeographicAnalysis = lazy(() =>
    import('../geographic/GeographicAnalysis').catch(() => ({
        default: () => <ErrorFallback componentName="Geographic Analysis" />
    }))
);

const LazyTemporalAnalysis = lazy(() =>
    import('../temporal/TemporalAnalysis').catch(() => ({
        default: () => <ErrorFallback componentName="Temporal Analysis" />
    }))
);

const LazyAudienceAnalysis = lazy(() =>
    import('../audience/AudienceAnalysis').catch(() => ({
        default: () => <ErrorFallback componentName="Audience Analysis" />
    }))
);

const LazyHeatmapAnalysis = lazy(() =>
    import('../heatmap/HeatmapAnalysis').catch(() => ({
        default: () => <ErrorFallback componentName="Heatmap Analysis" />
    }))
);

// Wrapper components with Suspense
export const LazyPerformanceAnalysisWrapper = (props: any) => (
    <Suspense fallback={<PerformanceSkeleton />}>
        <LazyPerformanceAnalysis {...props} />
    </Suspense>
);

export const LazyGeographicAnalysisWrapper = (props: any) => (
    <Suspense fallback={<GeographicSkeleton />}>
        <LazyGeographicAnalysis {...props} />
    </Suspense>
);

export const LazyTemporalAnalysisWrapper = (props: any) => (
    <Suspense fallback={<TemporalSkeleton />}>
        <LazyTemporalAnalysis {...props} />
    </Suspense>
);

export const LazyAudienceAnalysisWrapper = (props: any) => (
    <Suspense fallback={<AudienceSkeleton />}>
        <LazyAudienceAnalysis {...props} />
    </Suspense>
);

export const LazyHeatmapAnalysisWrapper = (props: any) => (
    <Suspense fallback={<HeatmapSkeleton />}>
        <LazyHeatmapAnalysis {...props} />
    </Suspense>
);
