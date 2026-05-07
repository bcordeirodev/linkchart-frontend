/**
 * 📝 LINK FORMS TYPES
 * Tipos para formulários de links (create e edit)
 */

export interface CreateLinkFormProps {
  onSuccess?: (link: unknown) => void;
  showBackButton?: boolean;
}

export interface EditLinkFormProps {
  linkId: string;
  onSuccess?: (link: unknown) => void;
  showBackButton?: boolean;
}
