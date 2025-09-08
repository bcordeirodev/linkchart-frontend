/**
 * 🎯 LINK CREATE PAGE - REFATORADA
 * Página especializada para criação de links usando módulo DDD
 */


import { Container, Stack, Fade } from '@mui/material';
import { CreateLinkForm, CreateLinkHero } from '@/features/links/create';
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
	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<Container maxWidth="md">
					<Stack spacing={4} sx={{ py: 4 }}>
						<PageBreadcrumb />

						{/* Hero Section */}
						<CreateLinkHero />

						{/* Form Section */}
						<Fade in timeout={800}>
							<CreateLinkForm showBackButton={true} />
						</Fade>
					</Stack>
				</Container>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default LinkCreatePage;
