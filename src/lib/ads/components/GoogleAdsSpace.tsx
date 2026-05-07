import { GoogleAd } from "./GoogleAd";

import type { SxProps } from "@mui/material";
import type { AdSlotType } from "../hooks/useGoogleAds";

interface GoogleAdsSpaceProps {
  variant: AdSlotType;
  sx?: SxProps;
  showFallback?: boolean;
}

/**
 * 📢 ESPAÇO PARA GOOGLE ADS - REFATORADO
 *
 * Componente que renderiza anúncios reais do Google AdSense
 * Com fallback para desenvolvimento e casos onde ads não carregam
 */
export function GoogleAdsSpace({
  variant,
  sx,
  showFallback = false,
}: GoogleAdsSpaceProps) {
  return <GoogleAd variant={variant} sx={sx} showFallback={showFallback} />;
}
