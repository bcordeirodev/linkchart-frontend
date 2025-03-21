'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert, Box, Typography } from '@mui/material';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from '@/store/hooks';
import { useEffect, useState } from 'react';
import { findOne, update } from '@/services/reminder.service';
import { useRouter } from 'next/navigation';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

/**
 * Schema de validação do formulário
 */
const schema = z.object({
  word: z.string().nonempty('Você precisa informar uma palavra'),
  response: z.string().nonempty('Você precisa informar uma resposta'),
  rating: z
    .string()
    .refine((val) => !isNaN(Number(val)), 'A avaliação deve ser um número')
});

const defaultValues = {
  word: '',
  response: '',
  rating: ''
};

export type FormType = {
  word: string;
  response: string;
  rating: string;
};

function WordEdit({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { control, formState, handleSubmit, reset } = useForm<FormType>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(schema)
  });
  const { isValid, dirtyFields, errors } = formState;
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    setLoadingData(true);
    findOne(id)
      .then((response) => {
        reset(response.data);
      })
      .catch(() => {
        dispatch(showMessage({ message: 'Erro ao carregar dados', variant: 'error' }));
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [id, reset, dispatch]);

  async function onSubmit(formData: FormType) {
    try {
      await update(id, formData);
      dispatch(showMessage({ message: 'Atualização efetuada com sucesso', variant: 'success' }));
    } catch (error) {
      dispatch(showMessage({ message: 'Erro ao atualizar palavra', variant: 'error' }));
    }
  }

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Typography variant="body1">Carregando...</Typography>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="mt-8 flex w-full flex-col justify-center p-10"
      onSubmit={handleSubmit(onSubmit)}
    >
			<Box pb={2} display="flex" justifyContent="space-between" alignItems="center">
				<Typography variant="h4" gutterBottom className='mb-0'>
					Editar palavra
				</Typography>
				<Button variant='contained' onClick={() => router.push('/word')} startIcon={<ArrowBackIosIcon/>}>
					Voltar
				</Button>
			</Box>
      {errors?.root?.message && (
        <Alert
          className="mb-8"
          severity="error"
          sx={(theme) => ({
            backgroundColor: theme.palette.error.light,
            color: theme.palette.error.dark
          })}
        >
          {errors.root.message}
        </Alert>
      )}

      {/* Campo "word" */}
      <Controller
        name="word"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="Word"
            error={!!errors.word}
            helperText={errors?.word?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />

      {/* Campo "response" */}
      <Controller
        name="response"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="Response"
            error={!!errors.response}
            helperText={errors?.response?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />

      {/* Campo "rating" */}
      <Controller
        name="rating"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="Rating"
            type="number"
            error={!!errors.rating}
            helperText={errors?.rating?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />

      {/* Botão de submit */}
      <Button
        variant="contained"
        color="secondary"
        className="mt-6 w-full"
        aria-label="Submit"
        disabled={_.isEmpty(dirtyFields) || !isValid}
        type="submit"
        size="large"
      >
        Atualizar
      </Button>
    </form>
  );
}

export default WordEdit;
