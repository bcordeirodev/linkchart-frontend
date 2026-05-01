import type { SxProps, Theme } from "@mui/material/styles";

import { darkNeutral, lightNeutral } from "@/lib/theme/colors";

export function authTextFieldSx(theme: Theme): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";
  // neutral.input (#1C1C1F dark / #F4F4F5 light) is intentionally read from raw
  // constants — it keeps input surfaces visually distinct from paper surfaces and
  // is not exposed as a theme.palette token.
  const neutral = isDark ? darkNeutral : lightNeutral;

  return {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: neutral.input,
      "& input": {
        color: theme.palette.text.primary,
        "&::placeholder": {
          color: theme.palette.text.secondary,
          opacity: 1,
        },
      },
      "& fieldset": {
        borderColor: theme.palette.divider,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-error fieldset": {
        borderColor: theme.palette.error.main,
      },
    },
    "& .MuiInputAdornment-root": {
      color: theme.palette.text.secondary,
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.text.secondary,
      "&.Mui-focused": {
        color: theme.palette.primary.main,
      },
      "&.Mui-error": {
        color: theme.palette.error.main,
      },
    },
    "& .MuiFormHelperText-root": {
      color: theme.palette.text.secondary,
      "&.Mui-error": {
        color: theme.palette.error.main,
      },
    },
  };
}
