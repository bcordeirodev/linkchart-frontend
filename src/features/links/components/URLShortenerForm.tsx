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
