"use client";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";

/**
 * One row of the endpoint map: HTTP method + path (monospace) and a one-line
 * purpose. The method gets a fixed-width slot so the paths align vertically.
 */
interface EndpointRow {
  method: "GET" | "POST";
  path: string;
  /** i18n key (within the `apiKeys:usage.endpoints.items` object). */
  purposeKey: "create" | "list" | "show" | "stats" | "subdomains";
}

const ENDPOINTS: EndpointRow[] = [
  { method: "POST", path: "/api/v1/links", purposeKey: "create" },
  { method: "GET", path: "/api/v1/links", purposeKey: "list" },
  { method: "GET", path: "/api/v1/links/{id}", purposeKey: "show" },
  { method: "GET", path: "/api/v1/links/{id}/stats", purposeKey: "stats" },
  { method: "GET", path: "/api/v1/subdomains", purposeKey: "subdomains" },
];

/**
 * Compact map of every public API endpoint: the "what exists" answer that
 * curl examples alone can't give. Five rows, method+path in monospace, one
 * line of purpose each, and a closing caption stating what the API does NOT
 * do yet (edit/delete links) — a documented limitation beats silence.
 *
 * The table scrolls horizontally inside its own container on narrow
 * viewports; the page never scrolls sideways.
 */
export function ApiKeyEndpointMap() {
  const { t } = useTranslation("apiKeys");

  return (
    <Box>
      <Typography variant="subtitle2" component="h3" sx={{ mb: 1 }}>
        {t("usage.endpoints.heading")}
      </Typography>
      <Box
        sx={{
          overflowX: "auto",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: `${radiusTokens.md}px`,
        }}
      >
        <Table size="small" sx={{ minWidth: 480 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                {t("usage.endpoints.columns.endpoint")}
              </TableCell>
              <TableCell>{t("usage.endpoints.columns.purpose")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ENDPOINTS.map((row) => (
              <TableRow
                key={`${row.method} ${row.path}`}
                sx={{ "&:last-child td": { border: 0 } }}
              >
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Typography
                    component="code"
                    sx={{ fontFamily: "monospace", fontSize: "0.78rem" }}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        minWidth: 44,
                        fontWeight: 700,
                      }}
                    >
                      {row.method}
                    </Box>
                    {row.path}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {t(`usage.endpoints.items.${row.purposeKey}`)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 0.75 }}
      >
        {t("usage.endpoints.note")}
      </Typography>
    </Box>
  );
}

export default ApiKeyEndpointMap;
