/**
 * 📝 LINK FORMS TYPES
 * Tipos para formulários de links (create e edit)
 */

export interface CreateLinkFormProps {
  onSuccess?: (link: any) => void;
  showBackButton?: boolean;
}

export interface EditLinkFormProps {
  linkId: string;
  onSuccess?: (link: any) => void;
  showBackButton?: boolean;
}
