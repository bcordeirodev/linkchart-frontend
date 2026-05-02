"use client";
import { Box, Typography, Button } from "@mui/material";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { ICON_LG } from "@/lib/theme/iconDefaults";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("App area error:", error);
  }, [error]);

  return (
    <Box p={4} display="flex" flexDirection="column" alignItems="center" gap={2}>
      <AlertCircle {...ICON_LG} />
      <Typography variant="h6">Ocorreu um erro</Typography>
      <Typography variant="body2" color="text.secondary">
        {error.message}
      </Typography>
      <Button variant="outlined" onClick={reset}>
        Tentar novamente
      </Button>
    </Box>
  );
}
