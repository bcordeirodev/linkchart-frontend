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
- Links curtos para WhatsApp (wa.me, api.whatsapp.com e convites de grupo chat.whatsapp.com) com contagem de cliques por horário, cidade e dispositivo — o caso de uso mais comum entre pequenos negócios brasileiros
- Analytics avançado por link: geografia, dispositivos, temporal, audiência e qualidade de tráfego
- Relatórios de portfólio: visão agregada de cliques, tendências e melhores links de toda a conta
- Página bio (link na bio) gratuita, servida no subdomínio do próprio usuário (ex.: suamarca.linkcharts.com.br), com até 20 itens, contagem de cliques item a item e estatísticas de país, cidade, dispositivo e horário; o rodapé traz uma marca discreta do Link Charts, igual em todas as páginas e sem plano pago que a remova
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

## Guias
- [Alternativa ao Bitly grátis](${appUrl}/guia/alternativa-ao-bitly): lista comparada das opções gratuitas (Link Charts, TinyURL, encurtador.dev, encurtador.com.br), com prós, contras e fonte datada de cada dado
- [Link curto para WhatsApp](${appUrl}/guia/link-curto-para-whatsapp): link rastreável para atendimento e grupos de WhatsApp, com estatísticas de cliques
- [Rastrear link no Instagram](${appUrl}/guia/rastrear-link-instagram): como contar cliques do link da bio e do sticker dos Stories
- [Como ver os cliques de um link](${appUrl}/guia/como-ver-cliques-do-link): passo a passo para acompanhar cliques de qualquer link curto
- [Cliques: bot ou humano?](${appUrl}/guia/cliques-bot-vs-humano): como o score de qualidade separa tráfego real de robôs

## Comparações
- [Link Charts vs Bitly](${appUrl}/comparar/bitly): o que mudou no plano gratuito do Bitly em 2025 (anúncio antes do redirecionamento, 5 links por mês) e a comparação recurso a recurso, com dados conferidos em julho de 2026
- [Link Charts vs Linktree](${appUrl}/comparar/linktree): comparação de link na bio — cliques por item, página no subdomínio do próprio usuário e os limites do plano grátis do Linktree (estatísticas dos últimos 28 dias e logo no rodapé), com dados consultados em agosto de 2026
- [Link Charts vs Short.io](${appUrl}/comparar/short-io): dois planos gratuitos fortes lado a lado, com foco em score de qualidade do tráfego, página de estatísticas pública e domínio personalizado
- [Link Charts vs Dub](${appUrl}/comparar/dub): o Dub é open-source e voltado a desenvolvedores; a comparação mostra onde cada um ganha em API, domínio próprio e estatísticas no plano grátis

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
