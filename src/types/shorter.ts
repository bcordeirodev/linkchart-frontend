/**
 * Tipos para o sistema de encurtamento de URLs
 */

export interface IShortUrl {
	slug: string;
	short_url: string;
	original_url: string;
	expires_at: string | null;
}
