import { AppIcon } from '@/lib/icons';
import { useNavigate } from 'react-router-dom';

// Styled Components
import {
	LinkPageContainer,
	LinksHeaderContainer,
	LinksHeaderDecoration,
	LinksHeaderContent,
	LinksHeaderTitle,
	LinksHeaderSubtitle,
	LinksHeaderActions,
	CreateLinkButton
} from './styles/Link.styled';

interface LinksHeaderProps {
	onCreateNew?: () => void;
}

/**
 * Cabeçalho da página de links
 * Inclui título e botão de criação
 */
export function LinksHeader({ onCreateNew }: LinksHeaderProps) {
	const navigate = useNavigate();

	const handleCreateNew = () => {
		if (onCreateNew) {
			onCreateNew();
		} else {
			navigate('/link/create');
		}
	};

	return (
		<LinkPageContainer>
			{/* <PageBreadcrumb /> */}
			<LinksHeaderContainer>
				{/* Elemento decorativo */}
				<LinksHeaderDecoration />

				<LinksHeaderContent>
					<LinksHeaderTitle variant="h3">Gerenciar Links</LinksHeaderTitle>
					<LinksHeaderSubtitle>Crie, edite e monitore seus links encurtados</LinksHeaderSubtitle>
				</LinksHeaderContent>

				<LinksHeaderActions>
					<CreateLinkButton
						variant="contained"
						size="large"
						startIcon={<AppIcon intent="create" size={20} />}
						onClick={handleCreateNew}
					>
						Criar Novo Link
					</CreateLinkButton>
				</LinksHeaderActions>
			</LinksHeaderContainer>
		</LinkPageContainer>
	);
}

export default LinksHeader;
