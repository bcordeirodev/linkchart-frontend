const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";
const CONTACT_EMAIL = "linkcharts@gmail.com";

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
 * FAQPage schema for /shorter — enables rich result FAQ dropdowns in Google SERPs.
 * Keep questions answer-led: short, factual, no markdown, plain text only.
 */
export function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Link Charts free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Link Charts is completely free. You can shorten URLs and access real-time click analytics without paying anything or creating an account.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to sign up to shorten a URL?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No sign-up is required. Paste your long URL and get a shortened link instantly. Create a free account only if you want to manage multiple links and access advanced analytics.",
        },
      },
      {
        "@type": "Question",
        name: "What analytics does each shortened link provide?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every shortened link tracks total clicks, geographic data (country and region), device types (desktop, mobile, tablet), browsers, referrer sources, and UTM campaign parameters — all available in real time.",
        },
      },
      {
        "@type": "Question",
        name: "Can I customize the short link?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can set a custom slug for your shortened URL (e.g., linkcharts.com.br/r/my-campaign). Custom slugs require a free account.",
        },
      },
      {
        "@type": "Question",
        name: "Does Link Charts offer a free custom subdomain?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Free accounts can claim a custom subdomain (e.g. your-brand.linkcharts.com.br). All new short links use that branded base URL at no extra cost.",
        },
      },
      {
        "@type": "Question",
        name: "How long do shortened links stay active?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Shortened links remain active indefinitely. You can also set an expiration date or click limit if you want a link to deactivate automatically.",
        },
      },
      {
        "@type": "Question",
        name: "Is it safe to use Link Charts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Every URL is checked against Google Safe Browsing before being shortened. Links flagged as malicious or phishing are rejected automatically.",
        },
      },
      {
        "@type": "Question",
        name: "Does each link get a QR code?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, a free QR code is generated automatically for every shortened link and can be downloaded directly from your dashboard.",
        },
      },
      {
        "@type": "Question",
        name: "Is Link Charts a free Bitly alternative?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on what you need. Link Charts focuses on advanced free analytics: geographic tracking by country and city, device and browser breakdown, UTM campaign tracking, custom subdomain, and QR Code — features that require a paid plan on Bitly.",
        },
      },
      {
        "@type": "Question",
        name: "Does Link Charts work with WhatsApp?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Links shortened with Link Charts work on WhatsApp, Telegram, Instagram and all messaging platforms. The short URL redirects to your destination while tracking clicks automatically.",
        },
      },
      {
        "@type": "Question",
        name: "Can I track UTM campaign parameters?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Link Charts automatically detects and records UTM parameters — source, medium, campaign, term and content — attached to your short link. Campaign data appears in the analytics dashboard in real time.",
        },
      },
    ],
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
