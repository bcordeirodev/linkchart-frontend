import { z } from 'zod';

/**
 * Schema de validação unificado para links
 * Usado tanto na criação quanto na edição
 */
export const linkFormSchema = z.object({
	original_url: z.string().min(1, 'URL é obrigatória').url('URL deve ser válida (ex: https://exemplo.com)'),
	title: z
		.string()
		.optional()
		.or(z.literal(''))
		.refine((val) => !val || val.length <= 100, {
			message: 'Título deve ter no máximo 100 caracteres'
		}),
	slug: z
		.string()
		.optional()
		.or(z.literal(''))
		.refine((val) => !val || /^[a-zA-Z0-9-_]+$/.test(val), {
			message: 'Slug deve conter apenas letras, números, hífens e underscores'
		}),
	description: z.string().optional().or(z.literal('')),
	expires_at: z.date().optional().nullable(),
	starts_in: z.date().optional().nullable(),
	is_active: z.boolean().default(true),
	click_limit: z
		.number()
		.int()
		.min(1, 'Limite deve ser pelo menos 1')
		.max(1000000, 'Limite máximo é 1.000.000')
		.optional(),
	// UTM Parameters
	utm_source: z.string().optional().or(z.literal('')),
	utm_medium: z.string().optional().or(z.literal('')),
	utm_campaign: z.string().optional().or(z.literal('')),
	utm_term: z.string().optional().or(z.literal('')),
	utm_content: z.string().optional().or(z.literal(''))
});

export type LinkFormData = z.infer<typeof linkFormSchema>;

export const defaultLinkFormValues: Partial<LinkFormData> = {
	original_url: '',
	title: '',
	slug: '',
	description: '',
	is_active: true,
	utm_source: '',
	utm_medium: '',
	utm_campaign: '',
	utm_term: '',
	utm_content: ''
};
