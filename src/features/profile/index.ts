// Components
export * from "./components/ProfileForm";
export * from "./components/ProfileSidebar";
export * from "./components/PasswordChangeForm";

// Services
export { profileService } from "@/services/profile.service";

// Types (avoiding conflicts)
export type { UserProfile } from "./types/user";
export type { User } from "@/types";
