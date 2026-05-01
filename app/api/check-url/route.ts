import { NextRequest, NextResponse } from "next/server";

const SAFE_BROWSING_URL =
  "https://safebrowsing.googleapis.com/v4/threatMatches:find";

const THREAT_LABELS: Record<string, string> = {
  MALWARE: "malware",
  SOCIAL_ENGINEERING: "phishing",
  UNWANTED_SOFTWARE: "software indesejado",
  POTENTIALLY_HARMFUL_APPLICATION: "aplicação prejudicial",
};

const THREAT_TYPES = [
  "MALWARE",
  "SOCIAL_ENGINEERING",
  "UNWANTED_SOFTWARE",
  "POTENTIALLY_HARMFUL_APPLICATION",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = typeof body?.url === "string" ? body.url.trim() : null;

    if (!url) {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;

    if (!apiKey) {
      // Fail open: sem chave configurada, não bloqueia
      return NextResponse.json({ isSafe: true, threats: [] });
    }

    const response = await fetch(`${SAFE_BROWSING_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: { clientId: "link-charts", clientVersion: "1.0.0" },
        threatInfo: {
          threatTypes: THREAT_TYPES,
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(
        "[check-url] Safe Browsing API error:",
        response.status,
        await response.text(),
      );
      return NextResponse.json({ isSafe: true, threats: [] }); // fail open
    }

    const data = await response.json();
    const matches: Array<{ threatType: string }> = data.matches ?? [];

    if (matches.length === 0) {
      return NextResponse.json({ isSafe: true, threats: [] });
    }

    const threats = [
      ...new Set(
        matches.map(
          (m) => THREAT_LABELS[m.threatType] ?? m.threatType.toLowerCase(),
        ),
      ),
    ];

    return NextResponse.json({ isSafe: false, threats });
  } catch (error) {
    console.error("[check-url] Exception:", error);
    return NextResponse.json({ isSafe: true, threats: [] }); // fail open
  }
}
