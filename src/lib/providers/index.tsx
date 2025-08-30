import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { enUS } from 'date-fns/locale/en-US';

import { store } from '../store/store';
import { AuthProvider } from '../auth/AuthContext';
import { FuseSettingsProvider } from '@fuse/core/FuseSettings/FuseSettingsProvider';
import { I18nProvider } from '../i18n/I18nProvider';
import { MainThemeProvider } from '../theme';
import ErrorBoundary from '@fuse/utils/ErrorBoundary';

interface ProvidersProps {
    children: ReactNode;
}

/**s
 * 🛠️ PROVIDERS CENTRALIZADOS
 * Todos os providers da aplicação em um local
 */
export function Providers({ children }: ProvidersProps) {
    return (
        <ErrorBoundary>
            <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={enUS}
            >
                <Provider store={store}>
                    <AuthProvider>
                        <FuseSettingsProvider>
                            <I18nProvider>
                                <MainThemeProvider>
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
                                        {children}
                                    </SnackbarProvider>
                                </MainThemeProvider>
                            </I18nProvider>
                        </FuseSettingsProvider>
                    </AuthProvider>
                </Provider>
            </LocalizationProvider>
        </ErrorBoundary>
    );
}
