import { Box, Typography } from '@mui/material';

interface ShorterHeroProps {
  state: 'idle' | 'success';
}

export function ShorterHero({ state }: ShorterHeroProps) {
  const isSuccess = state === 'success';

  return (
    <Box sx={{ textAlign: 'center', mb: 4, mt: { xs: 4, md: 6 } }}>
      {/* Badge animado */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          background: isSuccess
            ? 'rgba(16,185,129,0.12)'
            : 'rgba(99,102,241,0.12)',
          border: '1px solid',
          borderColor: isSuccess
            ? 'rgba(16,185,129,0.25)'
            : 'rgba(99,102,241,0.25)',
          borderRadius: '20px',
          px: 2,
          py: 0.625,
          mb: 2.5
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: isSuccess ? '#10b981' : '#6366f1',
            '@keyframes pulse': {
              '0%,100%': { opacity: 1 },
              '50%': { opacity: 0.4 }
            },
            animation: 'pulse 2s infinite'
          }}
        />
        <Typography
          sx={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
            color: isSuccess ? '#6ee7b7' : '#a5b4fc'
          }}
        >
          {isSuccess ? 'Link criado com sucesso' : '100% gratuito · sem cadastro'}
        </Typography>
      </Box>

      {/* Headline */}
      <Typography
        component='h1'
        sx={{
          fontSize: { xs: '2.25rem', md: '3rem' },
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
          color: 'white',
          mb: 2
        }}
      >
        {isSuccess ? (
          <>
            Pronto para{' '}
            <Box
              component='span'
              sx={{
                background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              compartilhar!
            </Box>
          </>
        ) : (
          <>
            Encurte. Analise.{' '}
            <Box
              component='span'
              sx={{
                background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Cresça.
            </Box>
          </>
        )}
      </Typography>

      {/* Subtítulo */}
      <Typography sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
        {isSuccess
          ? 'Seu link já está ativo. Abrindo analytics automaticamente.'
          : 'Transforme links longos em URLs memoráveis com analytics em tempo real.'}
      </Typography>
    </Box>
  );
}
