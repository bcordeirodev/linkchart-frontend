import { Alert, TextField, Button, Box, Typography, CircularProgress, Link } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useState } from 'react';
import { getSessionRedirectUrl, resetSessionRedirectUrl } from '@/lib/auth/sessionRedirectUrl';
import { alpha } from '@mui/material/styles';
import { useAppDispatch } from '@/lib/store/hooks';
import { showSuccessMessage, showErrorMessage } from '@/lib/store/messageSlice';

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
					sx={{
						backgroundColor: alpha('#f44336', 0.1),
						color: '#d32f2f',
						borderRadius: 2,
						border: `1px solid ${alpha('#f44336', 0.2)}`,
						'& .MuiAlert-icon': {
							color: '#d32f2f'
						}
					}}
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
	const dispatch = useAppDispatch();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validação básica
		if (!email || !password) {
			dispatch(showErrorMessage('Por favor, preencha todos os campos'));
			return;
		}

		setLoading(true);
		try {
			await onLogin(email, password);

			// Sucesso no login
			dispatch(showSuccessMessage('Login realizado com sucesso! Redirecionando...'));

			// Navegação após login bem-sucedido
			const redirectUrl = getSessionRedirectUrl();
			const targetUrl = redirectUrl || '/links';

			resetSessionRedirectUrl();

			// Pequeno delay para mostrar a mensagem de sucesso
			setTimeout(() => {
				navigate(targetUrl);
			}, 1000);
		} catch (error: unknown) {
			// Tratamento de erro melhorado
			let errorMessage = 'Erro ao fazer login. Tente novamente.';

			if (error && typeof error === 'object' && 'message' in error) {
				errorMessage = (error as { message: string }).message;
			} else if (typeof error === 'string') {
				errorMessage = error;
			}

			dispatch(showErrorMessage(errorMessage));
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
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
				sx={{
					'& .MuiOutlinedInput-root': {
						borderRadius: 2,
						backgroundColor: '#ffffff',
						'& input': {
							color: '#212121',
							'&::placeholder': {
								color: '#5F6368',
								opacity: 1
							}
						},
						'& fieldset': {
							borderColor: alpha('#000000', 0.2)
						},
						'&:hover fieldset': {
							borderColor: '#0A74DA'
						},
						'&.Mui-focused fieldset': {
							borderColor: '#0A74DA'
						}
					},
					'& .MuiInputLabel-root': {
						color: '#5F6368',
						'&.Mui-focused': {
							color: '#0A74DA'
						}
					}
				}}
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
				sx={{
					'& .MuiOutlinedInput-root': {
						borderRadius: 2,
						backgroundColor: '#ffffff',
						'& input': {
							color: '#212121',
							'&::placeholder': {
								color: '#5F6368',
								opacity: 1
							}
						},
						'& fieldset': {
							borderColor: alpha('#000000', 0.2)
						},
						'&:hover fieldset': {
							borderColor: '#0A74DA'
						},
						'&.Mui-focused fieldset': {
							borderColor: '#0A74DA'
						}
					},
					'& .MuiInputLabel-root': {
						color: '#5F6368',
						'&.Mui-focused': {
							color: '#0A74DA'
						}
					}
				}}
			/>
			<Button
				type="submit"
				disabled={loading}
				fullWidth
				variant="contained"
				size="large"
				sx={{
					mt: 2,
					py: 1.5,
					borderRadius: 2,
					fontSize: '1.1rem',
					fontWeight: 600,
					textTransform: 'none',
					background: 'linear-gradient(135deg, #0A74DA 0%, #0D47A1 100%)',
					'&:hover': {
						background: 'linear-gradient(135deg, #0D47A1 0%, #002171 100%)'
					},
					'&:disabled': {
						background: '#E0E0E0'
					}
				}}
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

			{/* Link para recuperação de senha */}
			<Box sx={{ textAlign: 'center', mt: 2 }}>
				<Link
					href="/forgot-password"
					sx={{
						color: '#0A74DA',
						textDecoration: 'none',
						fontSize: '0.9rem',
						'&:hover': {
							textDecoration: 'underline'
						}
					}}
				>
					Esqueci minha senha
				</Link>
			</Box>
		</Box>
	);
}

// Componente simplificado de cadastro
function SimpleSignUpForm() {
	return (
		<Box sx={{ textAlign: 'center', p: { xs: 2, sm: 3, md: 4 } }}>
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
