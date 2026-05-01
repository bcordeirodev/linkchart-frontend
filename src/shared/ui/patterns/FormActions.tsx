/**
 * 📋 FORM ACTIONS - STANDARDIZED PATTERNS
 * Componente padronizado para ações de formulário
 */

import { Stack, Button, CircularProgress, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";

import { AppIcon } from "@/shared/ui/icons";

// ========================================
// 🎨 STYLED COMPONENTS
// ========================================

const StyledPrimaryButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "mode" && prop !== "isLoading",
})<{ mode?: "create" | "edit"; isLoading?: boolean }>(
  ({ theme, mode = "create", isLoading = false }) => ({
    borderRadius: theme.spacing(1.5),
    textTransform: "none",
    fontWeight: 600,
    padding: theme.spacing(1.5, 5),
    minHeight: 48,
    position: "relative",
    overflow: "hidden",
    transition: theme.transitions.create(["all"], {
      duration: theme.transitions.duration.short,
    }),

    // Mode-specific styling
    background:
      mode === "create"
        ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
        : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,

    boxShadow:
      mode === "create"
        ? `0 4px 15px ${alpha(theme.palette.success.main, 0.4)}`
        : `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,

    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
      transition: theme.transitions.create(["left"], {
        duration: theme.transitions.duration.standard,
      }),
    },

    "&:hover:not(:disabled)": {
      transform: "translateY(-2px)",
      boxShadow:
        mode === "create"
          ? `0 6px 20px ${alpha(theme.palette.success.main, 0.5)}`
          : `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,

      "&::before": {
        left: "100%",
      },
    },

    "&:active": {
      transform: "translateY(-1px)",
    },

    "&:disabled": {
      background: alpha(theme.palette.action.disabled, 0.3),
      color: theme.palette.action.disabled,
      transform: "none",
      boxShadow: "none",
    },

    ...(isLoading && {
      background: alpha(theme.palette.primary.main, 0.6),
      cursor: "not-allowed",

      "&:hover": {
        transform: "none",
      },
    }),

    [theme.breakpoints.down("sm")]: {
      width: "100%",
      minWidth: "auto",
    },
  }),
);

const StyledSecondaryButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1.5, 4),
  minHeight: 48,
  border: `2px solid ${alpha(theme.palette.divider, 0.3)}`,
  color: theme.palette.text.secondary,
  backgroundColor: "transparent",
  transition: theme.transitions.create(["all"], {
    duration: theme.transitions.duration.short,
  }),

  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    color: theme.palette.primary.main,
    transform: "translateY(-1px)",
  },

  "&:disabled": {
    borderColor: alpha(theme.palette.action.disabled, 0.2),
    color: theme.palette.action.disabled,
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const StyledWarningButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1.5, 4),
  minHeight: 48,
  border: `2px solid ${alpha(theme.palette.warning.main, 0.3)}`,
  color: theme.palette.warning.main,
  backgroundColor: "transparent",
  transition: theme.transitions.create(["all"], {
    duration: theme.transitions.duration.short,
  }),

  "&:hover": {
    borderColor: theme.palette.warning.main,
    backgroundColor: alpha(theme.palette.warning.main, 0.04),
    transform: "translateY(-1px)",
  },

  "&:disabled": {
    borderColor: alpha(theme.palette.action.disabled, 0.2),
    color: theme.palette.action.disabled,
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

// ========================================
// 🎯 INTERFACES
// ========================================

interface FormActionsProps {
  /** Modo do formulário */
  mode: "create" | "edit";
  /** Se está carregando */
  loading?: boolean;
  /** Se pode submeter */
  canSubmit?: boolean;
  /** Se há mudanças (para modo edit) */
  hasChanges?: boolean;
  /** Handler de submit */
  onSubmit: () => void;
  /** Handler de cancelar */
  onCancel: () => void;
  /** Handler de reset (opcional) */
  onReset?: () => void;
  /** Texto customizado do botão principal */
  submitText?: string;
  /** Texto customizado do botão cancelar */
  cancelText?: string;
  /** Layout das ações */
  layout?: "end" | "between" | "center";
}

// ========================================
// 🧩 FORM ACTIONS COMPONENT
// ========================================

/**
 * Ações padronizadas para formulários
 * Adapta automaticamente baseado no modo (create/edit)
 */
export function FormActions({
  mode,
  loading = false,
  canSubmit = true,
  hasChanges = false,
  onSubmit,
  onCancel,
  onReset,
  submitText,
  cancelText,
  layout = "between",
}: FormActionsProps) {
  const layoutProps = {
    end: { justifyContent: "flex-end" },
    between: { justifyContent: "space-between" },
    center: { justifyContent: "center" },
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      {...layoutProps[layout]}
      sx={{ width: "100%" }}
    >
      {/* Botão Cancelar */}
      {layout === "between" && (
        <StyledSecondaryButton
          onClick={onCancel}
          disabled={loading}
          startIcon={<AppIcon intent="cancel" />}
        >
          {cancelText || "Cancelar"}
        </StyledSecondaryButton>
      )}

      {/* Ações do lado direito */}
      <Stack direction="row" spacing={2}>
        {/* Botão Reset (apenas para edit com mudanças) */}
        {mode === "edit" && hasChanges && onReset ? (
          <StyledWarningButton
            onClick={onReset}
            disabled={loading}
            startIcon={<AppIcon intent="reset" />}
          >
            Resetar
          </StyledWarningButton>
        ) : null}

        {/* Botão Cancelar (para layout end/center) */}
        {layout !== "between" && (
          <StyledSecondaryButton
            onClick={onCancel}
            disabled={loading}
            startIcon={<AppIcon intent="cancel" />}
          >
            {cancelText || "Cancelar"}
          </StyledSecondaryButton>
        )}

        {/* Botão Principal */}
        <StyledPrimaryButton
          mode={mode}
          isLoading={loading}
          onClick={onSubmit}
          disabled={!canSubmit || loading}
          sx={{ mt: 2 }}
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <AppIcon intent={mode === "create" ? "create" : "save"} />
            )
          }
        >
          {submitText ||
            (loading
              ? mode === "create"
                ? "Criando..."
                : "Salvando..."
              : mode === "create"
                ? "Criar Link"
                : "Salvar Alterações")}
        </StyledPrimaryButton>
      </Stack>
    </Stack>
  );
}

// ========================================
// 🎯 SPECIALIZED FORM ACTIONS
// ========================================

/**
 * Ações para formulário de criação
 */
export function CreateFormActions({
  loading,
  canSubmit,
  onSubmit,
  onCancel,
  onReset,
}: Omit<FormActionsProps, "mode" | "hasChanges">) {
  return (
    <FormActions
      mode="create"
      loading={loading}
      canSubmit={canSubmit}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onReset={onReset}
    />
  );
}

/**
 * Ações para formulário de edição
 */
export function EditFormActions({
  loading,
  canSubmit,
  hasChanges,
  onSubmit,
  onCancel,
  onReset,
}: Omit<FormActionsProps, "mode">) {
  return (
    <FormActions
      mode="edit"
      loading={loading}
      canSubmit={canSubmit}
      hasChanges={hasChanges}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onReset={onReset}
    />
  );
}

export default FormActions;
