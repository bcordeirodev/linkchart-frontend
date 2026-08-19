import { Box, Typography } from "@mui/material";
import { formatDistanceToNow, isValid, parse, parseISO } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { useTranslation } from "react-i18next";

import { LinkActionsShortUrl } from "./LinkActionsShortUrl";

interface LinkActionsTitleRowProps {
  /**
   * Nome da página em que o header está ("Estatísticas do link", "Editar
   * link", …), já traduzido pelo chamador. É o `<h1>` da tela — sem ele o
   * heading seria só o título que o usuário deu ao link e a página não
   * diria o que ela própria é.
   */
  pageTitle: string;
  /**
   * Uma linha curta sob o título dizendo o que a página faz, já traduzida
   * pelo chamador (ex.: "Cliques, público e origens deste link em tempo
   * real.").
   */
  description?: string;
  /**
   * Nome de exibição do link — o título dado pelo usuário ou, sem título,
   * a URL curta sem protocolo. Vira a linha de identidade "LINK …" sob a
   * descrição.
   */
  linkName?: string;
  /**
   * `created_at` do link como veio da API (`dd/MM/yyyy HH:mm:ss` ou ISO),
   * para o "criado há X dias" da identidade.
   */
  createdAt?: string;
  shortUrl?: string;
}

/**
 * Converte o `created_at` do link em `Date`, aceitando os dois formatos que
 * a API emite: `LinkResource` serializa como `dd/MM/yyyy HH:mm:ss` (formato
 * de exibição pt-BR — `new Date()` não entende e em dias > 12 vira Invalid
 * Date), enquanto outros endpoints usam ISO 8601.
 *
 * @param value String de data vinda da API.
 * @returns O `Date` correspondente, ou `null` quando nenhum formato casa.
 */
function parseCreatedAt(value: string): Date | null {
  const brFormat = parse(value, "dd/MM/yyyy HH:mm:ss", new Date());
  if (isValid(brFormat)) {
    return brFormat;
  }
  const iso = parseISO(value);
  return isValid(iso) ? iso : null;
}

/**
 * Bloco de identidade do header das páginas individuais de link: `<h1>` com
 * o nome da página, descrição de uma linha e a linha de identidade do link
 * (label mono "LINK" + título + idade), além da URL curta no mobile — no
 * desktop a URL já aparece na faixa de copiar do canto superior direito.
 */
export function LinkActionsTitleRow({
  pageTitle,
  description,
  linkName,
  createdAt,
  shortUrl,
}: LinkActionsTitleRowProps) {
  const { t, i18n } = useTranslation("links");

  const createdDate = createdAt ? parseCreatedAt(createdAt) : null;
  const createdAgo = createdDate
    ? t("linkIdentity.createdAgo", {
        time: formatDistanceToNow(createdDate, {
          addSuffix: true,
          locale: i18n.language === "pt-BR" ? ptBR : enUS,
        }),
      })
    : null;

  return (
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography
        variant="h6"
        component="h1"
        sx={{
          fontSize: { xs: "1.375rem", sm: "1.5rem" },
          fontWeight: 700,
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {pageTitle}
      </Typography>
      {description ? (
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: "text.secondary",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {description}
        </Typography>
      ) : null}
      {linkName ? (
        // A linha de identidade dispensa label: a descrição logo acima já diz
        // "deste link", então o nome em peso 600 colado nela lê como "o link é
        // este". Só o nome carrega peso; idade fica em secondary após um
        // middot em disabled — um degrau abaixo, como metadado.
        <Box
          sx={{
            mt: 0.75,
            display: "flex",
            alignItems: "baseline",
            gap: 0.75,
            minWidth: 0,
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {linkName}
          </Typography>
          {createdAgo ? (
            <>
              <Typography
                component="span"
                aria-hidden
                variant="body2"
                sx={{ color: "text.disabled", flexShrink: 0 }}
              >
                ·
              </Typography>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: "text.secondary", flexShrink: 0 }}
              >
                {createdAgo}
              </Typography>
            </>
          ) : null}
        </Box>
      ) : null}
      {/* Desktop already shows the short URL inside the copy strip (top
          right); repeating it under the title said the same thing twice.
          On mobile the strip collapses to a plain button, so the URL line
          is the only visible address and stays. */}
      {shortUrl ? (
        <Box sx={{ mt: 0.5, display: { xs: "block", sm: "none" } }}>
          <LinkActionsShortUrl url={shortUrl} />
        </Box>
      ) : null}
    </Box>
  );
}

export default LinkActionsTitleRow;
