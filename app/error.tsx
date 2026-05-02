"use client";
import { Box, Typography, Button, Paper } from "@mui/material";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { ICON_XL } from "@/lib/theme/iconDefaults";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={3}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 480, textAlign: "center" }}>
        <AlertTriangle {...ICON_XL} style={{ marginBottom: 16 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Algo deu errado
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {error.message || "Ocorreu um erro inesperado."}
        </Typography>
        <Button variant="contained" onClick={reset}>
          Tentar novamente
        </Button>
      </Paper>
    </Box>
  );
}
