/**
 * 🎯 LINK CREATE PAGE - REFATORADA
 * Página especializada para criação de links usando módulo DDD
 */

import { Stack, Fade, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { CreateLinkForm, CreateLinkHero } from '@/features/links/create';
import { ResponsiveContainer } from '@/shared/ui/base';
import MainLayout from '@/shared/layout/MainLayout';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';
import PageBreadcrumb from '@/shared/ui/navigation/PageBreadcrumb';

/**
 * Página de criação de links simplificada e otimizada
 * Segue padrões DDD com responsabilidade única
 *
 * Features:
 * - Hero section com animações
 * - Formulário especializado para criação
 * - Auto-geração de slug
 * - Validação Zod integrada
 * - Mensagens de sucesso/erro
 */
function LinkCreatePage() {
	const [formMounted, setFormMounted] = useState(false);

	useEffect(() => {
		// Garante que o formulário está montado antes de iniciar a animação
		const timer = setTimeout(() => setFormMounted(true), 200);
		return () => clearTimeout(timer);
	}, []);

	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<ResponsiveContainer
					variant="form"
					maxWidth="md"
				>
					<Stack spacing={4}>
						<PageBreadcrumb />

						{/* Hero Section */}
						<CreateLinkHero />

						{/* Form Section */}
						<Box>
							<Fade
								in={formMounted}
								timeout={800}
								mountOnEnter
								unmountOnExit
							>
								<Box>
									<CreateLinkForm showBackButton={true} />
								</Box>
							</Fade>
						</Box>
					</Stack>
				</ResponsiveContainer>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default LinkCreatePage;
