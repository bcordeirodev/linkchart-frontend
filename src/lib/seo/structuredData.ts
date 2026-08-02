import ptBrPublic from "@/lib/i18n/locales/pt-BR/public.json";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";
const CONTACT_EMAIL = "linkcharts@gmail.com";

/**
 * Serializes a JSON-LD object for safe injection via `dangerouslySetInnerHTML`.
 *
 * Escapes every `<` to its unicode escape (`<`) so that a `</script>`
 * sequence (or any other HTML tag) embedded in user-controlled fields — e.g. a
 * link slug — cannot break out of the `<script type="application/ld+json">`
 * element and execute arbitrary markup. The output remains valid JSON that
 * JSON-LD parsers decode back to the original characters.
 *
 * @param schema - the JSON-LD object to serialize
 * @returns a JSON string safe to place inside a `<script>` tag
 */
export function serializeJsonLd(schema: unknown): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}

/**
 * Schema.org for the URL shortener as a software product.
 *
 * `WebApplication` is preferred over `SoftwareApplication` here because the
 * tool runs entirely in the browser with no install step. `featureList` is
 * picked up by Google's rich results pipeline; keep entries short and verb-led.
 */
export function buildWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Link Charts",
    description:
      "Link Charts is a free URL shortener with real-time analytics. Track link clicks by geography, device, browser and UTM campaign — no account required. Free accounts include up to 3 custom subdomains, a portfolio reports dashboard, a QR code and a public analytics page per link.",
    url: APP_URL,
    applicationCategory: "UtilityApplication",
    applicationSubCategory: "URL Shortener",
    operatingSystem: "Web",
    inLanguage: ["en", "pt-BR"],
    isAccessibleForFree: true,
    browserRequirements: "Requires JavaScript and a modern browser.",
    featureList: [
      "Free URL shortening with no account required",
      "Real-time click tracking and analytics dashboard",
      "Geographic analytics by country, region and city",
      "Device, browser and OS breakdown",
      "Custom slug for branded short links",
      "Up to 3 free custom subdomains for branded short links (e.g. your-brand.linkcharts.com.br)",
      "Free QR code automatically generated for every link",
      "UTM campaign parameter tracking",
      "Free UTM generator tool to build campaign links",
      "Public shareable analytics page per link",
      "Portfolio reports dashboard aggregating clicks and top links across your account",
      "Bulk link management with search, filters and multi-select actions",
      "Link expiration date and click limit controls",
      "Google Safe Browsing URL safety verification",
      "Free suspicious-link checker powered by Google Safe Browsing",
      "WhatsApp-compatible short links",
      "Audience quality scoring and bot detection",
    ],
    screenshot: `${APP_URL}/og-default.png`,
    image: `${APP_URL}/og-default.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
}

export function buildAnalyticsPageSchema(
  slug: string,
  title: string,
  clicks: number,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Analytics for ${title}`,
    description: `${clicks} clicks tracked for ${title}`,
    url: `${APP_URL}/public-analytics/${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Link Charts",
      url: APP_URL,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Link Charts",
          item: APP_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Analytics",
          item: `${APP_URL}/public-analytics/${slug}`,
        },
      ],
    },
  };
}

/**
 * FAQPage schema in Brazilian Portuguese for /shorter.
 *
 * Questions are sourced from real Google Search queries targeting Brazilian
 * users searching for URL shorteners and link click counters. Plain text only —
 * no markdown, no HTML entities.
 */
export function buildFaqSchemaPtBR() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Como contar quantas vezes um link foi clicado gratuitamente?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Link Charts mostra o total de cliques de cada link no painel de analytics em tempo real. Acesse o dashboard gratuito para ver o contador de cliques, distribuição geográfica e breakdown por dispositivo — sem nenhum custo.",
        },
      },
      {
        "@type": "Question",
        name: "Como encurtar link para o WhatsApp?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Basta colar a URL longa no campo acima e clicar em Encurtar. O link curto gerado funciona diretamente no WhatsApp, Telegram, Instagram e qualquer aplicativo de mensagem, sem precisar criar conta.",
        },
      },
      {
        "@type": "Question",
        name: "Existe encurtador de link gratuito sem cadastro?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. Link Charts permite encurtar links gratuitamente sem criar conta. Para salvar seus links e acessar analytics detalhados, basta criar uma conta gratuita.",
        },
      },
      {
        "@type": "Question",
        name: "Qual a melhor alternativa gratuita ao Bitly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Depende do que você precisa. O Link Charts foca em analytics avançado gratuito: rastreamento geográfico por país e cidade, breakdown por dispositivo e navegador, UTM, subdomínio personalizado e QR Code — recursos que no Bitly exigem plano pago.",
        },
      },
      {
        "@type": "Question",
        name: "Como criar um contador de cliques para meus links?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ao encurtar um link no Link Charts, um contador de cliques é criado automaticamente. Você pode acompanhar o total de cliques, origem geográfica e dispositivos em tempo real no dashboard.",
        },
      },
      {
        "@type": "Question",
        name: "Como ver de qual país vieram os cliques no meu link?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O analytics de cada link no Link Charts inclui mapa de calor geográfico com detalhamento por país, estado e cidade. Basta acessar a aba Geográfico no dashboard do link.",
        },
      },
      {
        "@type": "Question",
        name: "Posso ter subdomínio personalizado gratuito para meus links?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. Ao criar uma conta gratuita no Link Charts, você pode definir até 3 subdomínios personalizados (por exemplo: seunome.linkcharts.com.br) para os seus links encurtados, sem custo adicional.",
        },
      },
      {
        "@type": "Question",
        name: "Como rastrear parâmetros UTM em links encurtados?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Link Charts detecta e registra automaticamente os parâmetros UTM (source, medium, campaign, term e content) de cada clique. Os dados aparecem na aba Insights do dashboard em tempo real.",
        },
      },
      {
        "@type": "Question",
        name: "Como gerar QR Code grátis para um link?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cada link encurtado no Link Charts gera automaticamente um QR Code gratuito. Você pode baixá-lo diretamente do dashboard na aba de QR Code.",
        },
      },
      {
        "@type": "Question",
        name: "O link encurtado funciona no WhatsApp e Instagram?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. Links encurtados com Link Charts funcionam em WhatsApp, Instagram, Telegram e todos os aplicativos de mensagem e redes sociais. O link redireciona para o destino e contabiliza o clique automaticamente.",
        },
      },
      {
        "@type": "Question",
        name: "Por quanto tempo o link encurtado fica ativo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Links encurtados ficam ativos indefinidamente. Você também pode definir uma data de expiração ou limite de cliques para que o link seja desativado automaticamente quando atingir o critério.",
        },
      },
      {
        "@type": "Question",
        name: "É possível ver analytics de um link sem fazer login?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. Cada link encurtado tem uma página pública de analytics que pode ser acessada sem login. Basta compartilhar o link de analytics para que qualquer pessoa acompanhe os dados do link.",
        },
      },
    ],
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Link Charts",
    url: APP_URL,
    logo: `${APP_URL}/og-default.png`,
    description:
      "Link Charts is a free URL shortener with real-time analytics. Track link clicks by geography, device, browser and UTM campaign — no account required. Every link includes a free QR code and public analytics page.",
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: CONTACT_EMAIL,
        contactType: "customer support",
        availableLanguage: ["en", "pt-BR"],
      },
    ],
    sameAs: ["https://github.com/bcordeirodev"],
  };
}

/**
 * `FAQPage` schema for the "Link Charts vs Bitly" comparison page
 * (`/comparar/bitly`).
 *
 * pt-BR is intentional: like the rest of the site's structured data, the schema
 * mirrors the canonical Brazilian-market SEO target. The questions match the
 * exact prompt patterns real users type into AI assistants ("alternativa ao
 * Bitly", "como ver a cidade dos cliques"), maximizing AI-citation coverage.
 * The Q&A is derived from the same locale entries the visible page renders
 * (`public.json: compareBitly.faq.items`), so crawlers and users always read
 * identical answers — the two can no longer drift apart.
 */
export function buildCompareBitlyFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ptBrPublic.compareBitly.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/**
 * `BreadcrumbList` schema for a comparison page under `/comparar/{slug}`.
 *
 * Gives search and AI engines the page's place in the site hierarchy
 * (Home → Comparações → {name}), which strengthens entity/context signals for
 * citation. `name` is the human label of the leaf (e.g. "Link Charts vs Bitly").
 *
 * @param name - leaf breadcrumb label
 * @param path - absolute path of the leaf page (e.g. "/comparar/bitly")
 */
export function buildCompareBreadcrumbSchema(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: APP_URL },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: `${APP_URL}${path}`,
      },
    ],
  };
}

/**
 * `FAQPage` schema for the bot-detection guide (`/guia/cliques-bot-vs-humano`).
 *
 * pt-BR, matching the site's SEO target and the exact prompt patterns real
 * users type into AI assistants ("como saber se os cliques são bots"). Targets
 * a differentiator with very low competition (traffic-quality scoring), so
 * strong AI-citation potential. The visible page renders the same Q&A via i18n.
 */
export function buildGuiaBotsFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Como saber se os cliques do meu link são reais ou de bots?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O Link Charts pontua cada clique de 0 a 100 com base em sinais como IP de datacenter, ausência de cabeçalhos de navegador, cliques rápidos demais e contradições no dispositivo, e classifica cada um como orgânico, suspeito ou provável fraude — automaticamente.",
        },
      },
      {
        "@type": "Question",
        name: "O que é tráfego de bot em links encurtados?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "É todo clique que não vem de uma pessoa: crawlers, scrapers, pré-visualizações automáticas e scripts. Ele infla a contagem de cliques sem representar interesse real.",
        },
      },
      {
        "@type": "Question",
        name: "Por que meu link tem muitos cliques mas pouca conversão?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Frequentemente é tráfego de bot ou de baixa qualidade inflando a contagem. Separar o orgânico do suspeito revela o número que realmente importa.",
        },
      },
      {
        "@type": "Question",
        name: "O Link Charts detecta cliques falsos automaticamente?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. A detecção acontece em tempo real em cada clique, sem configuração, e o resultado aparece no dashboard gratuito como score de qualidade e faixa (orgânico, suspeito ou provável fraude).",
        },
      },
      {
        "@type": "Question",
        name: "O que significa o score de qualidade de um clique?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "É uma nota de 0 a 100 que resume o quão provável é que o clique tenha vindo de uma pessoa real. Quanto mais sinais de automação, menor o score.",
        },
      },
    ],
  };
}

/**
 * `FAQPage` schema for the "see your clicks" guide
 * (`/guia/como-ver-cliques-do-link`). pt-BR, matching the SEO target and the
 * prompt patterns real users type into AI assistants ("como ver quantas pessoas
 * clicaram no meu link", "como criar um contador de cliques grátis"). The
 * visible page renders the same Q&A via i18n.
 */
export function buildGuiaVerCliquesFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Como ver quantas pessoas clicaram no meu link?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Encurte o link no Link Charts, crie uma conta gratuita para salvá-lo e abra o dashboard do link. O total de cliques aparece no topo do painel e atualiza em tempo real, junto com o detalhamento de quem clicou.",
        },
      },
      {
        "@type": "Question",
        name: "Dá para criar um contador de cliques grátis?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. O Link Charts funciona como um contador de cliques gratuito: cada link ganha um painel com o total de acessos em tempo real, sem custo e sem instalar nada.",
        },
      },
      {
        "@type": "Question",
        name: "Preciso de conta para ver os cliques do meu link?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Para criar um link curto você não precisa de cadastro. Mas para salvar o link e acompanhar o histórico de cliques ao longo do tempo, é preciso criar uma conta gratuita.",
        },
      },
      {
        "@type": "Question",
        name: "Como saber de qual cidade vieram os cliques?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No dashboard do link, o Link Charts mostra a geografia dos acessos por país e cidade. Assim você vê exatamente de onde as pessoas estão clicando no seu link.",
        },
      },
      {
        "@type": "Question",
        name: "Os cliques aparecem em tempo real?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. O total de cliques e o detalhamento (geografia, dispositivo, horário e origem) são atualizados em tempo real conforme as pessoas acessam o seu link.",
        },
      },
    ],
  };
}

/**
 * `FAQPage` schema for the Instagram tracking guide
 * (`/guia/rastrear-link-instagram`). pt-BR, matching real prompts ("como
 * rastrear cliques de link no Instagram", "quantas pessoas clicaram no link da
 * bio"). The visible page renders the same Q&A via i18n.
 */
export function buildGuiaInstagramFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Como rastrear os cliques de um link no Instagram?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Encurte o link do seu destino com o Link Charts e use o link curto na bio ou no sticker de link dos Stories. Cada vez que alguém clicar, o Link Charts registra o clique e mostra origem, dispositivo e cidade no dashboard gratuito, em tempo real.",
        },
      },
      {
        "@type": "Question",
        name: "Como saber quantas pessoas clicaram no link da bio do Instagram?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O Instagram não mostra isso, mas um link curto sim. Coloque o link curto do Link Charts na bio e a contagem de cliques aparece no dashboard, separada das curtidas e visualizações do post.",
        },
      },
      {
        "@type": "Question",
        name: "Dá para ver de onde vieram os cliques do Instagram?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. Para cada clique no seu link curto, o Link Charts registra a origem, o dispositivo (celular ou computador) e a cidade e país aproximados de quem clicou — tudo no painel de analytics gratuito.",
        },
      },
      {
        "@type": "Question",
        name: "Preciso pagar para rastrear links do Instagram?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Não. Encurtar o link e acompanhar os cliques com origem, dispositivo e cidade é gratuito no Link Charts, com dashboard em tempo real e sem instalar nada.",
        },
      },
      {
        "@type": "Question",
        name: "O link curto funciona no sticker de link dos Stories?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. O link curto do Link Charts funciona tanto no link da bio quanto no sticker de link dos Stories, e é o mesmo link que contabiliza todos os cliques de qualquer um desses lugares.",
        },
      },
    ],
  };
}

/**
 * `FAQPage` schema for the WhatsApp short-link guide
 * (`/guia/link-curto-para-whatsapp`). pt-BR, matching real prompts ("link
 * curto para whatsapp", "link para grupo de whatsapp"). The visible page
 * renders the same Q&A via i18n (`guiaWhatsapp.faq`).
 */
export function buildGuiaWhatsappFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Dá para criar um link curto para grupo de WhatsApp?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. Cole o link de convite do grupo (chat.whatsapp.com) no Link Charts e divulgue o link curto. Você acompanha quantas pessoas tocaram no convite — e, com a conta gratuita, pode editar o destino depois, apontando para um grupo novo sem trocar o link divulgado.",
        },
      },
      {
        "@type": "Question",
        name: "O link curto para WhatsApp expira?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Não. O link continua funcionando sem prazo de validade e sem limite de cliques no plano gratuito.",
        },
      },
      {
        "@type": "Question",
        name: "Como saber quantas pessoas entraram no grupo pelo link?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O link curto conta quantas pessoas tocaram no convite e abriram o WhatsApp. A entrada no grupo acontece dentro do aplicativo, mas a contagem de cliques é o melhor termômetro de cada divulgação — com horário, cidade e aparelho de cada toque.",
        },
      },
      {
        "@type": "Question",
        name: "Preciso pagar ou criar conta para encurtar link de WhatsApp?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Não. Encurtar é grátis e sem cadastro. A conta gratuita adiciona o painel completo: histórico, edição de destino, QR Code e estatísticas de todos os seus links.",
        },
      },
      {
        "@type": "Question",
        name: "Funciona com wa.me, api.whatsapp.com e link de grupo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim, com todos: wa.me (com ou sem mensagem pronta), api.whatsapp.com e convites de grupo chat.whatsapp.com. O Link Charts encurta qualquer um deles e conta os cliques do mesmo jeito.",
        },
      },
    ],
  };
}

/**
 * `FAQPage` schema for the "Link Charts vs Short.io" comparison
 * (`/comparar/short-io`). pt-BR. Answers are honest — they acknowledge
 * Short.io's strong free tier and custom domains — so the schema stays
 * trustworthy as an AI-citation surface. The visible page renders the same Q&A.
 */
export function buildCompareShortIoFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Qual a melhor alternativa gratuita ao Short.io?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Depende do que você prioriza. O Short.io tem um free tier forte com domínios personalizados; o Link Charts é uma ótima alternativa gratuita se você valoriza o score de qualidade que separa bots de humanos, uma página de analytics pública e a interface em português nativo.",
        },
      },
      {
        "@type": "Question",
        name: "Link Charts vs Short.io: qual tem o melhor plano grátis?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Os dois são generosos. O Short.io oferece domínios personalizados (até 5) e cerca de 1.000 links marcados no plano gratuito. O Link Charts não impõe um limite prático de links e adiciona o score de qualidade de tráfego e a página de analytics pública, que o Short.io não tem.",
        },
      },
      {
        "@type": "Question",
        name: "O Short.io permite domínio personalizado de graça?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim, e esse é um ponto forte do Short.io: o plano gratuito inclui domínios personalizados próprios. O Link Charts oferece subdomínio gratuito, mas não domínio de marca completo no nível gratuito — se domínio próprio é essencial, o Short.io leva vantagem aqui.",
        },
      },
      {
        "@type": "Question",
        name: "Como saber se os cliques do meu link são reais ou de bots?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O Link Charts calcula um score de qualidade de tráfego (0–100) que classifica cada clique como orgânico, suspeito ou provável fraude. O Short.io não oferece esse recurso, então é onde o Link Charts se diferencia.",
        },
      },
      {
        "@type": "Question",
        name: "Qual encurtador tem interface em português?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O Link Charts é nativo em português (pt-BR). O Short.io funciona bem no Brasil, mas a interface é apenas parcialmente traduzida, então o Link Charts oferece uma experiência mais completa em português.",
        },
      },
    ],
  };
}

/**
 * `FAQPage` schema for the "Link Charts vs Dub" comparison (`/comparar/dub`).
 * pt-BR. Answers are honest — they acknowledge Dub's open-source nature and
 * robust API — so the schema stays trustworthy as an AI-citation surface. The
 * visible page renders the same Q&A via i18n.
 */
export function buildCompareDubFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Dub vs Link Charts: qual é o melhor encurtador de URL?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Depende do perfil. O Dub é excelente para desenvolvedores por ser open-source e ter uma API robusta. O Link Charts é melhor para quem quer analytics sem código: mais links grátis, uso sem cadastro, score de qualidade de tráfego e interface em português nativo.",
        },
      },
      {
        "@type": "Question",
        name: "Qual o melhor encurtador de URL open-source?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O Dub é a principal opção open-source, com código aberto e API completa. O Link Charts não é open-source, então, se o código aberto é um requisito, o Dub leva vantagem. O Link Charts compensa em volume de links grátis, uso sem cadastro e detecção de bots.",
        },
      },
      {
        "@type": "Question",
        name: "O Dub é gratuito? Quantos links posso criar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O Dub tem um plano gratuito open-source, mas com um limite mensal de links (cerca de 25/mês). O Link Charts não impõe um limite prático de links no uso gratuito, o que ajuda quem cria muitos links curtos.",
        },
      },
      {
        "@type": "Question",
        name: "Preciso criar conta para encurtar um link?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No Link Charts você pode encurtar uma URL sem cadastro. O Dub normalmente exige criar uma conta para usar. Se você quer rapidez sem login, o Link Charts leva vantagem; se quer um workspace com API, o Dub faz sentido.",
        },
      },
      {
        "@type": "Question",
        name: "Como saber se os cliques do meu link são reais ou de bots?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O Link Charts calcula um score de qualidade de tráfego (0–100) que classifica cada clique como orgânico, suspeito ou provável fraude. O Dub não oferece esse recurso, então é onde o Link Charts se diferencia.",
        },
      },
    ],
  };
}
