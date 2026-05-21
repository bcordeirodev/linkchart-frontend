// Components
export * from "./components/ProfileForm";
export * from "./components/ProfileSidebar";
export * from "./components/PasswordChangeForm";
export * from "./components/OAuthSecurityCard";
export * from "./components/SubdomainSettings";

// Hooks
export * from "./hooks/useSubdomain";

// Services
export { profileService } from "@/services/profile.service";

// Types (avoiding conflicts)
export type { UserProfile } from "./types";
export type { User } from "@/types";
export type {
  SubdomainResponse,
  SubdomainAvailability,
} from "./types/subdomain";
