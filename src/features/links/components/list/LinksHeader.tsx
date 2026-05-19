"use client";
import { Link2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { PageHeader } from "@/shared/ui/base/PageHeader";

/**
 * Page-level header for the links list page.
 * The "New Link" action was removed — quick creation is handled by LinksQuickCreate inline.
 */
export function LinksHeader() {
  const { t } = useTranslation("links");

  return (
    <PageHeader
      title={t("list.pageTitle")}
      subtitle={t("list.pageSubtitle")}
      icon={<Link2 {...ICON_MD} />}
      variant="default"
      showDecorative
      compact
    />
  );
}

export default LinksHeader;
