import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useLinks } from '@/features/links/hooks/useLinks';
import { linkFormSchema, LinkFormData, defaultLinkFormValues } from '@/features/links/components/LinkFormSchema';

interface UseLinkFormOptions {
	mode?: 'create' | 'edit';
	linkId?: string;
	initialData?: Partial<LinkFormData>;
	onSuccess?: (data: any) => void;
	redirectOnSuccess?: string;
}

interface UseLinkFormReturn {
	control: any;
	handleSubmit: any;
	formState: any;
	setValue: any;
	reset: any;
	watch: any;
	loading: boolean;
	showAdvanced: boolean;
	showUTM: boolean;
	setShowAdvanced: (show: boolean) => void;
	setShowUTM: (show: boolean) => void;
	onSubmit: (data: LinkFormData) => Promise<void>;
	handleUrlChange: (url: string) => void;
}

/**
 * Hook unificado para formulários de link
 * Gerencia criação e edição com lógica compartilhada
 */
export function useLinkForm({
	mode = 'create',
	linkId,
	initialData,
	onSuccess,
	redirectOnSuccess
}: UseLinkFormOptions = {}): UseLinkFormReturn {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { createLink, updateLink } = useLinks();

	const [loading, setLoading] = useState(false);
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [showUTM, setShowUTM] = useState(false);

	const form = useForm<LinkFormData>({
		resolver: zodResolver(linkFormSchema),
		defaultValues: { ...defaultLinkFormValues, ...initialData },
		mode: 'onChange'
	});

	const { control, handleSubmit, formState, setValue, reset, watch } = form;

	// Auto-gerar título baseado na URL
	const handleUrlChange = useCallback(
		(url: string) => {
			const currentTitle = watch('title');

			if (url && !currentTitle && mode === 'create') {
				try {
					const domain = new URL(url).hostname.replace('www.', '');
					setValue('title', `Link para ${domain}`);
				} catch (_error) {
					// URL inválida, ignorar
				}
			}
		},
		[watch, setValue, mode]
	);

	const onSubmit = useCallback(
		async (data: LinkFormData) => {
			try {
				setLoading(true);

				// Converter datas para ISO string se existirem
				const submitData = {
					...data,
					expires_at: data.expires_at ? data.expires_at.toISOString() : undefined,
					starts_in: data.starts_in ? data.starts_in.toISOString() : undefined
				};

				let result;

				if (mode === 'create') {
					result = await createLink(submitData);
					dispatch(
						showMessage({
							message: 'Link criado com sucesso!',
							variant: 'success'
						})
					);
				} else if (mode === 'edit' && linkId) {
					result = await updateLink(linkId, submitData);
					dispatch(
						showMessage({
							message: 'Link atualizado com sucesso!',
							variant: 'success'
						})
					);
				}

				onSuccess?.(result);

				if (redirectOnSuccess) {
					navigate(redirectOnSuccess);
				}
			} catch (_error) {
				dispatch(
					showMessage({
						message: `Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} link`,
						variant: 'error'
					})
				);
			} finally {
				setLoading(false);
			}
		},
		[mode, linkId, createLink, updateLink, dispatch, navigate, onSuccess, redirectOnSuccess]
	);

	return {
		control,
		handleSubmit: handleSubmit(onSubmit),
		formState,
		setValue,
		reset,
		watch,
		loading,
		showAdvanced,
		showUTM,
		setShowAdvanced,
		setShowUTM,
		onSubmit,
		handleUrlChange
	};
}

export default useLinkForm;
