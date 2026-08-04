"use client";
import { useState } from "react";
import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  MoreVertical,
  Pencil,
  Power,
  PowerOff,
  QrCode,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ICON_SM, ICON_MD } from "@/lib/theme/iconDefaults";

interface LinkActionsMenuProps {
  onEdit: () => void;
  onQR: () => void;
  onDelete: () => void;
  /**
   * Current `is_active` value for this link — picks the toggle item's label/icon
   * ("Desativar"/`PowerOff` when active, "Ativar"/`Power` when inactive) and the
   * direction `onToggleActive` is expected to move the link in.
   */
  isActive: boolean;
  /** Runs the activate/deactivate mutation (the label already reflects the direction). */
  onToggleActive: () => void;
  /** True while the toggle mutation is in flight — disables the item to avoid a duplicate request. */
  toggleActiveDisabled?: boolean;
}

/**
 * Overflow menu for a single link card/row: edit, QR code, activate/deactivate
 * and delete. Shared by the desktop (`LinkCardRich`) and mobile
 * (`LinksMobileCards`) card variants so both list views expose the same actions.
 */
export function LinkActionsMenu({
  onEdit,
  onQR,
  onDelete,
  isActive,
  onToggleActive,
  toggleActiveDisabled = false,
}: LinkActionsMenuProps) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("links");

  /** Opens the menu anchored to the triggering icon button; stops the click from also activating the card underneath it. */
  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchor(e.currentTarget);
  };

  /** Closes the menu without running any action. */
  const handleClose = () => setAnchor(null);

  /** Closes the menu, then runs the selected item's action. */
  const run = (action: () => void) => {
    handleClose();
    action();
  };

  return (
    <>
      <Tooltip title={t("table.actions")}>
        <IconButton
          data-tour="link-actions"
          size="small"
          onClick={handleOpen}
          aria-label={t("table.actionsMenu")}
          aria-haspopup="menu"
          aria-expanded={Boolean(anchor)}
          sx={{
            // 44px touch target on phones (this menu sits on every list card);
            // reverts to the compact small size on larger screens.
            width: { xs: 44, sm: "auto" },
            height: { xs: 44, sm: "auto" },
            color: "text.secondary",
            "&:hover": { color: "text.primary", bgcolor: "action.hover" },
          }}
        >
          <MoreVertical {...ICON_MD} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={() => run(onEdit)}>
          <ListItemIcon>
            <Pencil {...ICON_SM} />
          </ListItemIcon>
          <ListItemText>{tCommon("actions.edit")}</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => run(onQR)}>
          <ListItemIcon>
            <QrCode {...ICON_SM} />
          </ListItemIcon>
          <ListItemText>{tCommon("actions.qrCode")}</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => run(onToggleActive)}
          disabled={toggleActiveDisabled}
        >
          <ListItemIcon>
            {isActive ? <PowerOff {...ICON_SM} /> : <Power {...ICON_SM} />}
          </ListItemIcon>
          <ListItemText>
            {isActive ? t("actions.deactivate") : t("actions.activate")}
          </ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => run(onDelete)} sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "error.main" }}>
            <Trash2 {...ICON_SM} />
          </ListItemIcon>
          <ListItemText>{tCommon("actions.delete")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
