import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import { Link } from '@/shared/components';

/**
 * The sign out page.
 */
function SignOutPage() {
	const { t } = useTranslation('auth');

	return (
		<Box
			sx={{
				display: 'flex',
				minWidth: 0,
				flex: '1 1 auto',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: { sm: 'center' }
			}}
		>
			<Paper
				sx={{
					display: 'flex',
					alignItems: 'center',
					minHeight: { xs: '100%', sm: 'auto' },
					width: { xs: '100%', sm: 'auto' },
					px: { xs: 2, sm: 6 },
					py: { xs: 4, sm: 6 },
					borderRadius: { xs: 0, sm: 3 },
					boxShadow: { sm: 1 }
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						width: { xs: '100%', sm: 320 },
						maxWidth: 320,
						mx: { xs: 'auto', sm: 0 }
					}}
				>
					<Box
						component='img'
						src='/assets/images/logo/logo.svg'
						alt='logo'
						sx={{ width: 48, mx: 'auto' }}
					/>

					<Typography
						sx={{
							mt: 4,
							textAlign: 'center',
							fontSize: '2.25rem',
							fontWeight: 800,
							lineHeight: 1.25,
							letterSpacing: '-0.025em'
						}}
					>
						{t('signOut.signingOut')}
					</Typography>

					<Typography
						sx={{ mt: 4, fontWeight: 500 }}
						color='text.secondary'
					>
						<span>{t('signOut.redirecting')}</span>
						<Link
							to='/sign-in'
							sx={{
								color: 'primary.main',
								ml: 0.5,
								'&:hover': { textDecoration: 'underline' }
							}}
						>
							sign in
						</Link>
					</Typography>
				</Box>
			</Paper>
		</Box>
	);
}

export default SignOutPage;
