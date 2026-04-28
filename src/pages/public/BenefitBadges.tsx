import { Box, Typography } from '@mui/material';

const badgeSx = {
  display: 'inline-flex', alignItems: 'center', gap: 0.75,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '20px', px: 1.5, py: 0.625,
  fontSize: '0.6875rem', color: 'rgba(255,255,255,0.45)'
};

interface BenefitBadgesProps {
  state: 'idle' | 'success';
  onReset: () => void;
}

export function BenefitBadges({ state, onReset }: BenefitBadgesProps) {
  const isSuccess = state === 'success';
  return (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mt: 2, maxWidth: 640, mx: 'auto' }}>
      {isSuccess ? (
        <>
          <Box sx={badgeSx}>
            <Typography component='span' sx={{ color: '#10b981', fontSize: '0.625rem' }}>✓</Typography>
            {' '}Link ativo e funcionando
          </Box>
          <Box sx={badgeSx}>
            <Typography component='span' sx={{ color: '#10b981', fontSize: '0.625rem' }}>✓</Typography>
            {' '}Analytics coletando dados
          </Box>
          <Box
            component='button'
            onClick={onReset}
            sx={{ ...badgeSx, cursor: 'pointer', border: '1px solid rgba(99,102,241,0.3)', color: 'rgba(165,180,252,0.8)', background: 'transparent', '&:hover': { borderColor: 'rgba(99,102,241,0.5)' } }}
          >
            🔗 Encurtar outro link
          </Box>
        </>
      ) : (
        <>
          <Box sx={badgeSx}>
            <Typography component='span' sx={{ color: '#10b981', fontSize: '0.625rem' }}>✓</Typography>
            {' '}Analytics em tempo real
          </Box>
          <Box sx={badgeSx}>
            <Typography component='span' sx={{ color: '#10b981', fontSize: '0.625rem' }}>✓</Typography>
            {' '}QR Code grátis
          </Box>
          <Box sx={badgeSx}>
            <Typography component='span' sx={{ color: '#10b981', fontSize: '0.625rem' }}>✓</Typography>
            {' '}Sem expiração
          </Box>
          <Box sx={badgeSx}>
            <Typography component='span' sx={{ color: '#10b981', fontSize: '0.625rem' }}>✓</Typography>
            {' '}Slug personalizado
          </Box>
        </>
      )}
    </Box>
  );
}
