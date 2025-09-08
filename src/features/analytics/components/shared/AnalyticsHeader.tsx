import { Box } from '@mui/material';
import { createPresetAnimations } from '@/lib/theme';
import { useTheme } from '@mui/material/styles';
import { Header } from '../Header';

interface AnalyticsHeaderProps {
	variant?: 'dashboard' | 'analytics';
	title?: string;
	subtitle?: string;
	onRefresh?: () => void;
	onDownload?: () => void;
	onShare?: () => void;
	loading?: boolean;
}

export function AnalyticsHeader({
	variant = 'analytics',
	title = 'Analytics Dashboard',
	subtitle = 'Análise detalhada e insights de performance dos seus links',
	onRefresh,
	onDownload,
	onShare,
	loading = false
}: AnalyticsHeaderProps) {
	const theme = useTheme();
	const animations = createPresetAnimations(theme);

	return (
		<Box sx={{ ...animations.fadeIn }}>
			<Header
				variant={variant}
				title={title}
				subtitle={subtitle}
				onRefresh={onRefresh}
				onDownload={onDownload}
				onShare={onShare}
				loading={loading}
			/>
		</Box>
	);
}

export default AnalyticsHeader;
