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
      "Link Charts is a free URL shortener with real-time analytics. Track link clicks by geography, device, browser and UTM campaign — no account required. Free accounts include a custom subdomain, QR code and public analytics page per link.",
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
      "Free custom subdomain for branded short links (e.g. your-brand.linkcharts.com.br)",
      "Free QR code automatically generated for every link",
      "UTM campaign parameter tracking",
      "Public shareable analytics page per link",
      "Link expiration date and click limit controls",
      "Google Safe Browsing URL safety verification",
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
          text: "Sim. Ao criar uma conta gratuita no Link Charts, você pode definir um subdomínio personalizado (por exemplo: seunome.linkcharts.com.br) para todos os seus links encurtados, sem custo adicional.",
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
