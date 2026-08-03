"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ArrowUpRight,
  CheckCircle2,
  Link2,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useLinkCreationOrchestration } from "@/features/links/hooks/useLinkCreationOrchestration";
import { useCreateLink } from "@/features/links/hooks/useLinks";
import { useSlugSuggestionField } from "@/features/links/hooks/useSlugSuggestionField";
import { RESERVED_SLUGS } from "@/features/links/utils/slugAvailabilityCheck";
import {
  buildSlugAvailabilityLabels,
  buildUrlSafetyLabels,
  getUrlSafetyHelperNode,
} from "@/features/links/components/forms/UrlSafetyIndicator";
import { useSubdomainSelection } from "@/features/subdomains/hooks/useSubdomainSelection";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import { getShortUrlPrefix } from "@/lib/utils/shortUrl";
import { typographyScale } from "@/lib/theme";
import { HelpHint, SectionLabel } from "@/shared/ui/base";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { useNavigate } from "@/shared/hooks";

import { QuickCreateLinkStrip } from "./QuickCreateLinkStrip";
import {
  linksRadius,
  getLinksBorderColor,
  getLinksControlFillBg,
  getLinksCardSx,
} from "./linksPanelStyles";

import type { LinkResponse } from "@/types";
import type { Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

interface LinksQuickCreateProps {
  /** Called after a link is created (list is invalidated by the mutation). */
  onLinkCreated?: (link: LinkResponse) => void;
}

type QuickFormData = {
  original_url: string;
  custom_slug?: string;
};

/**
 * Altura única do grupo "hero" do quick-create — URL input, botão Encurtar e
 * o composto de link curto abaixo compartilham esta mesma altura (antes
 * 44/44/46, uma inconsistência de 2px que fazia o conjunto ler como duas
 * fileiras desalinhadas em vez de um único grupo de controles desenhado).
 */
const CONTROL_HEIGHT = 48;

/**
 * Opaque stand-in for `getLinksControlFillBg`'s translucent fill, used ONLY
 * by the `-webkit-autofill` paint trick below — never as the field's visible
 * background. Chrome/Safari paint their own autofill tint (yellow) *behind*
 * whatever background the input declares, and the standard way to hide that
 * tint is `box-shadow: 0 0 0 100px <color> inset`; that trick only works
 * with a fully opaque color; at ~3% alpha the yellow bleeds straight
 * through it.
 *
 * Precomputed by flattening `getLinksControlFillBg`'s overlay
 * (`alpha(white, 0.03)` dark / `alpha(black, 0.02)` light) over
 * `theme.palette.background.default` (`darkNeutral.bg` `#030405` /
 * `lightNeutral.bg` `#FAFAFA`) — standard `src*alpha + dst*(1-alpha)` per
 * channel:
 * - dark: `255*0.03 + 3*0.97 ≈ 11`, `255*0.03 + 4*0.97 ≈ 12`,
 *   `255*0.03 + 5*0.97 ≈ 13` → `rgb(11,12,13)` = `#0B0C0D`.
 * - light: `0*0.02 + 250*0.98 = 245` (all channels, `#FAFAFA` is neutral
 *   gray) → `rgb(245,245,245)` = `#F5F5F5`.
 *
 * Recompute this pair if `getLinksControlFillBg`'s alpha values or either
 * background color ever change.
 */
const AUTOFILL_OPAQUE_BG = { dark: "#0B0C0D", light: "#F5F5F5" } as const;

const getInputRootSx = (theme: Theme) => {
  // Segue a mesma "gramática translúcida" dos cards (ver
  // `getLinksControlFillBg`/`getLinkCardShellSx`/`MuiCard`): um véu sutil em
  // vez do preenchimento sólido `darkNeutral.input` que antes destoava do
  // resto da seção, agora sem caixa ao redor.
  const bg = getLinksControlFillBg(theme);
  const borderColor = getLinksBorderColor(theme);
  const autofillBg =
    theme.palette.mode === "dark"
      ? AUTOFILL_OPAQUE_BG.dark
      : AUTOFILL_OPAQUE_BG.light;

  return {
    "& .MuiOutlinedInput-root": {
      height: CONTROL_HEIGHT,
      // Radius sm: controles internos um degrau abaixo do painel (md) —
      // hierarquia de arredondamento em vez de tudo igualmente redondo.
      borderRadius: `${linksRadius.control}px`,
      bgcolor: bg,
      fontSize: "0.9375rem",
      "&:hover": { bgcolor: bg },
      "&.Mui-focused": { bgcolor: `${bg} !important` },
      // Estado de repouso alinhado à borda do composto de link curto logo
      // abaixo (mesma função, mesma cor) — hover/foco continuam no
      // comportamento padrão do MUI (secondary, ver `MuiTextField.defaultProps`).
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor,
      },
      "& input": {
        py: 0,
        height: "100%",
        boxSizing: "border-box",
      },
      "& input:-webkit-autofill": {
        // Opaque `autofillBg`, not the translucent `bg` — see
        // `AUTOFILL_OPAQUE_BG` above.
        WebkitBoxShadow: `0 0 0 100px ${autofillBg} inset`,
        WebkitTextFillColor: theme.palette.text.primary,
      },
    },
    "& .MuiFormHelperText-root": {
      mx: 0,
      mt: 0.75,
    },
  };
};

const submitButtonSx = {
  height: CONTROL_HEIGHT,
  minHeight: CONTROL_HEIGHT,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.9375rem",
  minWidth: { md: 140 },
  borderRadius: `${linksRadius.control}px`,
  whiteSpace: "nowrap",
  px: 2.5,
};

const getAdvancedOptionsButtonSx = (theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  const borderColor = getLinksBorderColor(theme);
  const ink = theme.palette.text.primary;

  return {
    "&.MuiButton-sizeSmall": {
      minHeight: 26,
      padding: "2px 8px",
    },
    textTransform: "none",
    fontWeight: 500,
    fontSize: "0.75rem",
    lineHeight: 1.2,
    borderRadius: `${linksRadius.control}px`,
    color: "text.secondary",
    borderColor,
    bgcolor: "transparent",
    px: 0.875,
    py: 0.25,
    minHeight: 26,
    whiteSpace: "nowrap",
    boxShadow: "none",
    transition: theme.transitions.create(
      ["background-color", "border-color", "color"],
      { duration: 150 },
    ),
    "& .MuiButton-startIcon": {
      marginRight: 0.375,
      marginLeft: -0.125,
      "& svg": { width: 13, height: 13 },
    },
    "& .MuiButton-endIcon": {
      marginLeft: 0.125,
      marginRight: -0.125,
      "& svg": { width: 12, height: 12 },
    },
    "&:hover": {
      color: "text.primary",
      bgcolor: alpha(ink, isDark ? 0.06 : 0.04),
      borderColor: alpha(ink, isDark ? 0.28 : 0.2),
      boxShadow: "none",
    },
  };
};

/**
 * Inline quick-create form at the top of the links list page.
 *
 * Two rows, one idea: the destination goes in the top row, and the bottom row
 * *is* the short link being made — domain, slash and an editable name that
 * fills itself in from the destination page's title. After a successful create
 * that same row becomes the finished link with copy and open, so the thing the
 * user came for never disappears into the list below.
 *
 * The name field's ownership rules (when a suggestion may overwrite it, when it
 * must not) live in {@link useSlugSuggestionField}.
 */
export function LinksQuickCreate({
  onLinkCreated,
}: LinksQuickCreateProps = {}) {
  const theme = useTheme();
  const { t } = useTranslation("links");
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateLink();
  const [succeeded, setSucceeded] = useState(false);
  const { subdomains, subdomainId, setSubdomainId, subdomainIdField } =
    useSubdomainSelection();
  // Only shown/considered once the flag is on AND the account actually holds
  // a subdomain — otherwise quick-create stays exactly as it was: no domain
  // prefix, no extra control, one less thing to look at for the common case.
  const hasSubdomains =
    process.env.NEXT_PUBLIC_SUBDOMAINS_ENABLED === "true" &&
    subdomains.length > 0;
  // `NEXT_PUBLIC_REDIRECT_URL` still carries the legacy `/r` segment in local
  // dev; production already points at a bare redirect host. The preview drops
  // it either way, and what it shows still resolves — `routes/web.php` serves
  // the clean `/{slug}` alias alongside `/r/{slug}`.
  const defaultHost = getShortUrlPrefix()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .replace(/\/r$/, "");

  const schema = useMemo(
    () =>
      z.object({
        original_url: z
          .string()
          .min(1, t("form.validation.urlRequired"))
          .url(t("form.validation.urlInvalid"))
          .regex(/^https?:\/\//, t("form.validation.urlScheme")),
        custom_slug: z
          .string()
          .min(3, t("form.validation.slugMin"))
          .max(100, t("form.validation.slugMax"))
          .regex(/^[a-zA-Z0-9\-_]+$/, t("form.validation.slugPattern"))
          .refine(
            (s) =>
              !(RESERVED_SLUGS as readonly string[]).includes(s.toLowerCase()),
            t("form.validation.slugReserved"),
          )
          .optional()
          .or(z.literal("")),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuickFormData>({
    resolver: zodResolver(schema),
    defaultValues: { original_url: "", custom_slug: "" },
  });

  const urlValue = watch("original_url");
  const slugValue = watch("custom_slug") ?? "";

  // Programmatic writes skip validation: they are either a slug the server
  // already vetted or an empty field, and running zod on them would surface
  // errors for a value the user never typed.
  const writeSlug = useCallback(
    (next: string) => {
      setValue("custom_slug", next, { shouldValidate: false });
    },
    [setValue],
  );

  const slugField = useSlugSuggestionField({
    url: urlValue ?? "",
    value: slugValue,
    onChange: writeSlug,
  });

  // Destructured so `createLink` can depend on the stable callback rather than
  // on the hook's return object, which is a new identity every render.
  const { reset: resetSlugField } = slugField;

  const slugAvailabilityLabels = buildSlugAvailabilityLabels(t);
  const slugIsTaken = slugField.state === "taken";

  const urlSafetyLabels = buildUrlSafetyLabels(t);

  const createLink = useCallback(
    (data: QuickFormData): Promise<LinkResponse> =>
      mutateAsync({
        original_url: data.original_url,
        custom_slug: data.custom_slug || undefined,
        // `subdomainIdField` is `{ subdomain_id }` once the subdomains list
        // has loaded (and the feature is on), or `undefined` while still
        // loading — spreading `undefined` omits the key entirely instead of
        // sending an explicit `null`, which the backend would read as
        // "force the default domain" rather than "use the user's oldest
        // active subdomain". See `useSubdomainSelection` for the rationale.
        ...subdomainIdField,
      }),
    [mutateAsync, subdomainIdField],
  );

  // Centralized Safe Browsing gate + queue-while-checking behaviour (shared
  // with the public shortener and the full create form) — see
  // `useLinkCreationOrchestration`. A slug already known to be taken is an
  // extra hard block here: submitting it would just come back as a 422.
  const {
    threats,
    isUnsafe: urlIsUnsafe,
    submitQueued,
    guardedSubmit,
  } = useLinkCreationOrchestration<QuickFormData, LinkResponse>({
    strategy: "authenticated",
    url: urlValue ?? "",
    create: createLink,
    queueWhileSettling: true,
    isExtraBlocked: slugIsTaken,
    onSuccess: (link) => {
      // Everything the user needs after a create already happens in the list:
      // `useNewlyCreatedLinkHighlight` sorts the new link to the top, scrolls
      // its card into view, pulses it, and copies the short URL to the
      // clipboard. The box only has to get out of the way.
      onLinkCreated?.(link);
      reset();
      resetSlugField();
      setSucceeded(true);
      setTimeout(() => setSucceeded(false), 2000);
    },
    // No `onError`: the mutation's own `onError` (in `useCreateLink`) already
    // dispatches the error toast, so a create failure here is a silent no-op —
    // matching this surface's behaviour before the extraction.
  });

  // Safety is silent by default: a confirmed-safe URL or an in-flight check shows
  // nothing. The field speaks only to report a real problem — an invalid URL
  // (zod) or an unsafe destination (in error tone). The submit guard inside
  // `useLinkCreationOrchestration` still blocks unsafe/checking regardless of
  // what is shown here.
  const urlHelperText: ReactNode =
    errors.original_url?.message ??
    (urlIsUnsafe
      ? getUrlSafetyHelperNode("unsafe", threats, urlSafetyLabels)
      : null);

  const inputRootSx = getInputRootSx(theme);
  const slugRegister = register("custom_slug");
  const slugHasError = !!errors.custom_slug || slugIsTaken;

  // Only real problems get a message — plus the one quiet note that explains
  // what happens when the name is left blank on purpose.
  const slugMessage: { text: string; tone: "error" | "muted" } | null = errors
    .custom_slug?.message
    ? { text: errors.custom_slug.message, tone: "error" }
    : slugIsTaken
      ? { text: slugAvailabilityLabels.taken, tone: "error" }
      : slugField.state === "autoCode"
        ? { text: t("list.quickCreate.previewAutoHint"), tone: "muted" }
        : slugField.state === "unavailable"
          ? {
              text: t("list.quickCreate.slugSuggestionUnavailable"),
              tone: "muted",
            }
          : null;

  return (
    <Box>
      <SectionLabel
        headingLevel={2}
        action={
          <Stack direction="row" spacing={0.5} alignItems="center">
            {/* Oculto no xs: a descrição (visível no celular) já diz a mesma
                coisa, e o "?" extra quebrava a linha da action ao lado do
                botão "Mais opções". */}
            <Box
              component="span"
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              <HelpHint label={t("list.onboarding.hintQuickCreate")} />
            </Box>
            <Tooltip title={t("list.quickCreate.moreOptionsTooltip")} arrow>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate("/links/create")}
                aria-label={t("list.quickCreate.moreOptions")}
                startIcon={<SlidersHorizontal size={13} strokeWidth={1.75} />}
                endIcon={<ArrowUpRight size={12} strokeWidth={2} />}
                sx={[
                  getAdvancedOptionsButtonSx(theme),
                  {
                    "& .MuiButton-startIcon": {
                      mr: 0.375,
                    },
                    "& .MuiButton-endIcon": {
                      display: { xs: "none", sm: "inline-flex" },
                    },
                  },
                ]}
              >
                {/* Rótulo sempre visível: no toque não existe hover, e um
                    ícone de sliders sozinho não diz nada a quem é leigo.
                    No xs entra a versão curta para caber ao lado do título. */}
                <Box
                  component="span"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  {t("list.quickCreate.moreOptions")}
                </Box>
                <Box
                  component="span"
                  sx={{ display: { xs: "inline", sm: "none" } }}
                >
                  {t("list.quickCreate.moreOptionsShort")}
                </Box>
              </Button>
            </Tooltip>
          </Stack>
        }
      >
        {t("list.quickCreate.label")}
      </SectionLabel>

      {/* Nível 1: o cluster inteiro (descrição + controles) volta para dentro
          de um card translúcido com hairline — o SectionLabel fica FORA,
          ancorando a seção; "organizar bem os blocos" (gate) pede um
          container visível em vez do formulário solto direto no fundo da
          página, mesmo tratamento que /subdomains usa (`getLinksCardSx` é o
          equivalente local de `getSubdomainCardSx`). */}
      <EnhancedPaper
        variant="outlined"
        animated={false}
        sx={{
          mt: { xs: 1.5, sm: 2 },
          p: { xs: 2.5, sm: 3 },
          ...getLinksCardSx(theme),
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: { xs: 1.5, sm: 2 } }}
        >
          {t("list.quickCreate.description")}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(guardedSubmit)} noValidate>
          {/* Fileira 1 — o destino: o que se cola, e a ação principal. */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { sm: "center" },
              gap: { xs: 1.25, sm: 1.5 },
            }}
          >
            <TextField
              {...register("original_url")}
              placeholder={t("list.quickCreate.urlPlaceholder")}
              size="small"
              fullWidth
              error={!!errors.original_url || urlIsUnsafe}
              disabled={isPending}
              sx={[inputRootSx, { flexGrow: 1, minWidth: 0 }]}
              slotProps={{
                htmlInput: { "aria-label": t("list.quickCreate.urlLabel") },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Link2
                        {...ICON_SM}
                        color={theme.palette.text.secondary}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isPending || urlIsUnsafe || submitQueued || slugIsTaken}
              startIcon={
                succeeded ? (
                  <CheckCircle2 {...ICON_SM} />
                ) : isPending || submitQueued ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <Zap {...ICON_SM} />
                )
              }
              sx={[
                submitButtonSx,
                { flexShrink: 0, width: { xs: "100%", sm: "auto" } },
              ]}
            >
              {succeeded
                ? t("list.quickCreate.success")
                : t("list.quickCreate.submit")}
            </Button>
          </Box>

          {/* Fileira 2 — o link curto propriamente dito. Rótulo em mono caps,
            mesma família/tamanho do prefixo "/" do SectionLabel — o composto
            abaixo é o "momento de marca" da página, então o rótulo que o
            introduz fala a mesma língua tipográfica em vez de usar a caption
            padrão (Inter) do resto do formulário. */}
          <Box sx={{ mt: 1.5 }}>
            <Typography
              component="div"
              sx={{
                fontFamily: typographyScale.code.fontFamily,
                fontSize: "0.6875rem",
                color: "text.secondary",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                mb: 0.625,
              }}
            >
              {t("list.quickCreate.shortLinkLabel")}
            </Typography>

            <QuickCreateLinkStrip
              name={slugRegister.name}
              inputRef={slugRegister.ref}
              value={slugValue}
              onChange={(e) => {
                slugField.markEdited();
                void slugRegister.onChange(e);
              }}
              onBlur={slugRegister.onBlur}
              state={slugField.state}
              onRequestAnother={slugField.requestAnother}
              canRequestAnother={slugField.canRequestAnother}
              hasSubdomains={hasSubdomains}
              subdomainId={subdomainId}
              onSubdomainChange={setSubdomainId}
              defaultHost={defaultHost}
              disabled={isPending}
              error={slugHasError}
            />
          </Box>

          {/* Linha de mensagens — materializa só quando há algo a dizer. */}
          {urlHelperText || slugMessage ? (
            <Box
              sx={{
                mt: 1,
                display: "flex",
                flexDirection: "column",
                gap: 0.25,
              }}
            >
              {urlHelperText ? (
                <Typography variant="caption" component="div" color="error">
                  {urlHelperText}
                </Typography>
              ) : null}
              {slugMessage ? (
                <Typography
                  variant="caption"
                  component="div"
                  color={
                    slugMessage.tone === "error" ? "error" : "text.secondary"
                  }
                >
                  {slugMessage.text}
                </Typography>
              ) : null}
            </Box>
          ) : null}
        </Box>
      </EnhancedPaper>
    </Box>
  );
}

export default LinksQuickCreate;
