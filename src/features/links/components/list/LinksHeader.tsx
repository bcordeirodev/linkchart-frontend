"use client";
import { Link2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_XL } from "@/lib/theme/iconDefaults";
import { PageHeader } from "@/shared/ui/base/PageHeader";

import { LinksHeaderActions } from "./LinksHeaderActions";

interface LinksHeaderProps {
  onCreateNew?: () => void;
}

export function LinksHeader({ onCreateNew }: LinksHeaderProps) {
  const { t } = useTranslation("links");

  return (
    <PageHeader
      title={t("list.pageTitle")}
      subtitle={t("list.pageSubtitle")}
      icon={<Link2 {...ICON_XL} />}
      variant="default"
      showDecorative
      actions={<LinksHeaderActions onCreateNew={onCreateNew} />}
    />
  );
}

export default LinksHeader;
