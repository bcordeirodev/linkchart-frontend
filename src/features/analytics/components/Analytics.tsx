import { Box } from '@mui/material';

import { ResponsiveContainer } from '@/shared/ui/base/ResponsiveContainer';

import { AnalyticsContent } from './shared/AnalyticsContent';
import { AnalyticsHeader } from './shared/AnalyticsHeader';
import { AnalyticsStates } from './shared/AnalyticsStates';

import type { AnalyticsProps } from '@/types/analytics';

/**
 * Componente principal do módulo de analytics com gerenciamento de estados e layout
 */
export function Analytics({
	data,
	loading = false,
	error = null,
	linkId,
	showHeader = true,
	showTabs = true,
	linksData = [],
	showDashboardTab = true
}: AnalyticsProps) {
	if (loading || error) {
		return (
			<ResponsiveContainer
				variant='page'
				maxWidth='xl'
			>
				<AnalyticsStates
					loading={loading}
					error={error}
					hasData
					showHeader={showHeader}
				/>
			</ResponsiveContainer>
		);
	}

	return (
		<Box>
			{showHeader ? (
				<AnalyticsHeader
					variant='analytics'
					title='Analytics Dashboard'
					subtitle='Análise detalhada e insights de performance dos seus links'
				/>
			) : null}

			<AnalyticsContent
				data={data}
				linkId={linkId}
				linksData={linksData}
				showTabs={showTabs}
				showDashboardTab={showDashboardTab}
			/>
		</Box>
	);
}
export const AnalyticsContainer = Analytics;

export default Analytics;
