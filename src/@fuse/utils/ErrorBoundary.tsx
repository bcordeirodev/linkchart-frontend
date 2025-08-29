import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
	children?: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, error, errorInfo: null };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// Log detalhado do erro no console
		this.setState({ error, errorInfo });

		// Console logging detalhado
		console.group('🚨 ErrorBoundary - Erro Capturado');
		console.error('Erro:', error);
		console.error('Stack Trace:', error.stack);
		console.error('Component Stack:', errorInfo.componentStack);
		console.error('Timestamp:', new Date().toISOString());
		console.error('URL:', window.location.href);
		console.error('User Agent:', navigator.userAgent);
		console.groupEnd();

		// Log para o sistema de monitoramento se disponível
		// (removido para simplificar)
	}

	render() {
		const { children = null } = this.props;
		const { hasError } = this.state;

		if (hasError) {
			// Log adicional no console para facilitar debugging
			console.error('🔴 ErrorBoundary capturou erro - verifique o console acima');

			// Retorna null para não renderizar nada na tela
			// O erro fica apenas no console
			return null;
		}

		return children;
	}
}

export default ErrorBoundary;
