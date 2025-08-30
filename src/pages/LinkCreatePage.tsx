import React from 'react';
import { Container } from '@mui/material';
import { LinkForm } from '@/features/links/components/LinkForm';
import MainLayout from '@/shared/layout/MainLayout';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';

/**
 * Página de criação de link
 * Usa o componente LinkForm em modo create
 */
function LinkCreatePage() {
    return (
        <AuthGuardRedirect auth={['user', 'admin']}>
            <MainLayout>
                <Container maxWidth="md" sx={{ py: 3 }}>
                    <LinkForm
                        mode="create"
                        showBackButton={true}
                    />
                </Container>
            </MainLayout>
        </AuthGuardRedirect>
    );
}

export default LinkCreatePage;
