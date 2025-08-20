'use client';

import { useState } from 'react';
import {
	Box,
	Typography,
	Button,
	Alert,
	Card,
	CardContent,
	Switch,
	FormControlLabel
} from '@mui/material';
import { ArrowBack, Analytics } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/utilities/PageBreadcrumb';
import { EnhancedAnalytics, DebugAnalytics } from '@/components/unified-analytics';
interface LinkAnalyticsProps {
	id: string;
}

function LinkAnalytics({ id }: LinkAnalyticsProps) {
	const router = useRouter();
	const [useEnhanced, setUseEnhanced] = useState(true);
	const [useDebug, setUseDebug] = useState(false);

	if (useDebug) {
		return <DebugAnalytics linkId={id} />;
	}

	if (useEnhanced) {
		return <EnhancedAnalytics linkId={id} />;
	}

	// Fallback para analytics básico (código anterior mantido como backup)
	return (
		<Box sx={{ p: 3 }}>
			{/* <PageBreadcrumb skipHome /> */}

			<Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<Box>
					<Typography variant="h4" component="h1" gutterBottom>
						Analytics do Link
					</Typography>
					<FormControlLabel
						control={
							<Switch
								checked={useEnhanced}
								onChange={(e) => setUseEnhanced(e.target.checked)}
							/>
						}
						label="Analytics Avançados"
					/>
					<FormControlLabel
						control={
							<Switch
								checked={useDebug}
								onChange={(e) => setUseDebug(e.target.checked)}
							/>
						}
						label="Debug Mode"
					/>
				</Box>
				<Button
					variant="outlined"
					startIcon={<ArrowBack />}
					onClick={() => router.push('/link')}
				>
					Voltar para Lista
				</Button>
			</Box>

			<Card>
				<CardContent sx={{ textAlign: 'center', py: 6 }}>
					<Analytics sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
					<Typography variant="h5" gutterBottom>
						Analytics Básicos
					</Typography>
					<Typography color="text.secondary">
						Ative os "Analytics Avançados" para ver mapas de calor, insights geográficos e muito mais!
					</Typography>
				</CardContent>
			</Card>
		</Box>
	);
}

export default LinkAnalytics;
