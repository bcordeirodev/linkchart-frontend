/**
 * Error Boundary para captura de erros React
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper, Alert, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ErrorOutline, Refresh, ExpandMore, BugReport } from '@mui/icons-material';

interface ErrorBoundaryProps {
	children?: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
	/** Se deve mostrar interface de erro ou apenas logar */
	showErrorUI?: boolean;
	/** Mensagem personalizada de erro */
	fallbackMessage?: string;
}

/**
 * Estado do ErrorBoundary
 */
interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
	errorId: string;
}

/**
 * Componente de interface de erro
 */
function ErrorFallback({
	error,
	errorInfo,
	errorId,
	onRetry,
	fallbackMessage
}: {
	error: Error;
	errorInfo: ErrorInfo;
	errorId: string;
	onRetry: () => void;
	fallbackMessage?: string;
}) {
	const isDevelopment = process.env.NODE_ENV === 'development';

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '400px',
				p: 4,
				textAlign: 'center'
			}}
		>
			<Paper
				elevation={3}
				sx={{
					p: 4,
					maxWidth: 600,
					width: '100%'
				}}
			>
				<ErrorOutline
					sx={{
						fontSize: 64,
						color: 'error.main',
						mb: 2
					}}
				/>

				<Typography
					variant="h5"
					gutterBottom
					color="error"
				>
					Oops! Algo deu errado
				</Typography>

				<Typography
					variant="body1"
					color="text.secondary"
					paragraph
				>
					{fallbackMessage ||
						'Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.'}
				</Typography>

				<Alert
					severity="info"
					sx={{ mb: 3, textAlign: 'left' }}
				>
					<Typography variant="body2">
						<strong>ID do Erro:</strong> {errorId}
						<br />
						<strong>Horário:</strong> {new Date().toLocaleString()}
					</Typography>
				</Alert>

				<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
					<Button
						variant="contained"
						startIcon={<Refresh />}
						onClick={onRetry}
						color="primary"
					>
						Tentar Novamente
					</Button>

					<Button
						variant="outlined"
						onClick={() => window.location.reload()}
						color="secondary"
					>
						Recarregar Página
					</Button>
				</Box>

				{isDevelopment && (
					<Accordion sx={{ textAlign: 'left' }}>
						<AccordionSummary expandIcon={<ExpandMore />}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<BugReport fontSize="small" />
								<Typography variant="subtitle2">Detalhes do Erro (Desenvolvimento)</Typography>
							</Box>
						</AccordionSummary>
						<AccordionDetails>
							<Typography
								variant="body2"
								component="pre"
								sx={{
									whiteSpace: 'pre-wrap',
									fontSize: '0.75rem',
									backgroundColor: 'grey.100',
									p: 2,
									borderRadius: 1,
									overflow: 'auto',
									maxHeight: 300
								}}
							>
								<strong>Erro:</strong> {error.message}
								{'\n\n'}
								<strong>Stack Trace:</strong>
								{'\n'}
								{error.stack}
								{'\n\n'}
								<strong>Component Stack:</strong>
								{'\n'}
								{errorInfo.componentStack}
							</Typography>
						</AccordionDetails>
					</Accordion>
				)}
			</Paper>
		</Box>
	);
}

/**
 * Error Boundary melhorado
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
			errorId: ''
		};
	}

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		return {
			hasError: true,
			error,
			errorInfo: null,
			errorId
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		this.setState({
			error,
			errorInfo,
			errorId
		});

		// Logging detalhado no console
		console.group('🚨 ErrorBoundary - Erro Capturado');
		console.error('ID do Erro:', errorId);
		console.error('Erro:', error);
		console.error('Mensagem:', error.message);
		console.error('Stack Trace:', error.stack);
		console.error('Component Stack:', errorInfo.componentStack);
		console.error('Timestamp:', new Date().toISOString());
		console.error('URL:', window.location.href);
		console.error('User Agent:', navigator.userAgent);
		console.groupEnd();

		// Callback personalizado
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}

		// Aqui você pode integrar com serviços de monitoramento
		// como Sentry, LogRocket, etc.
		if (process.env.NODE_ENV === 'production') {
			// Exemplo: Sentry.captureException(error, { contexts: { errorInfo } });
		}
	}

	handleRetry = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
			errorId: ''
		});
	};

	render() {
		const { children, showErrorUI = true, fallbackMessage } = this.props;
		const { hasError, error, errorInfo, errorId } = this.state;

		if (hasError) {
			// Se não deve mostrar UI de erro, retorna null
			if (!showErrorUI) {
				console.error('🔴 ErrorBoundary capturou erro - verifique o console acima');
				return null;
			}

			// Mostra interface de erro amigável
			if (error && errorInfo) {
				return (
					<ErrorFallback
						error={error}
						errorInfo={errorInfo}
						errorId={errorId}
						onRetry={this.handleRetry}
						fallbackMessage={fallbackMessage}
					/>
				);
			}
		}

		return children || null;
	}
}

export default ErrorBoundary;
