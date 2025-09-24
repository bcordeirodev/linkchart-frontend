import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { enUS } from 'date-fns/locale/en-US';
import { SnackbarProvider } from 'notistack';
import { useMemo, useEffect } from 'react';
import { Provider } from 'react-redux';

import { ErrorBoundary } from '@/lib/utils';
import { Message } from '@/shared/components/Message';
import { LayoutProvider } from '@/shared/layout/core';

import AppRouter from './AppRouter';
import AppContext from './lib/AppContext';
import { AuthProvider } from './lib/auth/AuthContext';
import store from './lib/store/store';
import { applyGlobalStyles, MainThemeProvider } from './lib/theme';

/**
 * The main App component.
 */
function App() {
	const val = useMemo(() => ({}), []);

	// Aplicar estilos globais padronizados quando o componente montar
	useEffect(() => {
		applyGlobalStyles();
	}, []);

	return (
		<ErrorBoundary>
			<AppContext.Provider value={val}>
				{/* Date Picker Localization Provider */}
				<LocalizationProvider
					dateAdapter={AdapterDateFns}
					adapterLocale={enUS}
				>
					{/* Redux Store Provider */}
					<Provider store={store}>
						{/* Auth Provider */}
						<AuthProvider>
							<LayoutProvider>
								{/* Theme Provider */}
								<MainThemeProvider>
									{/* Notistack Notification Provider */}
									<SnackbarProvider
										maxSnack={5}
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'right'
										}}
										classes={{
											containerRoot: 'bottom-0 right-0 mb-13 md:mb-17 mr-2 lg:mr-20 z-99'
										}}
									>
										<AppRouter />
										{/* Global Message Component - Renderizado fora do layout */}
										<Message />
									</SnackbarProvider>
								</MainThemeProvider>
							</LayoutProvider>
						</AuthProvider>
					</Provider>
				</LocalizationProvider>
			</AppContext.Provider>
		</ErrorBoundary>
	);
}

export default App;
