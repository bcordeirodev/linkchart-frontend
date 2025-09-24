import { Dashboard, Analytics } from '@mui/icons-material';

import { PageHeader } from '@/shared/ui/base/PageHeader';

import { AnalyticsHeaderActions } from './AnalyticsHeaderActions';

interface AnalyticsHeaderProps {
	variant?: 'dashboard' | 'analytics';
	title?: string;
	subtitle?: string;
	onRefresh?: () => void;
	onDownload?: () => void;
	onShare?: () => void;
	loading?: boolean;
}

/**
 * Header Analytics otimizado usando PageHeader unificado
 * Mantém todas as funcionalidades do Header customizado original
 */
export function AnalyticsHeader({
	variant = 'analytics',
	title = 'Analytics Dashboard',
	subtitle = 'Análise detalhada e insights de performance dos seus links',
	onRefresh,
	onDownload,
	onShare,
	loading = false
}: AnalyticsHeaderProps) {
	// Ícones baseados na variante (mantendo lógica original)
	const icons = {
		dashboard: <Dashboard />,
		analytics: <Analytics />
	};

	return (
		<PageHeader
			title={title}
			subtitle={subtitle}
			icon={icons[variant]}
			variant={variant}
			showDecorative
			actions={
				<AnalyticsHeaderActions
					variant={variant}
					onRefresh={onRefresh}
					onDownload={onDownload}
					onShare={onShare}
					loading={loading}
				/>
			}
		/>
	);
}

export default AnalyticsHeader;
