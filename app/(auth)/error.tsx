"use client";
import { Box, Alert, Button } from "@mui/material";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Auth area error:", error);
  }, [error]);

  return (
    <Box p={4}>
      <Alert severity="error" sx={{ mb: 2 }}>
        {error.message || "Erro de autenticação."}
      </Alert>
      <Button variant="outlined" onClick={reset}>
        Tentar novamente
      </Button>
    </Box>
  );
}
