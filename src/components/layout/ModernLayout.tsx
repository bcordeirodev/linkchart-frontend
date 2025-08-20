/**
 * Layout moderno para Link Charts
 * Header horizontal compacto, sem sidebar lateral
 */

'use client';

import { memo, ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import HorizontalNavbar from './components/HorizontalNavbar';
// import Footer from './components/Footer'; // Footer removido
import FuseMessage from '@fuse/core/FuseMessage';

const Root = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default
}));

const MainContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginTop: '72px', // Altura do header fixo atualizada
    [theme.breakpoints.down('md')]: {
        marginTop: '64px'
    },
    [theme.breakpoints.down('sm')]: {
        marginTop: '56px'
    }
}));

const ContentArea = styled(Container)(({ theme }) => ({
    flex: 1,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    maxWidth: '1600px !important', // Layout ainda mais largo para gráficos
    [theme.breakpoints.down('lg')]: {
        maxWidth: '1200px !important'
    },
    [theme.breakpoints.down('md')]: {
        maxWidth: '100% !important',
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3)
    },
    [theme.breakpoints.down('sm')]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    }
}));

interface ModernLayoutProps {
    children: ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    disableGutters?: boolean;
}

/**
 * Layout moderno sem sidebar lateral
 * Header horizontal e conteúdo centralizado
 */
function ModernLayout({
    children,
    maxWidth = false,
    disableGutters = false
}: ModernLayoutProps) {
    return (
        <Root>
            {/* Header horizontal fixo */}
            <HorizontalNavbar />

            {/* Conteúdo principal */}
            <MainContent>
                <ContentArea
                    maxWidth={maxWidth}
                    disableGutters={disableGutters}
                >
                    {children}
                </ContentArea>

                {/* Footer - OCULTADO */}
                {/* <Footer /> */}
            </MainContent>

            {/* Sistema de mensagens */}
            <FuseMessage />
        </Root>
    );
}

export default memo(ModernLayout);
