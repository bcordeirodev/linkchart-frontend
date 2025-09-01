import Typography from '@mui/material/Typography';
import { Link } from '@/shared/components';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AuthJsForm from '../lib/auth/forms/AuthJsForm';
import { SvgIcon } from '@/shared/components';
import { alpha } from '@mui/material/styles';
import authRoles from '../lib/auth/authRoles';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';

/**
 * The sign in page - Enhanced modern design (Compact Version)
 */
function SignInPage() {
	return (
		<AuthGuardRedirect auth={authRoles.onlyGuest}>
			<Box
				sx={{
					minHeight: '100vh',
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					background: 'linear-gradient(135deg, #0A74DA 0%, #0D47A1 50%, #002171 100%)',
					overflow: 'hidden'
				}}
			>
				{/* Login Form Section */}
				<Box
					sx={{
						flex: { xs: 1, md: '0 0 45%' },
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						p: { xs: 3, sm: 4, md: 6 },
						position: 'relative',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: `radial-gradient(ellipse at top left, ${alpha('#0A74DA', 0.1)} 0%, transparent 50%)`,
							pointerEvents: 'none'
						}
					}}
				>
					<Paper
						elevation={24}
						sx={{
							width: '100%',
							maxWidth: 440,
							p: { xs: 3, sm: 4, md: 5 },
							background: alpha('#ffffff', 0.95),
							backdropFilter: 'blur(20px)',
							border: `1px solid ${alpha('#ffffff', 0.1)}`,
							borderRadius: 3,
							position: 'relative',
							overflow: 'hidden',
							boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								height: '1px',
								background:
									'linear-gradient(90deg, transparent 0%, rgba(10, 116, 218, 0.5) 50%, transparent 100%)'
							}
						}}
					>
						{/* Logo and Brand - Compacto */}
						<Box sx={{ mb: 3, textAlign: 'center' }}>
							<Box
								sx={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 2,
									mb: 2
								}}
							>
								<Box
									sx={{
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center',
										width: 64,
										height: 64,
										borderRadius: 2,
										background: 'linear-gradient(135deg, #0A74DA 0%, #0D47A1 100%)',
										boxShadow: '0 8px 24px rgba(10, 116, 218, 0.3)',
										transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
										'&:hover': {
											transform: 'scale(1.05)'
										}
									}}
								>
									<SvgIcon
										size={24}
										sx={{ color: 'white' }}
									>
										heroicons-outline:link
									</SvgIcon>
								</Box>

								<Typography
									variant="h5"
									sx={{
										fontWeight: 700,
										color: '#212121',
										fontSize: '1.5rem',
										letterSpacing: '-0.02em'
									}}
								>
									Link Chart
								</Typography>
							</Box>

							<Typography
								variant="h4"
								sx={{
									fontWeight: 600,
									color: '#212121',
									mb: 1,
									fontSize: { xs: '1.5rem', sm: '1.75rem' },
									lineHeight: 1.3
								}}
							>
								Bem-vindo de volta
							</Typography>

							<Typography
								variant="body1"
								sx={{
									color: '#5F6368',
									fontSize: '1rem',
									lineHeight: 1.6
								}}
							>
								Acesse sua conta e otimize seus links!!!!
							</Typography>
						</Box>

						{/* Login Form */}
						<AuthJsForm formType="signin" />

						{/* Sign Up Link */}
						<Box
							sx={{
								mt: 3,
								pt: 2,
								borderTop: `1px solid ${alpha('#ffffff', 0.1)}`,
								textAlign: 'center'
							}}
						>
							<Typography
								variant="body2"
								sx={{ color: alpha('#ffffff', 0.7) }}
							>
								Não possui uma conta??{' '}
								<Link
									to="/sign-up"
									sx={{
										color: '#3b82f6',
										fontWeight: 600,
										textDecoration: 'none',
										transition: 'all 0.2s ease',
										'&:hover': {
											color: '#60a5fa',
											textDecoration: 'underline'
										}
									}}
								>
									Criar conta gratuita
								</Link>
							</Typography>
						</Box>
					</Paper>
				</Box>

				{/* Hero Section */}
				<Box
					sx={{
						flex: { xs: 0, md: '0 0 55%' },
						display: { xs: 'none', md: 'flex' },
						alignItems: 'center',
						justifyContent: 'center',
						p: 6,
						position: 'relative',
						background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 50%, #581c87 100%)',
						overflow: 'hidden',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: `radial-gradient(ellipse at center, ${alpha('#ffffff', 0.1)} 0%, transparent 70%)`,
							pointerEvents: 'none'
						}
					}}
				>
					{/* Animated Background Elements */}
					<Box
						sx={{
							position: 'absolute',
							width: 200,
							height: 200,
							top: '20%',
							left: '10%',
							borderRadius: '50%',
							background: `radial-gradient(circle, ${alpha('#60a5fa', 0.2)} 0%, transparent 70%)`,
							animation: 'pulse 4s ease-in-out infinite'
						}}
					/>
					<Box
						sx={{
							position: 'absolute',
							width: 150,
							height: 150,
							bottom: '30%',
							right: '15%',
							borderRadius: '50%',
							background: `radial-gradient(circle, ${alpha('#a78bfa', 0.15)} 0%, transparent 70%)`,
							animation: 'pulse 4s ease-in-out infinite 2s'
						}}
					/>

					{/* Floating Elements */}
					{[
						{ icon: 'heroicons-outline:link', top: '15%', left: '15%', delay: '0s', color: '#60a5fa' },
						{
							icon: 'heroicons-outline:chart-bar',
							top: '25%',
							right: '20%',
							delay: '1s',
							color: '#a78bfa'
						},
						{
							icon: 'heroicons-outline:cursor-arrow-rays',
							bottom: '35%',
							left: '20%',
							delay: '2s',
							color: '#34d399'
						},
						{
							icon: 'heroicons-outline:globe-alt',
							bottom: '20%',
							right: '25%',
							delay: '3s',
							color: '#fbbf24'
						}
					].map((item, index) => (
						<Box
							key={index}
							sx={{
								position: 'absolute',
								...item,
								width: 48,
								height: 48,
								borderRadius: 2,
								background: `linear-gradient(135deg, ${alpha(item.color, 0.2)} 0%, ${alpha(item.color, 0.05)} 100%)`,
								backdropFilter: 'blur(10px)',
								border: `1px solid ${alpha(item.color, 0.2)}`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								animation: `float 6s ease-in-out infinite ${item.delay}`,
								'@keyframes float': {
									'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
									'50%': { transform: 'translateY(-20px) rotate(5deg)' }
								}
							}}
						>
							<SvgIcon
								size={24}
								sx={{ color: item.color }}
							>
								{item.icon}
							</SvgIcon>
						</Box>
					))}

					{/* Main Content */}
					<Box sx={{ textAlign: 'center', zIndex: 10, maxWidth: 600 }}>
						<Typography
							variant="h1"
							sx={{
								fontSize: { xs: '3rem', md: '4rem', lg: '4.5rem' },
								fontWeight: 900,
								lineHeight: 1.1,
								mb: 3,
								background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)',
								backgroundClip: 'text',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent'
							}}
						>
							Transforme seus{' '}
							<Box
								component="span"
								sx={{
									background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%)',
									backgroundClip: 'text',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent'
								}}
							>
								links em resultados
							</Box>
						</Typography>

						<Typography
							variant="h5"
							sx={{
								color: alpha('#ffffff', 0.9),
								lineHeight: 1.6,
								mb: 6,
								fontWeight: 400,
								maxWidth: 500,
								mx: 'auto'
							}}
						>
							Gerencie, monitore e otimize todos os seus links em um só lugar. Analytics completos em
							tempo real.
						</Typography>

						{/* Feature Cards */}
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: 'repeat(3, 1fr)',
								gap: 4,
								mt: 6
							}}
						>
							{[
								{
									icon: 'heroicons-outline:link',
									title: 'Gerenciamento',
									description: 'Organize seus links de forma intuitiva',
									color: '#60a5fa'
								},
								{
									icon: 'heroicons-outline:chart-bar',
									title: 'Analytics',
									description: 'Performance e métricas em tempo real',
									color: '#a78bfa'
								},
								{
									icon: 'heroicons-outline:shield-check',
									title: 'Segurança',
									description: 'Controle e proteção avançada',
									color: '#34d399'
								}
							].map((feature, index) => (
								<Box
									key={index}
									sx={{
										textAlign: 'center',
										p: 3,
										borderRadius: 2,
										background: `linear-gradient(135deg, ${alpha('#ffffff', 0.1)} 0%, ${alpha('#ffffff', 0.02)} 100%)`,
										backdropFilter: 'blur(10px)',
										border: `1px solid ${alpha('#ffffff', 0.1)}`,
										transition: 'all 0.3s ease',
										'&:hover': {
											transform: 'translateY(-8px)',
											background: `linear-gradient(135deg, ${alpha('#ffffff', 0.15)} 0%, ${alpha('#ffffff', 0.05)} 100%)`,
											border: `1px solid ${alpha(feature.color, 0.3)}`
										}
									}}
								>
									<Box
										sx={{
											width: 56,
											height: 56,
											borderRadius: 2,
											background: `linear-gradient(135deg, ${alpha(feature.color, 0.2)} 0%, ${alpha(feature.color, 0.05)} 100%)`,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											mx: 'auto',
											mb: 2,
											border: `1px solid ${alpha(feature.color, 0.2)}`
										}}
									>
										<SvgIcon
											size={28}
											sx={{ color: feature.color }}
										>
											{feature.icon}
										</SvgIcon>
									</Box>

									<Typography
										variant="h6"
										sx={{
											color: 'white',
											fontWeight: 700,
											mb: 1
										}}
									>
										{feature.title}
									</Typography>

									<Typography
										variant="body2"
										sx={{
											color: alpha('#ffffff', 0.8),
											lineHeight: 1.5
										}}
									>
										{feature.description}
									</Typography>
								</Box>
							))}
						</Box>
					</Box>

					{/* Global Styles for Animations */}
					<style>{`
						@keyframes pulse {
							0%, 100% { transform: scale(1); opacity: 0.3; }
							50% { transform: scale(1.1); opacity: 0.1; }
						}
						@keyframes float {
							0%, 100% { transform: translateY(0px) rotate(0deg); }
							50% { transform: translateY(-20px) rotate(5deg); }
						}
					`}</style>
				</Box>
			</Box>
		</AuthGuardRedirect>
	);
}

export default SignInPage;
