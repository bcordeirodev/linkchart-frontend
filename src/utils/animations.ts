import { keyframes } from '@mui/system';

/**
 * Animações reutilizáveis para todo o projeto
 * Centralizadas para consistência e performance
 */

// Animação de flutuação
export const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Animação de brilho
export const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(10, 116, 218, 0.3); }
  50% { box-shadow: 0 0 30px rgba(10, 116, 218, 0.6); }
`;

// Animação de pulso
export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Animação de brilho verde (para sucesso)
export const glowGreen = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(76, 175, 80, 0.3); }
  50% { box-shadow: 0 0 30px rgba(76, 175, 80, 0.6); }
`;

// Animação de rotação para loading
export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Animação de slide para shimmer effect
export const shimmer = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`;

// Animação de bounce suave
export const bounceIn = keyframes`
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
`;

// Animação de fade in from bottom
export const fadeInUp = keyframes`
  0% { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

// Animação de shake para erros
export const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;
