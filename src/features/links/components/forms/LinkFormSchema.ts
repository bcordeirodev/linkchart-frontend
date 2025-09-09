import { z } from 'zod';

/**
 * 🔍 SCHEMA ZOD UNIFICADO PARA LINKS
 * Validações baseadas no backend Laravel (CreateLinkRequest/UpdateLinkRequest)
 * Usado tanto na criação quanto na edição
 */

// Lista de domínios bloqueados (sincronizada com backend)
const BLOCKED_DOMAINS = ['malware.com', 'phishing.net', 'spam.org'];

// Slugs reservados (sincronizada com backend)
const RESERVED_SLUGS = ['api', 'admin', 'www', 'mail', 'ftp', 'r', 'redirect'];

export const linkFormSchema = z.object({
	// ✅ URL Original - Validação robusta
	original_url: z
		.string()
		.min(1, 'URL é obrigatória')
		.max(2048, 'URL não pode ter mais de 2048 caracteres')
		.url('URL deve ser válida (ex: https://exemplo.com)')
		.regex(/^https?:\/\//, 'URL deve começar com http:// ou https://')
		.refine((url) => {
			try {
				const domain = new URL(url).hostname;
				return !BLOCKED_DOMAINS.includes(domain);
			} catch {
				return false;
			}
		}, 'Esta URL não é permitida por questões de segurança'),

	// ✅ Título - Opcional, máximo 255 caracteres
	title: z
		.string()
		.max(255, 'Título deve ter no máximo 255 caracteres')
		.optional()
		.or(z.literal('')),

	// ✅ Slug Personalizado - Validação completa
	custom_slug: z
		.string()
		.min(3, 'Slug deve ter pelo menos 3 caracteres')
		.max(50, 'Slug não pode ter mais de 50 caracteres')
		.regex(/^[a-zA-Z0-9\-_]+$/, 'Slug pode conter apenas letras, números, hífens e underscores')
		.refine((slug) => !RESERVED_SLUGS.includes(slug?.toLowerCase()), 'Este slug é reservado pelo sistema')
		.optional()
		.or(z.literal('')),

	// ✅ Descrição - Opcional, máximo 1000 caracteres
	description: z
		.string()
		.max(1000, 'Descrição deve ter no máximo 1000 caracteres')
		.optional()
		.or(z.literal('')),

	// ✅ Data de Expiração - Validação temporal (permite datas passadas para edição)
	expires_at: z
		.string()
		.optional()
		.nullable()
		.refine((date) => {
			if (!date) return true;
			const expireDate = new Date(date);
			const maxDate = new Date();
			maxDate.setFullYear(maxDate.getFullYear() + 5);
			// Permite datas no passado para edição, mas limita o futuro
			return expireDate <= maxDate;
		}, 'Data de expiração deve ser no máximo 5 anos no futuro'),

	// ✅ Data de Início - Validação temporal (permite datas passadas para edição)
	starts_in: z
		.string()
		.optional()
		.nullable()
		.refine((date) => {
			if (!date) return true;
			// Permite qualquer data válida para edição
			const startDate = new Date(date);
			return !isNaN(startDate.getTime());
		}, 'Data de início deve ser uma data válida'),

	// ✅ Limite de Cliques - Validação numérica
	click_limit: z
		.number()
		.int('Limite deve ser um número inteiro')
		.min(1, 'Limite deve ser pelo menos 1')
		.max(1000000, 'Limite máximo é 1.000.000')
		.optional()
		.nullable(),

	// ✅ Status Ativo
	is_active: z.boolean().default(true),

	// ✅ UTM Parameters - Opcionais
	utm_source: z.string().max(100, 'UTM Source muito longo').optional().or(z.literal('')),
	utm_medium: z.string().max(100, 'UTM Medium muito longo').optional().or(z.literal('')),
	utm_campaign: z.string().max(100, 'UTM Campaign muito longo').optional().or(z.literal('')),
	utm_term: z.string().max(100, 'UTM Term muito longo').optional().or(z.literal('')),
	utm_content: z.string().max(100, 'UTM Content muito longo').optional().or(z.literal(''))
})
	// ✅ Validação cruzada de datas
	.refine((data) => {
		if (!data.starts_in || !data.expires_at) return true;
		const startDate = new Date(data.starts_in);
		const expireDate = new Date(data.expires_at);
		return startDate < expireDate;
	}, {
		message: 'Data de início deve ser anterior à data de expiração',
		path: ['starts_in']
	});

export type LinkFormData = z.infer<typeof linkFormSchema>;

export const defaultLinkFormValues: Partial<LinkFormData> = {
	original_url: '',
	title: '',
	custom_slug: '',
	description: '',
	is_active: true,
	expires_at: null,
	starts_in: null,
	click_limit: null,
	utm_source: '',
	utm_medium: '',
	utm_campaign: '',
	utm_term: '',
	utm_content: ''
};
