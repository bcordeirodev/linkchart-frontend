import { Alert, TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useState } from 'react';
import { getSessionRedirectUrl, resetSessionRedirectUrl } from '@fuse/core/FuseAuthorization/sessionRedirectUrl';
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
				placeholder="Digite seu email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				fullWidth
				variant="outlined"
				sx={{
					'& .MuiOutlinedInput-root': {
						borderRadius: '12px',
						backgroundColor: alpha('#ffffff', 0.08),
						backdropFilter: 'blur(10px)',
						border: `1px solid ${alpha('#ffffff', 0.15)}`,
						transition: 'all 0.3s ease',
						'& fieldset': {
							border: 'none'
						},
						'&:hover': {
							backgroundColor: alpha('#ffffff', 0.12),
							borderColor: alpha('#ffffff', 0.25),
							transform: 'translateY(-2px)',
							boxShadow: `0 8px 25px ${alpha('#000000', 0.15)}`
						},
						'&.Mui-focused': {
							backgroundColor: alpha('#ffffff', 0.15),
							borderColor: theme.palette.primary.main,
							boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`
						}
					},
					'& .MuiInputBase-input': {
						color: 'white',
						fontSize: '1rem',
						padding: '14px 16px',
						'&::placeholder': {
							color: alpha('#ffffff', 0.6),
							opacity: 1
						}
					}
				}}
			/>
			<TextField
				type="password"
				placeholder="Digite sua senha"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
				fullWidth
				variant="outlined"
				sx={{
					'& .MuiOutlinedInput-root': {
						borderRadius: '12px',
						backgroundColor: alpha('#ffffff', 0.08),
						backdropFilter: 'blur(10px)',
						border: `1px solid ${alpha('#ffffff', 0.15)}`,
						transition: 'all 0.3s ease',
						'& fieldset': {
							border: 'none'
						},
						'&:hover': {
							backgroundColor: alpha('#ffffff', 0.12),
							borderColor: alpha('#ffffff', 0.25),
							transform: 'translateY(-2px)',
							boxShadow: `0 8px 25px ${alpha('#000000', 0.15)}`
						},
						'&.Mui-focused': {
							backgroundColor: alpha('#ffffff', 0.15),
							borderColor: theme.palette.primary.main,
							boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`
						}
					},
					'& .MuiInputBase-input': {
						color: 'white',
						fontSize: '1rem',
						padding: '14px 16px',
						'&::placeholder': {
							color: alpha('#ffffff', 0.6),
							opacity: 1
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
					borderRadius: '12px',
					padding: '14px 24px',
					fontSize: '1rem',
					fontWeight: 600,
					background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
					color: 'white',
					textTransform: 'none',
					boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
					transition: 'all 0.3s ease',
					'&:hover': {
						background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
						boxShadow: '0 12px 35px rgba(25, 118, 210, 0.4)',
						transform: 'translateY(-2px)'
					},
					'&:active': {
						transform: 'translateY(0px)',
						boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)'
					},
					'&:disabled': {
						background: alpha('#ffffff', 0.1),
						color: alpha('#ffffff', 0.5),
						boxShadow: 'none',
						transform: 'none'
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

			<Typography
				variant="body2"
				sx={{
					textAlign: 'center',
					color: alpha('#ffffff', 0.7),
					fontSize: '0.875rem',
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