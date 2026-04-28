> **Status:** ✅ IMPLEMENTADO — 2026-04-27/28

# Public Shorter Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar a página pública `/shorter` com estética Dark Premium, formulário com título e slug personalizado, e tela de sucesso animada com link copiável antes do redirect para analytics.

**Architecture:** Seis tarefas independentes e sequenciais. Nenhuma nova rota ou serviço — apenas novos componentes em `features/shorter/components/` e modificações nos existentes. `useShorter` recebe estado do resultado para passar o `short_url` ao componente de sucesso.

**Tech Stack:** React 18, MUI 6, react-hook-form, lucide-react, date-fns, `useClipboard` (hook interno), `useNavigate` (react-router-dom).

---

## Mapa de arquivos

| Arquivo | Ação |
|---|---|
| `src/shared/layout/PublicLayout.tsx` | Modificar — adicionar botões Entrar/Criar conta no header do variant `shorter` |
| `src/features/shorter/hooks/useShorter.ts` | Modificar — adicionar estado `result`, `handleReset`, aumentar timeout para 3000ms |
| `src/features/shorter/components/ShorterHero.tsx` | Criar — hero com dois estados (`idle` / `success`) |
| `src/features/shorter/components/ShorterSuccessState.tsx` | Criar — card de sucesso com link copiável + barra de progresso |
| `src/features/links/components/URLShortenerForm.tsx` | Modificar — adicionar campos `title` e `custom_slug`, novo estilo dark |
| `src/features/shorter/components/index.ts` | Modificar — exportar os dois novos componentes |
| `src/pages/public/ShorterPage.tsx` | Modificar — layout dark premium, glows, novos componentes |

---

## Task 1: Header com botões de auth em `PublicLayout`

**Files:**
- Modify: `src/shared/layout/PublicLayout.tsx`

- [ ] **Adicionar `useNavigate` e os botões no bloco do header `shorter`**

Substitua o bloco `{showHeader ? (...) : null}` inteiro por:

```tsx
{showHeader ? (
  <Box
    component='header'
    sx={{
      position: 'relative',
      zIndex: 10,
      py: 2,
      borderBottom: `1px solid ${theme.palette.divider}`
    }}
  >
    <Container maxWidth={layoutConfig.containerMaxWidth}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Link Chart</Box>
        {variant === 'shorter' && <ShorterHeaderActions />}
      </Box>
    </Container>
  </Box>
) : null}
```

Adicione o componente interno acima do `function PublicLayout`:

```tsx
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

function ShorterHeaderActions() {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button
        variant='outlined'
        size='small'
        onClick={() => navigate('/sign-in')}
        sx={{
          borderColor: 'rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '0.75rem',
          '&:hover': { borderColor: 'rgba(255,255,255,0.4)', color: 'white' }
        }}
      >
        Entrar
      </Button>
      <Button
        variant='contained'
        size='small'
        onClick={() => navigate('/sign-up')}
        sx={{
          background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
          fontSize: '0.75rem',
          fontWeight: 700,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' }
        }}
      >
        Criar conta grátis
      </Button>
    </Box>
  );
}
```

- [ ] **Commit**

```bash
git add src/shared/layout/PublicLayout.tsx
git commit -m "feat(shorter): adiciona botões Entrar/Criar conta no header público"
```

---

## Task 2: Atualizar `useShorter` — estado do resultado e reset

**Files:**
- Modify: `src/features/shorter/hooks/useShorter.ts`

- [ ] **Reescrever o hook com `result` state, `handleReset` e timeout de 3000ms**

```tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { publicLinkService } from '@/services/link-public.service';

import type { PublicLinkResponse } from '@/services/link-public.service';

export function useShorter() {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [result, setResult] = useState<PublicLinkResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = useCallback(
    (res: PublicLinkResponse) => {
      if (!res?.slug) {
        setError('Erro: Link criado mas sem slug válido');
        return;
      }
      setResult(res);
      setIsRedirecting(true);

      setTimeout(() => {
        try {
          navigate(publicLinkService.getPublicAnalyticsUrl(res.slug), {
            replace: true,
            state: { fromShorter: true, newLink: true, linkData: res }
          });
        } catch (err) {
          console.error('Erro ao redirecionar:', err);
          setError('Erro ao redirecionar para analytics');
          setIsRedirecting(false);
        }
      }, 3000);
    },
    [navigate]
  );

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsRedirecting(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const handleReset = useCallback(() => {
    setIsRedirecting(false);
    setResult(null);
    setError(null);
  }, []);

  const handleSignUp = useCallback(() => navigate('/sign-up'), [navigate]);
  const handleLogin = useCallback(() => navigate('/sign-in'), [navigate]);

  return {
    isRedirecting,
    result,
    error,
    handleSuccess,
    handleError,
    clearError,
    handleReset,
    handleSignUp,
    handleLogin
  };
}
```

- [ ] **Commit**

```bash
git add src/features/shorter/hooks/useShorter.ts
git commit -m "feat(shorter): adiciona result state, handleReset e timeout 3s"
```

---

## Task 3: Criar `ShorterHero`

**Files:**
- Create: `src/features/shorter/components/ShorterHero.tsx`

- [ ] **Criar o componente**

```tsx
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
```

- [ ] **Commit**

```bash
git add src/features/shorter/components/ShorterHero.tsx
git commit -m "feat(shorter): cria ShorterHero com estados idle e success"
```

---

## Task 4: Criar `ShorterSuccessState`

**Files:**
- Create: `src/features/shorter/components/ShorterSuccessState.tsx`

- [ ] **Criar o componente**

```tsx
import { Box, Typography } from '@mui/material';
import { CheckCircle2 } from 'lucide-react';

import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';
import useClipboard from '@/hooks/useClipboard';
import { ICON_LG } from '@/lib/theme/iconDefaults';

interface ShorterSuccessStateProps {
  shortUrl: string;
  onReset: () => void;
}

export function ShorterSuccessState({ shortUrl, onReset }: ShorterSuccessStateProps) {
  const dispatch = useAppDispatch();
  const { copy } = useClipboard({
    timeout: 1500,
    onSuccess: () => dispatch(showMessage({ message: 'Link copiado!', variant: 'success' }))
  });

  return (
    <Box
      sx={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(16,185,129,0.25)',
        borderRadius: '18px',
        p: { xs: 3, md: 4 },
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 60px rgba(16,185,129,0.08)',
        textAlign: 'center',
        maxWidth: 640,
        mx: 'auto'
      }}
    >
      {/* Ícone */}
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'rgba(16,185,129,0.12)',
          border: '2px solid rgba(16,185,129,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2
        }}
      >
        <CheckCircle2 {...ICON_LG} color='#10b981' />
      </Box>

      <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', mb: 0.5 }}>
        Link encurtado!
      </Typography>
      <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', mb: 2.5 }}>
        Copie e compartilhe onde quiser
      </Typography>

      {/* Box do link */}
      <Box
        sx={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          p: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          gap: 2
        }}
      >
        <Typography
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: '#a5b4fc',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {shortUrl}
        </Typography>
        <Box
          component='button'
          onClick={() => copy(shortUrl)}
          sx={{
            background: 'rgba(99,102,241,0.2)',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '7px',
            px: 2,
            py: 0.875,
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#a5b4fc',
            cursor: 'pointer',
            flexShrink: 0,
            '&:hover': { background: 'rgba(99,102,241,0.35)' }
          }}
        >
          📋 Copiar
        </Box>
      </Box>

      {/* Barra de progresso */}
      <Box
        sx={{
          height: 3,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 1,
          overflow: 'hidden',
          mb: 1.5
        }}
      >
        <Box
          sx={{
            height: '100%',
            background: 'linear-gradient(90deg,#6366f1,#10b981)',
            borderRadius: 1,
            '@keyframes progress': { from: { width: '0%' }, to: { width: '100%' } },
            animation: 'progress 3s linear forwards'
          }}
        />
      </Box>

      <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.25)', mb: 2.5 }}>
        Redirecionando para{' '}
        <Box component='span' sx={{ color: 'rgba(99,102,241,0.7)' }}>
          analytics detalhados
        </Box>{' '}
        em 3s...
      </Typography>

      {/* Encurtar outro */}
      <Box
        component='button'
        onClick={onReset}
        sx={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          px: 2,
          py: 0.625,
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.4)',
          cursor: 'pointer',
          '&:hover': { borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.7)' }
        }}
      >
        🔗 Encurtar outro link
      </Box>
    </Box>
  );
}
```

- [ ] **Commit**

```bash
git add src/features/shorter/components/ShorterSuccessState.tsx
git commit -m "feat(shorter): cria ShorterSuccessState com link copiável e progress bar"
```

---

## Task 5: Refatorar `URLShortenerForm` — campos title e custom_slug

**Files:**
- Modify: `src/features/links/components/URLShortenerForm.tsx`

- [ ] **Reescrever o componente com os novos campos e estilo dark**

```tsx
import { Box, Typography } from '@mui/material';
import { Globe, Pencil, Link2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { usePublicURLShortener } from '@/features/links/hooks/usePublicURLShortener';
import { useAppDispatch } from '@/lib/store/hooks';
import { showErrorMessage } from '@/lib/store/messageSlice';
import { GradientButton } from '@/shared/ui/base/GradientButton';
import { ICON_SM } from '@/lib/theme/iconDefaults';

import type { PublicLinkResponse } from '@/services/link-public.service';

interface IFormData {
  originalUrl: string;
  title: string;
  customSlug: string;
}

interface URLShortenerFormProps {
  onSuccess?: (result: PublicLinkResponse) => void;
  onError?: (error: string) => void;
  loading?: boolean;
}

const fieldSx = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  px: 2,
  py: 1.5,
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  transition: 'border-color 0.2s',
  '&:focus-within': { borderColor: 'rgba(99,102,241,0.5)', background: 'rgba(99,102,241,0.05)' }
};

const inputSx = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'white',
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  '&::placeholder': { color: 'rgba(255,255,255,0.25)' }
};

export function URLShortenerForm({ onSuccess, onError, loading: externalLoading }: URLShortenerFormProps) {
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<IFormData>({ defaultValues: { originalUrl: '', title: '', customSlug: '' } });

  const { createPublicShortUrl, loading } = usePublicURLShortener();
  const isLoading = loading || externalLoading;

  const onSubmit = async (formData: IFormData) => {
    try {
      const result = await createPublicShortUrl({
        original_url: formData.originalUrl,
        title: formData.title.trim() || undefined,
        custom_slug: formData.customSlug.trim() || undefined
      });
      onSuccess?.(result);
    } catch (_err) {
      const msg = 'Erro ao encurtar a URL. Tente novamente.';
      dispatch(showErrorMessage(msg));
      onError?.(msg);
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: '18px',
        p: { xs: 3, md: 3.5 },
        backdropFilter: 'blur(20px)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
        maxWidth: 640,
        mx: 'auto'
      }}
    >
      {/* URL field */}
      <Box sx={{ mb: 1.5 }}>
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', textTransform: 'uppercase', mb: 0.75 }}>
          URL original <Box component='span' sx={{ color: '#6366f1' }}>*</Box>
        </Typography>
        <Box sx={fieldSx}>
          <Globe {...ICON_SM} color='rgba(255,255,255,0.3)' />
          <Box
            component='input'
            {...register('originalUrl', {
              required: 'A URL é obrigatória',
              pattern: {
                value: /^(https?:\/\/)?[\w.-]+(\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
                message: 'Insira uma URL válida'
              }
            })}
            placeholder='Cole a URL aqui... (ex: https://exemplo.com/pagina-longa)'
            sx={inputSx}
          />
        </Box>
        {errors.originalUrl && (
          <Typography sx={{ fontSize: '0.75rem', color: '#f87171', mt: 0.5, pl: 0.5 }}>
            {errors.originalUrl.message}
          </Typography>
        )}
      </Box>

      {/* Título + Slug — grid 2 colunas */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mb: 2 }}>
        {/* Título */}
        <Box>
          <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', textTransform: 'uppercase', mb: 0.75 }}>
            Título{' '}
            <Box component='span' sx={{ fontSize: '0.625rem', fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'rgba(255,255,255,0.2)' }}>
              opcional
            </Box>
          </Typography>
          <Box sx={fieldSx}>
            <Pencil {...ICON_SM} color='rgba(255,255,255,0.3)' />
            <Box
              component='input'
              {...register('title')}
              placeholder='Nome para identificar o link'
              sx={inputSx}
            />
          </Box>
        </Box>

        {/* Slug */}
        <Box>
          <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', textTransform: 'uppercase', mb: 0.75 }}>
            Slug{' '}
            <Box component='span' sx={{ fontSize: '0.625rem', fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'rgba(255,255,255,0.2)' }}>
              opcional
            </Box>
          </Typography>
          <Box sx={{ ...fieldSx, '&:focus-within': { borderColor: 'rgba(99,102,241,0.5)', background: 'rgba(99,102,241,0.05)' } }}>
            <Link2 {...ICON_SM} color='rgba(255,255,255,0.3)' />
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              lnk.ch/
            </Typography>
            <Box
              component='input'
              {...register('customSlug', {
                pattern: {
                  value: /^[a-z0-9-]{3,50}$/,
                  message: '3–50 caracteres: letras minúsculas, números e hífens'
                }
              })}
              placeholder='meu-link'
              sx={inputSx}
            />
          </Box>
          {errors.customSlug && (
            <Typography sx={{ fontSize: '0.6875rem', color: '#f87171', mt: 0.5, pl: 0.5 }}>
              {errors.customSlug.message}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Botão */}
      <GradientButton
        type='submit'
        size='large'
        loading={isLoading}
        shimmerEffect
        sx={{ width: '100%', minHeight: 52, fontWeight: 700 }}
      >
        ⚡ Encurtar Agora
      </GradientButton>
    </Box>
  );
}

export default URLShortenerForm;
```

- [ ] **Commit**

```bash
git add src/features/links/components/URLShortenerForm.tsx
git commit -m "feat(shorter): adiciona campos title e custom_slug ao formulário público"
```

---

## Task 6: Atualizar exports de `features/shorter/components`

**Files:**
- Modify: `src/features/shorter/components/index.ts`

- [ ] **Adicionar os dois novos componentes ao index**

```ts
/**
 * 🔗 SHORTER COMPONENTS EXPORTS
 */
export { ShorterStats } from './ShorterStats';
export { ShorterHero } from './ShorterHero';
export { ShorterSuccessState } from './ShorterSuccessState';
export { ShorterForm } from './ShorterForm';
export { RedirectingState } from './RedirectingState';
export { ErrorAlert } from './ErrorAlert';
export { UpgradeCTA } from './UpgradeCTA';
```

- [ ] **Commit**

```bash
git add src/features/shorter/components/index.ts
git commit -m "chore(shorter): exporta ShorterHero e ShorterSuccessState"
```

---

## Task 7: Redesenhar `ShorterPage` — layout Dark Premium

**Files:**
- Modify: `src/pages/public/ShorterPage.tsx`

- [ ] **Reescrever a página completa**

```tsx
import { Box, Container, Alert } from '@mui/material';
import { memo } from 'react';

import { URLShortenerForm } from '@/features/links/components/URLShortenerForm';
import { ShorterHero, ShorterStats, ShorterSuccessState } from '@/features/shorter/components';
import { useShorter } from '@/features/shorter/hooks';
import { PublicLayout } from '@/shared/layout';

import { BenefitBadges } from './BenefitBadges';

function ShorterPage() {
  const { isRedirecting, result, error, handleSuccess, handleError, clearError, handleReset } = useShorter();

  return (
    <PublicLayout variant='shorter' showHeader showFooter>
      {/* Fundo dark com glows radiais */}
      <Box sx={{ position: 'relative', minHeight: '100vh', background: '#060610' }}>
        {/* Glow índigo — top right */}
        <Box sx={{
          position: 'fixed', top: '-20%', right: '-10%',
          width: 600, height: 600, borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)'
        }} />
        {/* Glow esmeralda — bottom left */}
        <Box sx={{
          position: 'fixed', bottom: '-20%', left: '-10%',
          width: 500, height: 500, borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 65%)'
        }} />

        <Container maxWidth='md' sx={{ position: 'relative', zIndex: 1, pb: 8 }}>
          {/* Hero */}
          <ShorterHero state={isRedirecting ? 'success' : 'idle'} />

          {/* Error */}
          {error ? (
            <Alert
              severity='error'
              onClose={clearError}
              sx={{ mb: 2, maxWidth: 640, mx: 'auto', borderRadius: 2 }}
            >
              {error}
            </Alert>
          ) : null}

          {/* Form ou Success */}
          {isRedirecting && result ? (
            <ShorterSuccessState shortUrl={result.short_url} onReset={handleReset} />
          ) : (
            <URLShortenerForm onSuccess={handleSuccess} onError={handleError} />
          )}

          {/* Benefit badges */}
          <BenefitBadges state={isRedirecting ? 'success' : 'idle'} onReset={handleReset} />

          {/* Stats */}
          <Box sx={{ mt: 6 }}>
            <ShorterStats />
          </Box>
        </Container>
      </Box>
    </PublicLayout>
  );
}

export default memo(ShorterPage);
```

- [ ] **Criar o componente auxiliar `BenefitBadges` no mesmo arquivo** (abaixo do `ShorterPage`, antes do `export default`):

```tsx
import { Typography } from '@mui/material';

const badgeSx = {
  display: 'inline-flex', alignItems: 'center', gap: 0.75,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '20px', px: 1.5, py: 0.625,
  fontSize: '0.6875rem', color: 'rgba(255,255,255,0.45)'
};

function BenefitBadges({ state, onReset }: { state: 'idle' | 'success'; onReset: () => void }) {
  const isSuccess = state === 'success';
  return (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mt: 2, maxWidth: 640, mx: 'auto' }}>
      {isSuccess ? (
        <>
          <Box sx={badgeSx}><Typography component='span' sx={{ color: '#10b981', fontSize: '0.625rem' }}>✓</Typography> Link ativo e funcionando</Box>
          <Box sx={badgeSx}><Typography component='span' sx={{ color: '#10b981', fontSize: '0.625rem' }}>✓</Typography> Analytics coletando dados</Box>
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
          <Box sx={badgeSx}><Typography component='span' sx={{ color: '#10b981', fontSize: '0.625rem' }}>✓</Typography> Analytics em tempo real</Box>
          <Box sx={badgeSx}><Typography component='span' sx={{ color: '#10b981', fontSize: '0.625rem' }}>✓</Typography> QR Code grátis</Box>
          <Box sx={badgeSx}><Typography component='span' sx={{ color: '#10b981', fontSize: '0.625rem' }}>✓</Typography> Sem expiração</Box>
          <Box sx={badgeSx}><Typography component='span' sx={{ color: '#10b981', fontSize: '0.625rem' }}>✓</Typography> Slug personalizado</Box>
        </>
      )}
    </Box>
  );
}
```

- [ ] **Verificar no browser em `http://localhost:3000/shorter`**

  Checklist:
  - [ ] Fundo escuro (`#060610`) com glows radiais visíveis
  - [ ] Header com botões "Entrar" e "Criar conta grátis"
  - [ ] Hero com badge pulsante e headline com gradiente
  - [ ] Card glassmorphism com 3 campos (URL, título, slug)
  - [ ] Prefix `lnk.ch/` visível no campo de slug
  - [ ] Botão "Encurtar Agora" com shimmer
  - [ ] Badges de benefícios abaixo do card
  - [ ] Stats no final
  - [ ] Encurtar um link real → tela de sucesso aparece
  - [ ] Barra de progresso anima por 3s
  - [ ] Link copiável funciona (toast aparece)
  - [ ] "Encurtar outro link" volta para o formulário
  - [ ] Após 3s → redireciona para analytics

- [ ] **Commit**

```bash
git add src/pages/public/ShorterPage.tsx
git commit -m "feat(shorter): redesign dark premium com glows, hero e success state"
```

---

## Self-Review

**Cobertura do spec:**
- ✅ Dark Premium (background `#060610`, glows radiais, glassmorphism)
- ✅ URL + Título + Slug personalizado
- ✅ Redirect + Preview melhorado (3s, progress bar, link copiável)
- ✅ Header com botões de auth
- ✅ UpgradeCTA removida, substituída por benefit badges
- ✅ Stats mantidos

**Tipos consistentes entre tasks:**
- `result: PublicLinkResponse | null` definido em Task 2, consumido em Task 7 ✅
- `handleReset` definido em Task 2, usado em Tasks 7 ✅
- `ShorterHero` prop `state: 'idle' | 'success'` definido em Task 3, usado em Task 7 ✅
- `ShorterSuccessState` props `shortUrl` e `onReset` definidos em Task 4, passados em Task 7 ✅

**Atenção na Task 7:** O `BenefitBadges` precisa de `Box` e `Typography` importados — já estão no import do `ShorterPage` junto com `Container` e `Alert`. Confirmar que todos os imports estão presentes antes de commitar.
