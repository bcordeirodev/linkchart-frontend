"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTranslation } from "react-i18next";

import { ApiError } from "@/lib/api/client";
import { getSubdomainDomainSuffix } from "@/lib/utils/shortUrl";
import { typographyScale } from "@/lib/theme";

import { useSubdomains } from "../hooks/useSubdomains";

const DOMAIN_SUFFIX = getSubdomainDomainSuffix();

/** Matches the backend's label rule: lowercase letters, digits, hyphens; 3–63 chars; no leading/trailing hyphen. */
function isValidSubdomainLabel(value: string): boolean {
  return (
    /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(value) &&
    value.length >= 3 &&
    value.length <= 63
  );
}

/**
 * Resolves a claim error to a translated message, special-casing the
 * server's `SUBDOMAIN_LIMIT_REACHED` code (which can still fire even though
 * the form pre-emptively hides once `limitReached` is true — e.g. a second
 * tab claimed the last slot first).
 */
function getClaimErrorMessage(
  error: unknown,
  t: (key: string) => string,
): string {
  if (error instanceof ApiError && error.code === "SUBDOMAIN_LIMIT_REACHED") {
    return t("claim.errors.limitReached");
  }
  return t("claim.errors.generic");
}

/**
 * Form to claim an additional subdomain for the authenticated user. Hidden by
 * the parent page once `limitReached` is true.
 *
 * Polish 2026-08-17: the label input dropped its local `sx`
 * (`borderRadius: radiusTokens.md` + `bgcolor: background.default`). The
 * radius merely restated what `MuiInputBase` already applies app-wide, and
 * the background pinned the input to the page canvas — in light that is
 * `#EAEDF2`, i.e. a grey field where every other input in the app (including
 * the mirrored `/api-keys` create form) is solid white. Inheriting the theme
 * puts both pages on the same input surface in both themes.
 */
export function SubdomainClaimForm() {
  const { t } = useTranslation("subdomains");
  const {
    claim,
    isClaiming,
    claimError,
    checkAvailability,
    availability,
    isCheckingAvailability,
  } = useSubdomains();

  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleInputChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setInputValue(sanitized);
    setInputError(null);
    checkAvailability(sanitized);
  };

  const handleClaim = async () => {
    if (!isValidSubdomainLabel(inputValue)) {
      setInputError(t("claim.validation.format"));
      return;
    }
    if (!availability?.available) {
      setInputError(t("claim.validation.unavailable"));
      return;
    }
    try {
      await claim(inputValue);
      setInputValue("");
      setTermsAccepted(false);
    } catch {
      // Surfaced below via claimError.
    }
  };

  return (
    <Stack spacing={2}>
      <Box>
        <FormLabel
          htmlFor="subdomain-claim-label"
          sx={{ display: "block", mb: 0.75, fontWeight: 600 }}
        >
          {t("claim.inputLabel")}
        </FormLabel>
        <TextField
          id="subdomain-claim-label"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={t("claim.inputPlaceholder")}
          error={!!inputError}
          fullWidth
          size="small"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: typographyScale.code.fontFamily,
                      color: "text.secondary",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {DOMAIN_SUFFIX}
                  </Typography>
                </InputAdornment>
              ),
              sx: {
                fontFamily: typographyScale.code.fontFamily,
                fontWeight: 500,
              },
            },
          }}
        />
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ display: "block", mt: 0.75 }}
        >
          {t("claim.formatHint")}
        </Typography>
      </Box>

      {inputValue.length >= 3 ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          {isCheckingAvailability ? (
            <CircularProgress size={14} />
          ) : availability?.available ? (
            <CheckCircleOutlineIcon
              fontSize="small"
              sx={{ color: "text.secondary" }}
            />
          ) : availability ? (
            <ErrorOutlineIcon fontSize="small" color="error" />
          ) : null}
          <Typography
            variant="caption"
            color={
              isCheckingAvailability
                ? "text.secondary"
                : availability?.available
                  ? "text.secondary"
                  : "error"
            }
          >
            {isCheckingAvailability
              ? t("claim.checking")
              : availability?.available
                ? t("claim.available")
                : availability
                  ? t("claim.unavailable")
                  : ""}
          </Typography>
        </Box>
      ) : null}

      {inputError ? (
        <Typography variant="caption" color="error">
          {inputError}
        </Typography>
      ) : null}

      <Typography variant="body2" color="text.secondary">
        {t("claim.responsibility.text")}
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            sx={{ py: 0.25 }}
          />
        }
        label={
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.5 }}
          >
            {t("claim.responsibility.checkbox")}
          </Typography>
        }
        sx={{
          alignItems: "center",
          m: 0,
          ml: -0.5,
          gap: 0.25,
          "& .MuiFormControlLabel-label": { mt: 0 },
        }}
      />

      {claimError ? (
        <Alert severity="error">
          {getClaimErrorMessage(claimError, t as (key: string) => string)}
        </Alert>
      ) : null}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleClaim}
        disabled={
          isClaiming ||
          isCheckingAvailability ||
          !availability?.available ||
          inputValue.length < 3 ||
          !termsAccepted
        }
        sx={{ minHeight: 44 }}
      >
        {isClaiming ? (
          <CircularProgress size={16} sx={{ mr: 1 }} color="inherit" />
        ) : null}
        {t("claim.submit")}
      </Button>
    </Stack>
  );
}

export default SubdomainClaimForm;
