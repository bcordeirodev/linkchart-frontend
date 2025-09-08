/**
 * 🎨 UI STYLED COMPONENTS
 * Componentes estilizados temporários para resolver imports
 */

import { styled, Box, Typography, Chip } from '@mui/material';

export const HeroContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    textAlign: 'center',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
    borderRadius: theme.spacing(2),
}));

export const HeroTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
}));

export const HeroSubtitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
}));

export const HeroChip = styled(Chip)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
}));
