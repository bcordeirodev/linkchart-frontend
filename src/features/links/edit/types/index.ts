/**
 * ✏️ EDIT LINK TYPES
 * Tipos específicos para edição de links
 */

// ========================================
// 🎨 UI TYPES - APENAS OS UTILIZADOS
// ========================================

export interface EditLinkFormProps {
	linkId: string;
	onSuccess?: (link: any) => void;
	showBackButton?: boolean;
}
