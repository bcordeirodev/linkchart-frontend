import React from 'react';
import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { EnhancedAnalytics } from '@/features/analytics/components/enhanced/EnhancedAnalytics';
import MainLayout from '@/shared/layout/MainLayout';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';

/**
 * Página de analytics de um link específico
 * Usa o componente EnhancedAnalytics com linkId
 */
function LinkAnalyticsPage() {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return <div>ID do link não fornecido</div>;
    }

    return (
        <AuthGuardRedirect auth={['user', 'admin']}>
            <MainLayout>
                <Container maxWidth="xl" sx={{ py: 3 }}>
                    <EnhancedAnalytics linkId={id} />
                </Container>
            </MainLayout>
        </AuthGuardRedirect>
    );
}

export default LinkAnalyticsPage;
