"use client";

import { Alert, Box, Stack, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";

import { EditLinkForm, LinkActions } from "@/features/links";
import { useLinkById } from "@/features/links/hooks/useLinks";
import { AppIcon } from "@/shared/ui/icons";
import { ResponsiveContainer } from "@/shared/ui/base";
import { LinkFormSkeleton } from "@/shared/ui/feedback/skeletons";

import AuthGuardRedirect from "../../lib/auth/AuthGuardRedirect";

/**
 * Página de edição de link — sem `PageHeader`/breadcrumb próprio:
 * `LinkActions` é o único chrome (back navigation, título, URL curta, view
 * switcher e o overflow menu de excluir), seguido do formulário
 * `EditLinkForm`. Mostra um `Alert` com botão de voltar quando `id` está
 * ausente (link direto malformado); enquanto os dados do link carregam,
 * `LinkActions` fica oculto e só `EditLinkForm` (com seu próprio skeleton)
 * é exibido.
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
          <Stack spacing={{ xs: 2, sm: 2.5 }} className="reveal reveal-1">
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
            <Box className="reveal reveal-1">
              <LinkActions
                linkId={id}
                currentView="edit"
                slug={link.slug || link.custom_slug}
                shortUrl={link.short_url}
                title={link.title}
                createdAt={link.created_at}
                clicks={link.clicks}
                onDeleteSuccess={handleDeleteSuccess}
              />
            </Box>
          ) : null}

          <Box className="reveal reveal-2">
            <EditLinkForm linkId={id} />
          </Box>
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}

export default LinkEditPage;
