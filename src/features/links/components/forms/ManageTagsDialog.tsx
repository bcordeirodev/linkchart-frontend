"use client";

import { useState } from "react";

import {
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { AppIcon } from "@/shared/ui/icons";

import { useDeleteTag, useTags, useUpdateTag } from "../../hooks/useTags";
import { sanitizeTagColor, TAG_COLOR_PALETTE } from "../../utils/tagColors";
import { getTagChipSx } from "../list/linksPanelStyles";

import type { Tag } from "@/types";

/** Diâmetro (px) dos botões de cor da paleta — confortável para toque. */
const COLOR_DOT_SIZE = 28;

/** Modo de exibição de uma linha do dialog. */
type RowMode = "view" | "edit" | "delete";

interface ManageTagRowProps {
  /** Tag exibida/editada nesta linha. */
  tag: Tag;
}

/**
 * Uma linha do dialog de gestão: chip de preview + ações (renomear/excluir).
 *
 * A linha alterna entre três modos locais: `view` (chip + botões de ação),
 * `edit` (campo de nome + paleta de cores + salvar/cancelar) e `delete`
 * (confirmação inline antes do `DELETE`). As mutações reutilizam
 * `useUpdateTag`/`useDeleteTag`, que já invalidam os caches de tags e de
 * links (os chips dos cards refletem a mudança) e exibem toast em erro.
 */
function ManageTagRow({ tag }: ManageTagRowProps) {
  const theme = useTheme();
  const { t } = useTranslation("links");
  const { t: tCommon } = useTranslation("common");

  const updateTag = useUpdateTag(String(tag.id));
  const deleteTag = useDeleteTag();

  const [mode, setMode] = useState<RowMode>("view");
  const [draftName, setDraftName] = useState(tag.name);
  const [draftColor, setDraftColor] = useState(() =>
    sanitizeTagColor(tag.color, TAG_COLOR_PALETTE[0]),
  );

  /** Entra no modo de edição com os drafts sincronizados à tag atual. */
  const startEdit = () => {
    setDraftName(tag.name);
    setDraftColor(sanitizeTagColor(tag.color, TAG_COLOR_PALETTE[0]));
    setMode("edit");
  };

  /** Persiste nome/cor editados e volta ao modo de visualização. */
  const handleSave = async () => {
    const trimmed = draftName.trim();
    if (!trimmed) {
      return;
    }

    try {
      await updateTag.mutateAsync({ name: trimmed, color: draftColor });
      setMode("view");
    } catch {
      // useUpdateTag já exibiu o toast de erro; permanece em edição.
    }
  };

  /** Exclui a tag (o backend a desanexa de todos os links). */
  const handleDelete = async () => {
    try {
      await deleteTag.mutateAsync(String(tag.id));
      // A linha some da lista via invalidação do cache de tags.
    } catch {
      // useDeleteTag já exibiu o toast de erro; permanece na confirmação.
    }
  };

  if (mode === "edit") {
    return (
      <Stack spacing={1.25} sx={{ py: 1 }}>
        <TextField
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          size="small"
          fullWidth
          autoFocus
          label={t("form.tags.manage.nameLabel")}
          inputProps={{ maxLength: 50 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void handleSave();
            }
            if (e.key === "Escape") {
              setMode("view");
            }
          }}
        />
        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
          {TAG_COLOR_PALETTE.map((color) => {
            const selected = color.toLowerCase() === draftColor.toLowerCase();

            return (
              <ButtonBase
                key={color}
                onClick={() => setDraftColor(color)}
                aria-label={t("form.tags.manage.colorAria", { color })}
                aria-pressed={selected}
                sx={{
                  width: COLOR_DOT_SIZE,
                  height: COLOR_DOT_SIZE,
                  borderRadius: "50%",
                  bgcolor: color,
                  border: selected
                    ? `2px solid ${theme.palette.text.primary}`
                    : `2px solid ${alpha(color, 0.4)}`,
                  transition: "border-color 120ms ease",
                }}
              />
            );
          })}
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" onClick={() => setMode("view")}>
            {tCommon("actions.cancel")}
          </Button>
          <Button
            size="small"
            variant="contained"
            disableElevation
            onClick={() => void handleSave()}
            disabled={!draftName.trim() || updateTag.isPending}
            startIcon={
              updateTag.isPending ? (
                <CircularProgress size={14} color="inherit" />
              ) : undefined
            }
          >
            {tCommon("actions.save")}
          </Button>
        </Stack>
      </Stack>
    );
  }

  if (mode === "delete") {
    return (
      <Stack spacing={1.25} sx={{ py: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {t("form.tags.manage.deleteConfirm", { name: tag.name })}
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" onClick={() => setMode("view")}>
            {tCommon("actions.cancel")}
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            disableElevation
            onClick={() => void handleDelete()}
            disabled={deleteTag.isPending}
            startIcon={
              deleteTag.isPending ? (
                <CircularProgress size={14} color="inherit" />
              ) : undefined
            }
          >
            {tCommon("actions.delete")}
          </Button>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ py: 0.75, minWidth: 0 }}
    >
      <Chip
        size="small"
        label={tag.name}
        sx={{ ...getTagChipSx(theme, tag.color), maxWidth: "100%" }}
      />
      <Box sx={{ flex: 1 }} />
      <Tooltip title={t("form.tags.manage.editAria", { name: tag.name })}>
        <IconButton
          size="small"
          onClick={startEdit}
          aria-label={t("form.tags.manage.editAria", { name: tag.name })}
        >
          <AppIcon intent="edit" size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("form.tags.manage.deleteAria", { name: tag.name })}>
        <IconButton
          size="small"
          onClick={() => setMode("delete")}
          aria-label={t("form.tags.manage.deleteAria", { name: tag.name })}
          sx={{ color: "error.main" }}
        >
          <AppIcon intent="delete" size={16} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

interface ManageTagsDialogProps {
  /** Controla a visibilidade do dialog. */
  open: boolean;
  /** Fecha o dialog (backdrop, Esc ou botão Fechar). */
  onClose: () => void;
}

/**
 * Dialog de gestão das tags da conta: renomear, trocar a cor (paleta fixa de
 * {@link TAG_COLOR_PALETTE}) e excluir — as únicas operações que não existiam
 * em lugar nenhum da UI (a criação é inline no `LinkTagPicker`).
 *
 * Aberto pelo botão "Gerenciar" ao lado do label Tags em `LinkFormFields`
 * (create e edit). Excluir uma tag a desanexa de todos os links; renomear e
 * recolorir refletem imediatamente nos chips dos cards via invalidação de
 * cache (`["tags"]` + `["links"]`).
 */
export function ManageTagsDialog({ open, onClose }: ManageTagsDialogProps) {
  const { t } = useTranslation("links");
  const { t: tCommon } = useTranslation("common");
  const { data: tags = [], isLoading } = useTags();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pb: 1 }}>
        {t("form.tags.manage.title")}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {t("form.tags.manage.description")}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Stack alignItems="center" sx={{ py: 3 }}>
            <CircularProgress size={22} />
          </Stack>
        ) : tags.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ py: 2, textAlign: "center" }}
          >
            {t("form.tags.manage.empty")}
          </Typography>
        ) : (
          <Stack
            divider={<Box sx={{ borderBottom: 1, borderColor: "divider" }} />}
          >
            {tags.map((tag) => (
              <ManageTagRow key={tag.id} tag={tag} />
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{tCommon("actions.close")}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ManageTagsDialog;
