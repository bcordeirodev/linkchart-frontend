import { Box, Avatar, TextField } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

// ========================================
// 📝 FORM COMPONENTS
// ========================================

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  fontSize: "3rem",
  fontWeight: 600,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
  border: `4px solid ${alpha(theme.palette.background.paper, 0.8)}`,
  transition: theme.transitions.create(["transform", "box-shadow"], {
    duration: theme.transitions.duration.short,
  }),

  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
  },

  [theme.breakpoints.down("sm")]: {
    width: 100,
    height: 100,
    fontSize: "2.5rem",
  },
}));

export const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "isEditing",
})<{
  isEditing?: boolean;
}>(({ theme, isEditing = false }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1.5),
    transition: theme.transitions.create(
      ["border-color", "box-shadow", "background-color"],
      {
        duration: theme.transitions.duration.short,
      },
    ),

    ...(isEditing && {
      backgroundColor: alpha(theme.palette.background.paper, 0.8),

      "&:hover": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
      },

      "&.Mui-focused": {
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,

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
