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
import { useEffect } from 'react';
import { all, save } from '@/services/reminder.service';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRouter } from 'next/navigation';


/**
 * Form Validation Schema
 */
const schema = z.object({
	word: z.string().nonempty('You must enter a word'),
	response: z.string().nonempty('You must enter a response'),
	rating: z
		.string()
		.refine((val) => !isNaN(Number(val)), 'Rating must be a number') // valida como número
});

const defaultValues = {
	word: '',
	response: '',
	rating: ''
};

export type FormType = {
	word: string;
	response: string;
	rating: string; // Se preferir, pode tipar como number e usar .transform() no schema
};

function WordCreate() {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const { control, formState, handleSubmit } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	async function onSubmit(formData: FormType) {

		save(formData).then(() => {
			dispatch(showMessage({ message: 'Cadastro efetuado com sucesso', variant: 'success' }));
		}).catch(() => {
			dispatch(showMessage({ message: 'Erro ao efetuar cadastro', variant: 'error' }));
		});

		return true;
	}

	useEffect(() => {
		all().then((response) => {
			console.log('Word:', response);
		})
	}, [])

	return (
		<form
			noValidate
			className="mt-8 flex w-full flex-col justify-center p-10"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Box pb={2} display="flex" justifyContent="space-between" alignItems="center">
				<Typography variant="h4" gutterBottom className='mb-0'>
					Criar nova palavra
				</Typography>
				<Button variant='contained' onClick={() => router.push('/word')} startIcon={<ArrowBackIosIcon/>}>
					Voltar
				</Button>
			</Box>
			{/* Exemplo de mensagem de erro geral */}
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
				Enviar
			</Button>
		</form>
	);
}

export default WordCreate;
