import { Box, Button, lighten, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import { authJsProviderMap } from '@auth/authJs';

const providerLogoPath = 'https://authjs.dev/img/providers';

function AuthJsProviderSelect() {
	// Debug: verificar providers disponíveis
	console.log('🔍 AuthJsProviderSelect - Providers disponíveis:', authJsProviderMap);

	function handleSignIn(providerId: string) {
		try {
			console.log('🚀 Iniciando login com provider:', providerId);
			signIn(providerId, { callbackUrl: '/dashboard' });
		} catch (error) {
			console.error('❌ Erro no login: ', error);
		}
	}

	if (authJsProviderMap?.length === 0) {
		console.warn('⚠️ Nenhum provider disponível');
		return null;
	}

	return (
		<div className="w-full">
			<div className="flex items-center mb-8">
				<div className="mt-px flex-auto border-t" />
				<Typography
					className="mx-2"
					color="text.secondary"
				>
					Or continue with
				</Typography>
				<div className="mt-px flex-auto border-t" />
			</div>
			<div className="flex flex-col gap-3">
				{Object.values(authJsProviderMap)
					.filter((provider) => provider.id !== 'credentials')
					.map((provider) => (
						<Button
							key={provider.id}
							className="flex items-between text-md"
							onClick={() => handleSignIn(provider.id)}
							size="large"
							sx={(theme) => ({
								backgroundColor: theme.palette.background.default,
								color: theme.palette.text.primary,
								'&:hover': {
									color: provider?.style?.text || theme.palette.secondary.contrastText,
									backgroundColor: provider?.style?.bg || theme.palette.secondary.main,
									'& .provider-icon': {
										backgroundColor: provider?.style?.bg
											? lighten(provider?.style?.bg, 0.7)
											: theme.palette.secondary.light
									}
								}
							})}
							endIcon={
								<Box className="provider-icon rounded-full flex items-center justify-center w-8 h-8">
									<img
										className="flex w-4 h-auto"
										src={`${providerLogoPath}/${provider.id}.svg`}
										alt={provider.name}
									/>
								</Box>
							}
						>
							<span className="flex flex-1">Sign in with {provider.name}</span>
						</Button>
					))}
				{/* <Button
					className="text-md"
					href="https://authjs.dev/getting-started#official-providers"
					target="_blank"
				>
					+ more auth providers
				</Button> */}
			</div>
		</div>
	);
}

export default AuthJsProviderSelect;
