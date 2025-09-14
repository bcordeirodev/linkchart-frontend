import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorLayout } from '@/shared/layout';
import useUser from '../lib/auth/useUser';

/**
 * Enhanced Error404Page component with smart navigation suggestions.
 */
function NotFoundPage() {
	const { data: user } = useUser();
	const location = useLocation();
	const isAuthenticated = !!user;
	const [suggestions, setSuggestions] = useState<{ label: string; href: string }[]>([]);

	// Generate navigation suggestions based on current path
	useEffect(() => {
		const pathSegments = location.pathname.split('/').filter(Boolean);
		const suggestionList: { label: string; href: string }[] = [];

		if (isAuthenticated) {
			suggestionList.push({ label: 'Analytics', href: '/analytics' }, { label: 'Meus Links', href: '/link' });

			// Suggest parent paths
			if (pathSegments.length > 1) {
				suggestionList.push({ label: 'Seção Principal', href: `/${pathSegments[0]}` });
			}
		} else {
			suggestionList.push({ label: 'Encurtador', href: '/shorter' });
		}

		setSuggestions(suggestionList);
	}, [location.pathname, isAuthenticated]);

	return (
		<ErrorLayout
			errorType="404"
			suggestions={suggestions}
		>
			<Typography
				variant="h1"
				sx={{
					fontSize: { xs: '4rem', sm: '6rem', md: '8rem' },
					fontWeight: 'bold',
					mb: 2,
					background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
					backgroundClip: 'text',
					WebkitBackgroundClip: 'text',
					color: 'transparent'
				}}
			>
				404
			</Typography>
			<Typography
				variant="h4"
				sx={{
					mb: 2,
					fontWeight: 600,
					color: 'text.primary'
				}}
			>
				Página não encontrada
			</Typography>
			<Typography
				variant="body1"
				sx={{
					mb: 4,
					color: 'text.secondary',
					maxWidth: 500,
					mx: 'auto'
				}}
			>
				A página que você está procurando não existe ou foi movida para outro local.
			</Typography>
		</ErrorLayout>
	);
}

export default NotFoundPage;
