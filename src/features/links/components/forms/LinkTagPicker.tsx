"use client";

import { useState } from "react";
import { Autocomplete, Chip, CircularProgress, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";

import { getTagChipSx } from "../list/linksPanelStyles";
import { useCreateTag, useTags } from "../../hooks/useTags";
import { pickLeastUsedTagColor } from "../../utils/tagColors";

import type { LinkFormData } from "./LinkFormSchema";
import type { Control } from "react-hook-form";
import type { Tag } from "@/types";

/** Hard cap on how many tags a single link may carry (matches the backend). */
const MAX_TAGS_PER_LINK = 5;

interface LinkTagPickerProps {
  control: Control<LinkFormData>;
}

/**
 * MUI Autocomplete (multiple, freeSolo) that lets a user attach up to
 * {@link MAX_TAGS_PER_LINK} tags to a link. Options come from `useTags()`;
 * typing a name that doesn't match an existing tag and pressing Enter creates
 * it inline via `useCreateTag`, assigning it the least-used color in
 * `TAG_COLOR_PALETTE`.
 *
 * The controlled field (`tag_ids`) holds numeric tag ids — this component
 * resolves those ids against the fetched tag list to render colored chips,
 * and converts selections back to ids on change.
 */
export function LinkTagPicker({ control }: LinkTagPickerProps) {
  const theme = useTheme();
  const { t } = useTranslation("links");
  const { data: tags = [], isLoading } = useTags();
  const createTag = useCreateTag();
  const [pendingName, setPendingName] = useState<string | null>(null);

  return (
    <Controller
      name="tag_ids"
      control={control}
      render={({ field, fieldState }) => {
        const selectedIds = field.value ?? [];
        const selectedTags = selectedIds
          .map((id) => tags.find((tag) => tag.id === id))
          .filter((tag): tag is Tag => Boolean(tag));
        const limitReached = selectedTags.length >= MAX_TAGS_PER_LINK;

        /**
         * Handles both existing-tag selection/removal and freeSolo text entry.
         * A freeSolo entry surfaces in `value` as a plain `string` — it is
         * created via `useCreateTag` before being folded into `tag_ids`.
         */
        const handleChange = async (
          _event: React.SyntheticEvent,
          value: (Tag | string)[],
        ) => {
          const newName = value.find(
            (entry): entry is string => typeof entry === "string",
          );

          if (newName !== undefined) {
            const trimmed = newName.trim();
            if (!trimmed || limitReached) {
              return;
            }

            setPendingName(trimmed);
            try {
              const created = await createTag.mutateAsync({
                name: trimmed,
                color: pickLeastUsedTagColor(tags),
              });
              field.onChange([...selectedIds, created.id]);
            } catch {
              // useCreateTag already surfaced a toast on failure.
            } finally {
              setPendingName(null);
            }
            return;
          }

          const nextTags = value as Tag[];
          if (nextTags.length > MAX_TAGS_PER_LINK) {
            return;
          }
          field.onChange(nextTags.map((tag) => tag.id));
        };

        return (
          <Autocomplete
            multiple
            freeSolo
            options={tags}
            value={selectedTags}
            loading={isLoading}
            filterSelectedOptions
            disabled={createTag.isPending}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.name
            }
            isOptionEqualToValue={(option, value) =>
              typeof option !== "string" &&
              typeof value !== "string" &&
              option.id === value.id
            }
            noOptionsText={t("form.tags.noOptions")}
            onChange={handleChange}
            renderTags={(value, getTagProps) =>
              value.map((tag, index) => {
                const { key, ...chipProps } = getTagProps({ index });
                const label = typeof tag === "string" ? tag : tag.name;
                const color =
                  typeof tag === "string"
                    ? theme.palette.primary.main
                    : tag.color;

                return (
                  <Chip
                    key={key}
                    {...chipProps}
                    label={label}
                    size="small"
                    sx={getTagChipSx(theme, color)}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                id="link-form-tags"
                placeholder={
                  limitReached
                    ? t("form.tags.placeholderLimitReached")
                    : t("form.tags.placeholder")
                }
                error={!!fieldState.error}
                helperText={
                  fieldState.error?.message ||
                  (pendingName
                    ? t("form.tags.creating", { name: pendingName })
                    : t("form.tags.helper"))
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {createTag.isPending ? (
                        <CircularProgress
                          size={14}
                          thickness={5}
                          sx={{ color: "text.disabled", mr: 1 }}
                        />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        );
      }}
    />
  );
}

export default LinkTagPicker;
