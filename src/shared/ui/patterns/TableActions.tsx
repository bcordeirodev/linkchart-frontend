/**
 * 📊 TABLE ACTIONS - STANDARDIZED PATTERNS
 * Componente padronizado para ações de tabela
 */

import { Stack, IconButton, Tooltip } from "@mui/material";
import {
  BarChart3,
  Pencil,
  ClipboardCopy,
  Share2,
  QrCode,
  Download,
  Trash2,
} from "lucide-react";
import { ICON_MD } from "@/lib/theme/iconDefaults";

// Mapear tamanhos customizados para tamanhos MUI
const mapSize = (
  size: "xs" | "sm" | "md" | "lg",
): "small" | "medium" | "large" => {
  switch (size) {
    case "xs":
    case "sm":
      return "small";
    case "md":
      return "medium";
    case "lg":
      return "large";
    default:
      return "medium";
  }
};

interface TableActionsProps {
  /** Edit handler — renders a Pencil icon with `color="warning"`. */
  onEdit?: () => void;
  /** Delete handler — renders a Trash2 icon with `color="error"` (rendered last). */
  onDelete?: () => void;
  /** Analytics handler — renders a BarChart3 icon with `color="success"` (rendered first). */
  onAnalytics?: () => void;
  /** QR-code handler — renders a QrCode icon with `color="secondary"`. */
  onQR?: () => void;
  /** Copy handler — renders a ClipboardCopy icon with `color="info"`. */
  onCopy?: () => void;
  /** Share handler — renders a Share2 icon with `color="secondary"`. */
  onShare?: () => void;
  /** Download handler — renders a Download icon with `color="info"`. */
  onDownload?: () => void;
  /** When true, disables every button (for in-flight mutations). */
  loading?: boolean;
  /** Extra nodes rendered just before the delete button. */
  customActions?: React.ReactNode;
  /** Project-specific icon size — `"xs"`/`"sm"` map to MUI `"small"`, `"md"` → `"medium"`, `"lg"` → `"large"`. Default `"sm"`. */
  size?: "xs" | "sm" | "md" | "lg";
  /** MUI `<Stack>` spacing between buttons (default `0.5`). */
  spacing?: number;
}

/**
 * Row of icon-only action buttons for tables.
 *
 * Each action is rendered only when its handler prop is provided. Order is fixed: analytics, edit, copy, share, QR, download, `customActions`, delete. Each button gets a Portuguese tooltip and a scale-105 hover micro-interaction.
 */
export function TableActions({
  onEdit,
  onDelete,
  onAnalytics,
  onQR,
  onCopy,
  onShare,
  onDownload,
  loading = false,
  customActions,
  size = "sm",
  spacing = 0.5,
}: TableActionsProps) {
  return (
    <Stack direction="row" spacing={spacing} alignItems="center">
      {onAnalytics ? (
        <Tooltip title="Ver Analytics">
          <IconButton
            onClick={onAnalytics}
            disabled={loading}
            color="success"
            size={mapSize(size)}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(46, 125, 50, 0.08)",
                transform: "scale(1.05)",
                transition: "all 0.2s ease",
              },
            }}
          >
            <BarChart3 {...ICON_MD} />
          </IconButton>
        </Tooltip>
      ) : null}

      {onEdit ? (
        <Tooltip title="Editar">
          <IconButton
            onClick={onEdit}
            disabled={loading}
            color="warning"
            size={mapSize(size)}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(237, 108, 2, 0.08)",
                transform: "scale(1.05)",
                transition: "all 0.2s ease",
              },
            }}
          >
            <Pencil {...ICON_MD} />
          </IconButton>
        </Tooltip>
      ) : null}

      {onCopy ? (
        <Tooltip title="Copiar">
          <IconButton
            onClick={onCopy}
            disabled={loading}
            color="info"
            size={mapSize(size)}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(2, 136, 209, 0.08)",
                transform: "scale(1.05)",
                transition: "all 0.2s ease",
              },
            }}
          >
            <ClipboardCopy {...ICON_MD} />
          </IconButton>
        </Tooltip>
      ) : null}

      {onShare ? (
        <Tooltip title="Compartilhar">
          <IconButton
            onClick={onShare}
            disabled={loading}
            color="secondary"
            size={mapSize(size)}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(156, 39, 176, 0.08)",
                transform: "scale(1.05)",
                transition: "all 0.2s ease",
              },
            }}
          >
            <Share2 {...ICON_MD} />
          </IconButton>
        </Tooltip>
      ) : null}

      {onQR ? (
        <Tooltip title="Gerar QR Code">
          <IconButton
            onClick={onQR}
            disabled={loading}
            color="secondary"
            size={mapSize(size)}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(156, 39, 176, 0.08)",
                transform: "scale(1.05)",
                transition: "all 0.2s ease",
              },
            }}
          >
            <QrCode {...ICON_MD} />
          </IconButton>
        </Tooltip>
      ) : null}

      {onDownload ? (
        <Tooltip title="Download">
          <IconButton
            onClick={onDownload}
            disabled={loading}
            color="info"
            size={mapSize(size)}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(2, 136, 209, 0.08)",
                transform: "scale(1.05)",
                transition: "all 0.2s ease",
              },
            }}
          >
            <Download {...ICON_MD} />
          </IconButton>
        </Tooltip>
      ) : null}

      {customActions}

      {onDelete ? (
        <Tooltip title="Excluir">
          <IconButton
            onClick={onDelete}
            disabled={loading}
            color="error"
            size={mapSize(size)}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(211, 47, 47, 0.08)",
                transform: "scale(1.05)",
                transition: "all 0.2s ease",
              },
            }}
          >
            <Trash2 {...ICON_MD} />
          </IconButton>
        </Tooltip>
      ) : null}
    </Stack>
  );
}

/**
 * Convenience wrapper: `TableActions` pre-configured for the links table (analytics + edit + copy + QR + delete).
 */
export function LinkTableActions({
  onAnalytics,
  onEdit,
  onCopy,
  onQR,
  onDelete,
  loading,
}: Pick<
  TableActionsProps,
  "onAnalytics" | "onEdit" | "onCopy" | "onQR" | "onDelete" | "loading"
>) {
  return (
    <TableActions
      onAnalytics={onAnalytics}
      onEdit={onEdit}
      onCopy={onCopy}
      onQR={onQR}
      onDelete={onDelete}
      loading={loading}
      size="sm"
    />
  );
}

/**
 * Convenience wrapper: `TableActions` pre-configured for the analytics table (edit + download + share).
 */
export function AnalyticsTableActions({
  onEdit,
  onDownload,
  onShare,
  loading,
}: Pick<TableActionsProps, "onEdit" | "onDownload" | "onShare" | "loading">) {
  return (
    <TableActions
      onEdit={onEdit}
      onDownload={onDownload}
      onShare={onShare}
      loading={loading}
      size="sm"
    />
  );
}

export default TableActions;
