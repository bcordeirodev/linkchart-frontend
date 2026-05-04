"use client";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LinkOff } from "lucide-react";
import { useLocation } from "@/shared/hooks";
import { ErrorLayout } from "@/shared/layout";
import { useResponsive } from "@/lib/theme";
import useUser from "../../lib/auth/useUser";

function NotFoundPage() {
  const { t } = useTranslation("public");
  const { data: user } = useUser();
  const location = useLocation();
  const { isMobile } = useResponsive();
  const isAuthenticated = !!user;
  const [suggestions, setSuggestions] = useState<
    { label: string; href: string }[]
  >([]);

  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const suggestionList: { label: string; href: string }[] = [];

    if (isAuthenticated) {
      suggestionList.push({ label: "Meus Links", href: "/links" });
      if (pathSegments.length > 1) {
        suggestionList.push({
          label: "Seção Principal",
          href: `/${pathSegments[0]}`,
        });
      }
    } else {
      suggestionList.push({ label: "Encurtador", href: "/shorter" });
    }

    setSuggestions(suggestionList);
  }, [location.pathname, isAuthenticated]);

  return (
    <ErrorLayout
      errorType="404"
      suggestions={suggestions}
      backgroundText="404"
      iconNode={<LinkOff size={isMobile ? 36 : 48} />}
    >
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: 700, color: "text.primary" }}
      >
        {t("notFound.title")}
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 4, color: "text.secondary", maxWidth: 480, mx: "auto" }}
      >
        {t("notFound.description")}
      </Typography>
    </ErrorLayout>
  );
}

export default NotFoundPage;
