"use client";
import {
  Alert,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  getSessionRedirectUrl,
  resetSessionRedirectUrl,
} from "@/lib/auth/sessionRedirectUrl";
import { useAppDispatch } from "@/lib/store/hooks";
import { showErrorMessage } from "@/lib/store/messageSlice";
import { authTextFieldSx } from "./authFieldStyles";

import { useAuth } from "../AuthContext";

interface AuthJsFormProps {
  formType: "signin" | "signup";
}

function AuthJsForm(props: AuthJsFormProps) {
  const { formType = "signin" } = props;
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  const errorType = searchParams.get("error");
  const error = errorType && getErrorMessage(errorType);

  function getErrorMessage(errorType: string): string {
    const errorMessages: Record<string, string> = {
      CredentialsSignin: "Credenciais inválidas",
      AccessDenied: "Acesso negado",
      Verification: "Verificação necessária",
      default: "Ocorreu um erro durante a autenticação",
    };
    return errorMessages[errorType] || errorMessages.default;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {error ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      ) : null}
      {formType === "signin" && <SimpleSignInForm onLogin={login} />}
      {formType === "signup" && <SimpleSignUpForm />}
    </Box>
  );
}

function SimpleSignInForm({
  onLogin,
}: {
  onLogin: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      dispatch(showErrorMessage("Por favor, preencha todos os campos"));
      return;
    }

    setLoading(true);
    try {
      await onLogin(email, password);

      const redirectUrl = getSessionRedirectUrl();
      const targetUrl = redirectUrl || "/links";

      resetSessionRedirectUrl();

      navigate(targetUrl);
    } catch (error: unknown) {
      let errorMessage = "Erro ao fazer login. Tente novamente.";

      if (error && typeof error === "object" && "message" in error) {
        errorMessage = (error as { message: string }).message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      dispatch(showErrorMessage(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
    >
      <TextField
        type="email"
        label="Email"
        placeholder="Digite seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        variant="outlined"
        sx={authTextFieldSx(theme)}
      />
      <TextField
        type="password"
        label="Senha"
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        variant="outlined"
        sx={authTextFieldSx(theme)}
      />
      <Button
        type="submit"
        disabled={loading}
        fullWidth
        variant="contained"
        size="large"
        sx={{
          mt: 2,
          py: 1.5,
          fontSize: "1.1rem",
          fontWeight: 600,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} color="inherit" />
            <Typography variant="body2">Entrando...</Typography>
          </Box>
        ) : (
          "Entrar"
        )}
      </Button>

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Link
          href="/forgot-password"
          sx={{
            color: theme.palette.primary.main,
            textDecoration: "none",
            fontSize: "0.9rem",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Esqueci minha senha
        </Link>
      </Box>
    </Box>
  );
}

function SimpleSignUpForm() {
  return (
    <Box sx={{ textAlign: "center", p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="body2" color="text.secondary">
        Funcionalidade de cadastro será implementada em breve.
      </Typography>
    </Box>
  );
}

export default AuthJsForm;
