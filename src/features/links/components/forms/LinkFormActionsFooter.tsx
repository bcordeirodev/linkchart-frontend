"use client";

import { Button, CircularProgress, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import { AppIcon } from "@/shared/ui/icons";

interface LinkFormActionsFooterProps {
  onCancel: () => void;
  submitLabel: string;
  loading?: boolean;
  submitDisabled?: boolean;
}

export function LinkFormActionsFooter({
  onCancel,
  submitLabel,
  loading = false,
  submitDisabled = false,
}: LinkFormActionsFooterProps) {
  const { t: tCommon } = useTranslation("common");

  return (
    <Stack
      direction="row"
      spacing={1.5}
      justifyContent="flex-end"
      sx={{ width: { xs: "100%", sm: "auto" }, ml: { sm: "auto" } }}
    >
      <Button
        variant="outlined"
        color="inherit"
        onClick={onCancel}
        disabled={loading}
        sx={{ flex: { xs: 1, sm: "initial" }, minWidth: { sm: 100 } }}
      >
        {tCommon("actions.cancel")}
      </Button>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={submitDisabled || loading}
        startIcon={
          loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <AppIcon intent="save" />
          )
        }
        sx={{ flex: { xs: 1, sm: "initial" }, minWidth: { sm: 140 } }}
      >
        {submitLabel}
      </Button>
    </Stack>
  );
}

export default LinkFormActionsFooter;
