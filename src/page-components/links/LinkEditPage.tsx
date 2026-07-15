"use client";

import { Alert, Stack, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";

import { EditLinkForm, LinkActions } from "@/features/links";
import { useLinkById } from "@/features/links/hooks/useLinks";
import { AppIcon } from "@/shared/ui/icons";
import { ResponsiveContainer } from "@/shared/ui/base";
import { LinkFormSkeleton } from "@/shared/ui/feedback/skeletons";

import AuthGuardRedirect from "../../lib/auth/AuthGuardRedirect";

/**
 * 📝 Página de Edição de Link - REFATORADA
 * Segue padrões arquiteturais: < 100 linhas, carrega dados iniciais
 * Estrutura: PageBreadcrumb → Actions → LinkForm.
 */
interface Props {
  id: string;
}

function LinkEditPage({ id }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation("links");
  const { t: tCommon } = useTranslation("common");
  const { data: link, isLoading: linkHeaderLoading } = useLinkById(id);

  const handleDeleteSuccess = () => {
    navigate("/links");
  };

  // Validação de ID
  if (!id) {
    return (
      <AuthGuardRedirect
        auth={["user", "admin"]}
        fallback={<LinkFormSkeleton isEdit />}
      >
        <ResponsiveContainer variant="form" maxWidth="md">
          <Stack spacing={{ xs: 2, sm: 2.5 }}>
            <Alert
              severity="error"
              action={
                <Button
                  size="small"
                  startIcon={<AppIcon intent="back" size={16} />}
                  onClick={() => navigate(-1)}
                >
                  {tCommon("actions.back")}
                </Button>
              }
            >
              <strong>{t("errors.missingLinkId")}</strong>
              <br />
              {t("errors.missingLinkIdDetail")}
            </Alert>
          </Stack>
        </ResponsiveContainer>
      </AuthGuardRedirect>
    );
  }

  return (
    <AuthGuardRedirect
      auth={["user", "admin"]}
      fallback={<LinkFormSkeleton isEdit />}
    >
      <ResponsiveContainer variant="form" maxWidth="md">
        <Stack spacing={{ xs: 2, sm: 2.5 }}>
          {!linkHeaderLoading && link ? (
            <LinkActions
              linkId={id}
              currentView="edit"
              slug={link.slug || link.custom_slug}
              shortUrl={link.short_url}
              title={link.title}
              onDeleteSuccess={handleDeleteSuccess}
            />
          ) : null}

          <EditLinkForm linkId={id} />
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}

export default LinkEditPage;
