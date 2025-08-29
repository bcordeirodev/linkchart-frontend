import { Alert } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useState } from 'react';
import { getSessionRedirectUrl, resetSessionRedirectUrl } from '@fuse/core/FuseAuthorization/sessionRedirectUrl';

type AuthJsFormProps = { formType: 'signin' | 'signup' };

function AuthJsForm(props: AuthJsFormProps) {
	const { formType = 'signin' } = props;
	const { login } = useAuth();
	const [searchParams] = useSearchParams();

	const errorType = searchParams.get('error');
	const error = errorType && getErrorMessage(errorType);

	// Função para obter mensagens de erro
	function getErrorMessage(errorType: string): string {
		const errorMessages: Record<string, string> = {
			'CredentialsSignin': 'Credenciais inválidas',
			'AccessDenied': 'Acesso negado',
			'Verification': 'Verificação necessária',
			'default': 'Ocorreu um erro durante a autenticação'
		};
		return errorMessages[errorType] || errorMessages.default;
	}

	return (
		<div className="flex flex-col space-y-8">
			{error && (
				<Alert
					className="mt-4"
					severity="error"
					sx={(theme) => ({
						backgroundColor: theme.palette.error.light,
						color: theme.palette.error.dark
					})}
				>
					{error}
				</Alert>
			)}
			{formType === 'signin' && <SimpleSignInForm onLogin={login} />}
			{formType === 'signup' && <SimpleSignUpForm />}
		</div>
	);
}

// Componente simplificado de login
function SimpleSignInForm({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await onLogin(email, password);

			// Navegação após login bem-sucedido
			const redirectUrl = getSessionRedirectUrl();
			const targetUrl = redirectUrl || '/analytics';

			console.log('🎯 Redirecionando após login para:', targetUrl);
			resetSessionRedirectUrl();
			navigate(targetUrl);

		} catch (error) {
			console.error('Erro no login:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				className="w-full p-3 border rounded"
			/>
			<input
				type="password"
				placeholder="Senha"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
				className="w-full p-3 border rounded"
			/>
			<button
				type="submit"
				disabled={loading}
				className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
			>
				{loading ? 'Entrando...' : 'Entrar'}
			</button>
		</form>
	);
}

// Componente simplificado de cadastro
function SimpleSignUpForm() {
	return (
		<div className="text-center p-4">
			<p>Funcionalidade de cadastro será implementada em breve.</p>
		</div>
	);
}

export default AuthJsForm;
