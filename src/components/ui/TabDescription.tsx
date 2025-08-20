/**
 * Componente para descrições das tabs
 * Exibe uma descrição elegante explicando o objetivo de cada aba
 */

'use client';

import { memo } from 'react';
import { Box, Typography, Divider, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const StyledDescriptionBox = styled(Box)(({ theme }) => ({
    background: `linear-gradient(135deg, 
		${alpha(theme.palette.primary.main, 0.02)} 0%,
		${alpha(theme.palette.primary.main, 0.05)} 100%
	)`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2.5, 3),
    marginBottom: theme.spacing(3),
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        background: `linear-gradient(180deg, 
			${theme.palette.primary.main} 0%, 
			${theme.palette.primary.light} 100%
		)`
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2)
    }
}));

interface TabDescriptionProps {
    icon: string;
    title: string;
    description: string;
    highlight?: string;
}

/**
 * Componente de descrição para tabs do Analytics
 */
function TabDescription({ icon, title, description, highlight }: TabDescriptionProps) {
    return (
        <StyledDescriptionBox>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {/* Ícone */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: (theme) => `linear-gradient(135deg, 
							${theme.palette.primary.main} 0%, 
							${theme.palette.primary.dark} 100%
						)`,
                        color: 'primary.contrastText',
                        boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        flexShrink: 0
                    }}
                >
                    <FuseSvgIcon size={24}>
                        {icon}
                    </FuseSvgIcon>
                </Box>

                {/* Conteúdo */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            color: 'text.primary',
                            mb: 1,
                            lineHeight: 1.3
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            lineHeight: 1.5,
                            fontSize: '0.875rem'
                        }}
                    >
                        {description}
                        {highlight && (
                            <>
                                {' '}
                                <Typography
                                    component="span"
                                    sx={{
                                        fontWeight: 600,
                                        color: 'primary.main',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {highlight}
                                </Typography>
                            </>
                        )}
                    </Typography>
                </Box>
            </Box>
        </StyledDescriptionBox>
    );
}

export default memo(TabDescription);
