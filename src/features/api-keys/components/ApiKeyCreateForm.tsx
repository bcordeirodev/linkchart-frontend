"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormLabel,
  Stack,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { ApiError } from "@/lib/api/client";

import { API_KEY_NAME_MAX_LENGTH } from "../constants";
import { useApiKeys } from "../hooks/useApiKeys";

import { ApiKeyTokenDialog } from "./ApiKeyTokenDialog";

import type { CreatedApiKey } from "../types";
import type { TFunction } from "i18next";
import type { FormEvent } from "react";

/**
 * Resolves a create-key error to a translated message.
 *
 * A 422 is treated as the key limit: client-side validation (required +
 * hard `maxLength` on the input) prevents name errors from ever reaching
 * the server, so the remaining 422 case is `MAX_API_KEYS` — e.g. a second
 * tab minted the last slot first, racing past the pre-emptively hidden
 * form. 429 is the endpoint's 10/min rate limit.
 *
 * @param error - the error thrown by the create mutation.
 * @param t - the `apiKeys`-namespace translation function.
 * @param maxKeys - account key limit, interpolated into the limit message.
 * @returns a translated, user-facing message.
 */
function getCreateErrorMessage(
  error: unknown,
  t: TFunction<"apiKeys">,
  maxKeys: number,
): string {
  if (error instanceof ApiError) {
    if (error.status === 429) {
      return t("create.errors.rateLimited");
    }
    if (error.status === 422) {
      return t("create.errors.limitReached", { max: maxKeys });
    }
  }
  return t("create.errors.generic");
}

/**
 * Form to mint a new API key: a single name field plus submit. On success it
 * opens {@link ApiKeyTokenDialog} with the full token — held only in this
 * component's transient state and discarded when the dialog is confirmed.
 * Hidden by the parent page once `limitReached` is true.
 */
export function ApiKeyCreateForm() {
  const { t } = useTranslation("apiKeys");
  const { create, isCreating, createError, maxKeys } = useApiKeys();

  const [name, setName] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [createdKey, setCreatedKey] = useState<CreatedApiKey | null>(null);

  /**
   * Validates the name locally (required, max length) and submits. The
   * created key is lifted into `createdKey`, which mounts the token dialog.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setInputError(t("create.validation.required"));
      return;
    }
    if (trimmed.length > API_KEY_NAME_MAX_LENGTH) {
      setInputError(
        t("create.validation.maxLength", { max: API_KEY_NAME_MAX_LENGTH }),
      );
      return;
    }

    try {
      const key = await create(trimmed);
      setCreatedKey(key);
      setName("");
    } catch {
      // Surfaced below via createError.
    }
  };

  return (
    <>
      <Stack component="form" spacing={2} onSubmit={handleSubmit} noValidate>
        <Box>
          <FormLabel
            htmlFor="api-key-name"
            sx={{ display: "block", mb: 0.75, fontWeight: 600 }}
          >
            {t("create.nameLabel")}
          </FormLabel>
          <TextField
            id="api-key-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setInputError(null);
            }}
            placeholder={t("create.namePlaceholder")}
            error={!!inputError}
            helperText={
              inputError ??
              t("create.nameHint", { max: API_KEY_NAME_MAX_LENGTH })
            }
            fullWidth
            size="small"
            slotProps={{
              htmlInput: { maxLength: API_KEY_NAME_MAX_LENGTH },
            }}
          />
        </Box>

        {createError ? (
          <Alert severity="error">
            {getCreateErrorMessage(createError, t, maxKeys)}
          </Alert>
        ) : null}

        <Box>
          <Button
            type="submit"
            variant="contained"
            disabled={isCreating}
            sx={{ minHeight: 44, width: { xs: "100%", sm: "auto" } }}
          >
            {isCreating ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
            {t("create.submit")}
          </Button>
        </Box>
      </Stack>

      <ApiKeyTokenDialog
        createdKey={createdKey}
        onConfirm={() => setCreatedKey(null)}
      />
    </>
  );
}

export default ApiKeyCreateForm;
