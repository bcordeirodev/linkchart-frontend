import { Box, Avatar, TextField } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

import { radiusTokens } from "@/lib/theme/designSystem";

// ========================================
// 📝 FORM COMPONENTS
// ========================================

/**
 * Avatar do formulário de perfil: só o gradiente de fallback (para a inicial
 * do nome quando não há foto) e o dimensionamento responsivo.
 *
 * O anel de 4px, a sombra colorida `0 8px 32px` e o `scale(1.05)` no hover
 * saíram no polish de 2026-08-17: eram elevação por sombra ad hoc e uma
 * micro-interação isolada — ambas proibidas pela identidade "instrumento
 * técnico" — e, na prática, já eram código morto, porque o único consumidor
 * (`ProfileForm`) anulava as três via `sx`.
 */
export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  fontSize: "3rem",
  fontWeight: 600,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,

  [theme.breakpoints.down("sm")]: {
    width: 100,
    height: 100,
    fontSize: "2.5rem",
  },
}));

/**
 * `TextField` do formulário de perfil.
 *
 * Polish 2026-08-17: o raio saiu de `theme.spacing(1.5)` (12px, valor solto)
 * para `radiusTokens.md` (8px) — o mesmo raio que `MuiInputBase` aplica em
 * todo input da app, então o campo de nome deixa de ser o único arredondado
 * de forma diferente. O halo `0 0 0 2px` do foco também saiu: era elevação
 * por sombra ad hoc, e o próprio `borderWidth: 2` em `primary.main` já marca
 * o foco (é o que os inputs de `/api-keys` e `/subdomains` fazem).
 */
export const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "isEditing",
})<{
  isEditing?: boolean;
}>(({ theme, isEditing = false }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: radiusTokens.md,
    transition: theme.transitions.create(["border-color", "background-color"], {
      duration: theme.transitions.duration.short,
    }),

    // Sem `backgroundColor` local no estado editável: o preenchimento do
    // input vem do tema (`MuiOutlinedInput` — branco sólido no claro,
    // transparente no dark). O `alpha(background.paper, 0.8)` que estava
    // aqui devolvia, no claro, praticamente a MESMA cor do card em volta
    // (`background.paper` também), anulando a separação campo/card que o
    // override global existe para garantir.
    ...(isEditing && {
      "&:hover": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
      },

      "&.Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      },
    }),

    ...(!isEditing && {
      backgroundColor: alpha(theme.palette.action.hover, 0.5),

      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
      },
    }),
  },

  "& .MuiInputLabel-root": {
    fontWeight: 500,

    "&.Mui-focused": {
      color: theme.palette.primary.main,
    },
  },

  "& .MuiInputAdornment-root": {
    "& .MuiSvgIcon-root": {
      color: theme.palette.text.secondary,
      transition: theme.transitions.create(["color"], {
        duration: theme.transitions.duration.short,
      }),
    },
  },

  "&:hover .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: isEditing
      ? theme.palette.primary.main
      : theme.palette.text.secondary,
  },
}));

// ========================================
// 🎯 LOADING STATES
// ========================================

export const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "inherit",
  zIndex: theme.zIndex.modal - 1,
}));
