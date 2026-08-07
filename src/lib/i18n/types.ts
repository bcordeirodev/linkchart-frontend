import "i18next";

import type enAdmin from "./locales/en/admin.json";
import type enAnalytics from "./locales/en/analytics.json";
import type enApiKeys from "./locales/en/apiKeys.json";
import type enAuth from "./locales/en/auth.json";
import type enBio from "./locales/en/bio.json";
import type enCommon from "./locales/en/common.json";
import type enLegal from "./locales/en/legal.json";
import type enLinks from "./locales/en/links.json";
import type enProfile from "./locales/en/profile.json";
import type enPublic from "./locales/en/public.json";
import type enReports from "./locales/en/reports.json";
import type enSubdomains from "./locales/en/subdomains.json";
import type enTools from "./locales/en/tools.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof enCommon;
      admin: typeof enAdmin;
      auth: typeof enAuth;
      links: typeof enLinks;
      analytics: typeof enAnalytics;
      apiKeys: typeof enApiKeys;
      profile: typeof enProfile;
      public: typeof enPublic;
      legal: typeof enLegal;
      reports: typeof enReports;
      subdomains: typeof enSubdomains;
      tools: typeof enTools;
      bio: typeof enBio;
    };
  }
}
