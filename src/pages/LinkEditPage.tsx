import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { LinkForm } from '@/features/links/components/LinkForm';
import MainLayout from '@/shared/layout/MainLayout';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';

/**
 * Página de edição de link
 * Usa o componente LinkForm em modo edit
 */
function LinkEditPage() {
	const { id } = useParams<{ id: string }>();

	if (!id) {
		return <div>ID do link não fornecido</div>;
	}

	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<Container
					maxWidth="md"
					sx={{ py: 3 }}
				>
					<LinkForm
						mode="edit"
						linkId={id}
						showBackButton={true}
					/>
				</Container>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default LinkEditPage;
