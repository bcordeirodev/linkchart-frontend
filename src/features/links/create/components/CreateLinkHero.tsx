/**
 * 🎨 CREATE LINK HERO
 * Seção hero para página de criação de links
 */


import { Typography, Fade, useTheme } from '@mui/material';
import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';
import { createThemeGradient } from '@/lib/theme';
import { AppIcon } from '@/lib/icons';
import {
    HeroContainer,
    HeroIconTitleContainer,
    HeroIconBox,
    HeroFeaturesContainer,
    HeroFeatureItem
} from '../../components/styles/FormSections.styled';

/**
 * Componente hero otimizado para criação de links
 * Usa design tokens e gradientes do tema
 */
export function CreateLinkHero() {
    const theme = useTheme();

    return (
        <Fade in timeout={600}>
            <EnhancedPaper variant="elevated">
                <HeroContainer>
                    {/* Icon + Title */}
                    <HeroIconTitleContainer>
                        <HeroIconBox
                            sx={{
                                background: createThemeGradient(theme, {
                                    variant: 'success',
                                    direction: 'to-bottom-right'
                                })
                            }}
                        >
                            <AppIcon intent="create" size={32} color="white" />
                        </HeroIconBox>

                        <Typography
                            variant="h3"
                            fontWeight={700}
                            sx={{
                                background: createThemeGradient(theme, {
                                    variant: 'primary',
                                    direction: 'to-right'
                                }),
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            Criar Novo Link
                        </Typography>
                    </HeroIconTitleContainer>

                    {/* Subtitle */}
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Transforme URLs longas em links curtos e rastreáveis
                    </Typography>

                    {/* Features */}
                    <HeroFeaturesContainer>
                        <HeroFeatureItem>
                            <AppIcon intent="info" size={20} color={theme.palette.warning.main} />
                            <Typography variant="body2" color="text.secondary">
                                Analytics detalhados
                            </Typography>
                        </HeroFeatureItem>
                        <HeroFeatureItem>
                            <AppIcon intent="trending" size={20} color={theme.palette.success.main} />
                            <Typography variant="body2" color="text.secondary">
                                Acompanhe performance
                            </Typography>
                        </HeroFeatureItem>
                    </HeroFeaturesContainer>
                </HeroContainer>
            </EnhancedPaper>
        </Fade>
    );
}

export default CreateLinkHero;
