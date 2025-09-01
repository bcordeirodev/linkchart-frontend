/**
 * 🔄 LOADING COMPONENT - LINK CHART
 * Componente de loading moderno com animações suaves
 * 
 * @description
 * Loading component melhorado com design moderno usando Material-UI.
 * Substitui o FuseLoading com melhor UX e integração com temas.
 * 
 * @features
 * - ✅ Design moderno com Material-UI
 * - ✅ Integração completa com temas
 * - ✅ Animações suaves
 * - ✅ Delay configurável
 * - ✅ Múltiplos tamanhos e variantes
 * - ✅ Acessibilidade completa
 * 
 * @since 2.0.0
 */

import { useState, useEffect } from 'react';
import {
    Box,
    CircularProgress,
    Typography,
    useTheme,
    alpha,
    Fade
} from '@mui/material';
import { motion } from 'framer-motion';

/**
 * Props do componente Loading
 */
export interface LoadingProps {
    /** Delay antes de mostrar o loading (ms) */
    delay?: number;
    /** Classe CSS adicional */
    className?: string;
    /** Tamanho do loading */
    size?: 'small' | 'medium' | 'large';
    /** Variante do loading */
    variant?: 'circular' | 'linear' | 'dots';
    /** Texto de loading */
    text?: string;
    /** Se deve ocupar toda a altura */
    fullHeight?: boolean;
    /** Cor personalizada */
    color?: 'primary' | 'secondary' | 'inherit';
}

/**
 * Componente de loading moderno
 */
export function Loading({
    delay = 0,
    className,
    size = 'medium',
    variant = 'circular',
    text,
    fullHeight = true,
    color = 'primary'
}: LoadingProps) {
    const theme = useTheme();
    const [showLoading, setShowLoading] = useState(delay === 0);

    useEffect(() => {
        if (delay > 0) {
            const timer = setTimeout(() => {
                setShowLoading(true);
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [delay]);

    const sizeMap = {
        small: 32,
        medium: 48,
        large: 64
    };

    const containerSx = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
        ...(fullHeight && {
            minHeight: '100vh',
            width: '100%'
        }),
        ...(className && { className })
    };

    const DotsLoader = () => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
            {[0, 1, 2].map((index) => (
                <motion.div
                    key={index}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: index * 0.2
                    }}
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: color === 'inherit' ? 'currentColor' : theme.palette[color as 'primary' | 'secondary'].main
                    }}
                />
            ))}
        </Box>
    );

    const LinearLoader = () => (
        <Box
            sx={{
                width: 200,
                height: 4,
                backgroundColor: alpha(color === 'inherit' ? theme.palette.text.primary : theme.palette[color as 'primary' | 'secondary'].main, 0.2),
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <motion.div
                animate={{
                    x: [-200, 200]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '50%',
                    height: '100%',
                    backgroundColor: color === 'inherit' ? theme.palette.text.primary : theme.palette[color as 'primary' | 'secondary'].main,
                    borderRadius: 2
                }}
            />
        </Box>
    );

    const renderLoader = () => {
        switch (variant) {
            case 'dots':
                return <DotsLoader />;
            case 'linear':
                return <LinearLoader />;
            case 'circular':
            default:
                return (
                    <CircularProgress
                        size={sizeMap[size]}
                        color={color}
                        thickness={4}
                        sx={{
                            '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round'
                            }
                        }}
                    />
                );
        }
    };

    if (!showLoading) {
        return null;
    }

    return (
        <Fade in={showLoading} timeout={300}>
            <Box sx={containerSx}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderLoader()}
                </motion.div>

                {text && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontWeight: 500,
                                textAlign: 'center'
                            }}
                        >
                            {text}
                        </Typography>
                    </motion.div>
                )}
            </Box>
        </Fade>
    );
}

// Compatibility export
export const FuseLoading = Loading;

export default Loading;