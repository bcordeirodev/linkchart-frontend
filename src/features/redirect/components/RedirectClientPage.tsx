"use client";
import { ExternalLink, AlertCircle, ShieldCheck } from "lucide-react";
import {
  Box,
  useTheme,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Stack,
  GlobalStyles,
  Fade,
  Grow,
} from "@mui/material";
import { ICON_LG, ICON_XL } from "@/lib/theme/iconDefaults";
import { useEffect, useState, useCallback } from "react";

const animations = `
	@keyframes pulse {
		0% { transform: scale(1); opacity: 1; }
		50% { transform: scale(1.1); opacity: 0.7; }
		100% { transform: scale(1); opacity: 1; }
	}
	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(30px); }
		to { opacity: 1; transform: translateY(0); }
	}
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
`;

export default function RedirectClientPage({ slug }: { slug: string }) {
  const theme = useTheme();

  const [targetUrl, setTargetUrl] = useState<string>("");
  const [linkTitle, setLinkTitle] = useState<string>("");
  const [isValidLink, setIsValidLink] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [capturedIP, setCapturedIP] = useState<string | null>(null);

  const isValidIPv4 = useCallback((ip: string): boolean => {
    const ipv4Regex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
  }, []);

  const isValidIPv6 = useCallback((ip: string): boolean => {
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
    return ipv6Regex.test(ip);
  }, []);

  const getUserRealIP = useCallback(async (): Promise<string | null> => {
    try {
      const cachedIP = sessionStorage.getItem("user_real_ip");
      const cacheTime = sessionStorage.getItem("user_real_ip_time");
      if (cachedIP && cacheTime && Date.now() - parseInt(cacheTime) < 300000) {
        if (isValidIPv4(cachedIP) || isValidIPv6(cachedIP)) return cachedIP;
      }

      const ipServices = [
        "https://ipapi.co/json/",
        "https://api.ipify.org?format=json",
        "https://api64.ipify.org?format=json",
      ];

      for (const service of ipServices) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);
          const response = await fetch(service, {
            method: "GET",
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          if (response.ok) {
            const data = await response.json();
            const ip = data.ip || data.query || null;
            if (ip && (isValidIPv4(ip) || isValidIPv6(ip))) {
              sessionStorage.setItem("user_real_ip", ip);
              sessionStorage.setItem(
                "user_real_ip_time",
                Date.now().toString(),
              );
              return ip;
            }
          }
        } catch {
          continue;
        }
      }
      return null;
    } catch {
      return null;
    }
  }, [isValidIPv4, isValidIPv6]);

  const isExternalUrl = useCallback((url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  }, []);

  const performRedirect = useCallback(
    (url: string) => {
      if (!isExternalUrl(url)) {
        setError("URL inválida ou insegura");
        return;
      }
      window.location.href = url;
    },
    [isExternalUrl],
  );

  const startCountdown = useCallback(
    (initialCount = 3) => {
      setCountdown(initialCount);
      setIsRedirecting(true);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            performRedirect(targetUrl);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    },
    [targetUrl, performRedirect],
  );

  useEffect(() => {
    const captureIPInBackground = async () => {
      try {
        const ip = await getUserRealIP();
        if (ip && (isValidIPv4(ip) || isValidIPv6(ip))) setCapturedIP(ip);
      } catch {
        // ignore
      }
    };
    captureIPInBackground();
  }, [getUserRealIP, isValidIPv4, isValidIPv6]);

  useEffect(() => {
    const fetchRedirectData = async () => {
      if (!slug) {
        setError("Código de redirecionamento não fornecido");
        return;
      }

      try {
        let userIP = capturedIP;

        if (!userIP) {
          userIP = await Promise.race([
            getUserRealIP(),
            new Promise<null>((resolve) =>
              setTimeout(() => resolve(null), 1000),
            ),
          ]);
        }

        let requestUrl = `/api/public/link/${slug}`;
        if (userIP && (isValidIPv4(userIP) || isValidIPv6(userIP))) {
          requestUrl += `?real_ip=${encodeURIComponent(userIP)}`;
        }

        const response = await fetch(requestUrl, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!response.ok)
          throw new Error(`Link não encontrado: ${response.status}`);

        const data = await response.json();
        const link = data.data;

        if (link?.original_url) {
          setTargetUrl(link.original_url);
          setLinkTitle(link.title || link.original_url);
          setIsValidLink(true);
          setShowContent(true);
        } else {
          setError(data.message || "Link inválido");
        }
      } catch {
        setError("Link não encontrado ou erro no servidor");
      }
    };

    fetchRedirectData();
  }, [slug, getUserRealIP, isValidIPv4, isValidIPv6]);

  useEffect(() => {
    if (targetUrl && isValidLink && !isRedirecting) {
      const timer = setTimeout(() => {
        startCountdown(3);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [targetUrl, isValidLink, isRedirecting, startCountdown]);

  if (error) {
    return (
      <>
        <GlobalStyles styles={animations} />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              theme.palette.mode === "dark"
                ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
                : `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
            p: 3,
          }}
        >
          <Fade in timeout={800}>
            <Paper
              elevation={12}
              sx={{
                p: 4,
                borderRadius: 4,
                textAlign: "center",
                maxWidth: 450,
                width: "100%",
              }}
            >
              <Stack spacing={3} alignItems="center">
                <AlertCircle
                  {...ICON_XL}
                  style={{
                    color: theme.palette.error.main,
                    animation: "pulse 2s infinite",
                  }}
                />
                <Typography variant="h4" fontWeight="bold" color="error">
                  Oops! Link não encontrado
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: "center" }}
                >
                  {error}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => (window.location.href = "/")}
                  sx={{ mt: 2, borderRadius: 2, px: 4, py: 1.5 }}
                >
                  Voltar ao início
                </Button>
              </Stack>
            </Paper>
          </Fade>
        </Box>
      </>
    );
  }

  return (
    <>
      <GlobalStyles styles={animations} />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          p: 3,
        }}
      >
        <Fade in={showContent || !isValidLink} timeout={600}>
          <Paper
            elevation={16}
            sx={{
              p: 5,
              borderRadius: 4,
              textAlign: "center",
              maxWidth: 550,
              width: "100%",
              backdropFilter: "blur(10px)",
              background:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(255, 255, 255, 0.95)",
            }}
          >
            {isValidLink && targetUrl ? (
              <Stack spacing={4} alignItems="center">
                <Grow in timeout={800}>
                  <Box>
                    <ShieldCheck
                      {...ICON_XL}
                      style={{
                        color: theme.palette.success.main,
                        animation: "pulse 2s infinite",
                        marginBottom: 4,
                      }}
                    />
                  </Box>
                </Grow>

                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color="primary"
                  sx={{ fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" } }}
                >
                  Redirecionamento Seguro
                </Typography>

                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ maxWidth: 400 }}
                >
                  Você será redirecionado com segurança para:
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    backgroundColor: theme.palette.action.hover,
                    borderRadius: 3,
                    maxWidth: "100%",
                    overflow: "hidden",
                    border: `2px solid ${theme.palette.primary.main}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      textAlign: "center",
                      mb: linkTitle !== targetUrl ? 1 : 0,
                    }}
                  >
                    {linkTitle}
                  </Typography>
                  {linkTitle !== targetUrl && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "0.9rem",
                        textAlign: "center",
                        wordBreak: "break-all",
                        opacity: 0.8,
                      }}
                    >
                      {targetUrl}
                    </Typography>
                  )}
                </Paper>

                {countdown > 0 && (
                  <Grow in timeout={500}>
                    <Box
                      sx={{
                        position: "relative",
                        display: "inline-flex",
                        mt: 3,
                      }}
                    >
                      <CircularProgress
                        variant="determinate"
                        value={((3 - countdown) / 3) * 100}
                        size={80}
                        thickness={6}
                        sx={{
                          color: theme.palette.primary.main,
                          "& .MuiCircularProgress-circle": {
                            strokeLinecap: "round",
                          },
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: "absolute",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="h4"
                          component="div"
                          color="primary"
                          fontWeight="bold"
                        >
                          {countdown}
                        </Typography>
                      </Box>
                    </Box>
                  </Grow>
                )}

                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => performRedirect(targetUrl)}
                    startIcon={<ExternalLink {...ICON_LG} />}
                    sx={{ borderRadius: 3, px: 4, py: 1.5, fontSize: "1.1rem" }}
                  >
                    Ir Agora
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <Stack spacing={4} alignItems="center">
                <CircularProgress
                  size={80}
                  thickness={4}
                  sx={{ color: theme.palette.primary.main }}
                />
                <Typography variant="h4" fontWeight="bold">
                  Verificando Link...
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Aguarde enquanto validamos o redirecionamento
                </Typography>
              </Stack>
            )}
          </Paper>
        </Fade>
      </Box>
    </>
  );
}
