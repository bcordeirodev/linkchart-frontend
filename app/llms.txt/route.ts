/**
 * Serve `/llms.txt` — a machine-readable, curated map of the site for AI
 * engines (ChatGPT, Claude, Perplexity, Gemini) following the llmstxt.org
 * convention. It gives answer engines a cheap, authoritative summary of what
 * Link Charts is and where the canonical indexable pages live, improving the
 * odds of accurate citation in AI search answers (AEO).
 *
 * Served as `text/plain` and cached at the edge for a day. Mirrors the app
 * URL resolution used by {@link file://./robots.ts} and {@link file://./sitemap.ts}.
 */
export function GET(): Response {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";

  const body = `# Link Charts

> Link Charts é um encurtador de URL gratuito com analytics avançado em tempo real. Além de links curtos, entrega estatísticas de cliques por geografia, dispositivo, navegador, origem de tráfego, evolução temporal e um score de qualidade que separa tráfego orgânico de suspeito. Também reúne relatórios de portfólio (visão agregada de toda a conta), até 3 subdomínios personalizados por conta e gerenciamento de links em massa. Foco no mercado brasileiro (pt-BR).

## O que o produto faz
- Encurta URLs longas em links curtos rastreáveis
- Analytics avançado por link: geografia, dispositivos, temporal, audiência e qualidade de tráfego
- Relatórios de portfólio: visão agregada de cliques, tendências e melhores links de toda a conta
- Preview em redes sociais (Open Graph) para cada link
- Páginas de analytics públicas e compartilháveis por link
- Até 3 subdomínios personalizados por conta (URLs com a sua marca)
- Gerenciamento de links em massa: busca, filtros e ações em lote
- Conta gratuita com exclusão self-service dos dados (LGPD)

## Páginas principais
- [Encurtador (home)](${appUrl}/): criar links curtos gratuitos com analytics em tempo real
- [Shorter](${appUrl}/shorter): ferramenta de encurtamento
- [Suporte](${appUrl}/support): ajuda e contato

## Ferramentas gratuitas
- [Gerador de UTM](${appUrl}/ferramentas/gerador-utm): monta URLs rastreáveis com utm_source, utm_medium e utm_campaign, prontas para encurtar e medir
- [Verificador de link suspeito](${appUrl}/ferramentas/verificar-link): checa se um link aparece nas listas de phishing e malware do Google Safe Browsing antes do clique

## Legal
- [Política de Privacidade](${appUrl}/privacy)
- [Termos de Uso](${appUrl}/terms)

## Notas
- Idioma primário: português do Brasil (pt-BR)
- As páginas de analytics por link (/public-analytics/{slug}) são públicas mas não indexáveis por padrão
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
