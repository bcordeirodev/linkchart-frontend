import { Alert, TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useState } from 'react';
import { getSessionRedirectUrl, resetSessionRedirectUrl } from '@/lib/auth/sessionRedirectUrl';
import { alpha, useTheme } from '@mui/material/styles';

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
			CredentialsSignin: 'Credenciais inválidas',
			AccessDenied: 'Acesso negado',
			Verification: 'Verificação necessária',
			default: 'Ocorreu um erro durante a autenticação'
		};
		return errorMessages[errorType] || errorMessages.default;
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
			{error && (
				<Alert
					severity="error"
					sx={(theme) => ({
						backgroundColor: theme.palette.error.light,
						color: theme.palette.error.dark,
						borderRadius: '12px',
						'& .MuiAlert-icon': {
							color: theme.palette.error.main
						}
					})}
				>
					{error}
				</Alert>
			)}
			{formType === 'signin' && <SimpleSignInForm onLogin={login} />}
			{formType === 'signup' && <SimpleSignUpForm />}
		</Box>
	);
}

// Componente simplificado de login
function SimpleSignInForm({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const theme = useTheme();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await onLogin(email, password);

			// Navegação após login bem-sucedido
			const redirectUrl = getSessionRedirectUrl();
			const targetUrl = redirectUrl || '/analytics';

			resetSessionRedirectUrl();
			navigate(targetUrl);
		} catch (error) {
			// Error handling
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
		>
			<TextField
				type="email"
				label="Email"
				placeholder="Digite seu email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				fullWidth
				variant="outlined"
			/>
			<TextField
				type="password"
				label="Senha"
				placeholder="Digite sua senha"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
				fullWidth
				variant="outlined"
			/>
			<Button
				type="submit"
				disabled={loading}
				fullWidth
				variant="contained"
				size="large"
			>
				{loading ? (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<CircularProgress
							size={20}
							sx={{ color: 'white' }}
						/>
						<Typography variant="body2">Entrando...</Typography>
					</Box>
				) : (
					'Entrar'
				)}
			</Button>

			<Typography
				variant="body2"
				sx={{
					textAlign: 'center',
					color: 'text.secondary',
					mt: 1
				}}
			>
				Acesse sua conta para gerenciar seus links
			</Typography>
		</Box>
	);
}

// Componente simplificado de cadastro
function SimpleSignUpForm() {
	return (
		<Box sx={{ textAlign: 'center', p: 4 }}>
			<Typography
				variant="body2"
				sx={{ color: alpha('#ffffff', 0.7) }}
			>
				Funcionalidade de cadastro será implementada em breve.
			</Typography>
		</Box>
	);
}

export default AuthJsForm;
