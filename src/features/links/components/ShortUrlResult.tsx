import { Typography, Box } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { CopyButton } from './CopyButton';
import { ShareActions } from './ShareActions';

// Styled Components
import {
	ResultContainer,
	SuccessHeader,
	SuccessIcon,
	SuccessTitle,
	SuccessSubtitle,
	UrlDisplayContainer,
	UrlLabel,
	UrlDisplay,
	ActionsContainer,
	AdditionalActionsContainer,
	CreateAnotherButton,
	SuccessDecoration,
	UrlHighlight
} from './styles/Results.styled';

interface IShortUrl {
	slug: string;
	short_url: string;
	original_url: string;
	expires_at: string | null;
}

interface ShortUrlResultProps {
	shortUrl: IShortUrl;
	onCreateAnother?: () => void;
}

/**
 * Componente de resultado de URL encurtada
 * Exibe o link criado com ações de cópia e compartilhamento
 */
export function ShortUrlResult({ shortUrl, onCreateAnother }: ShortUrlResultProps) {
	return (
		<ResultContainer elevation={0}>
			{/* Decorative element */}
			<SuccessDecoration />

			{/* Success Header */}
			<SuccessHeader>
				<SuccessIcon>
					<CheckCircle sx={{ fontSize: 'inherit' }} />
				</SuccessIcon>
				<SuccessTitle>
					🎉 Link criado com sucesso!
				</SuccessTitle>
				<SuccessSubtitle>
					Seu link está pronto para ser compartilhado
				</SuccessSubtitle>
			</SuccessHeader>

			{/* URL Display */}
			<UrlDisplayContainer>
				<UrlLabel>
					SEU LINK ENCURTADO
				</UrlLabel>
				<UrlHighlight>
					<UrlDisplay>
						{shortUrl.short_url}
					</UrlDisplay>
				</UrlHighlight>

				{/* Action Buttons */}
				<ActionsContainer>
					<CopyButton text={shortUrl.short_url} />
					<ShareActions url={shortUrl.short_url} />
				</ActionsContainer>
			</UrlDisplayContainer>

			{/* Additional Actions */}
			{onCreateAnother && (
				<AdditionalActionsContainer>
					<CreateAnotherButton
						variant="outlined"
						onClick={onCreateAnother}
					>
						Criar Outro Link
					</CreateAnotherButton>
				</AdditionalActionsContainer>
			)}
		</ResultContainer>
	);
}

export default ShortUrlResult;
