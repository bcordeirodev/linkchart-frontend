/**
 * 👤 PROFILE FEATURE EXPORTS
 * Barrel exports para o módulo de profile
 */

// Components
export * from './components/ProfileForm';
export * from './components/ProfileHeader';
export * from './components/ProfileSidebar';

// Services
export { profileService } from '@/services/profile.service';

// Types (avoiding conflicts)
export type { UserProfile } from './types/user';
export type { User } from '@/types';
