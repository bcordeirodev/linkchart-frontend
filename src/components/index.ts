// Componentes de UI base
export { default as EnhancedPaper } from './ui/EnhancedPaper';
export { default as MetricCard } from './ui/MetricCard';
export { default as ChartCard } from './ui/ChartCard';
export { default as TabPanel } from './ui/TabPanel';
export { default as TabDescription } from './ui/TabDescription';
export { default as SafeTypography } from './ui/SafeTypography';
export { default as SafeListItemText } from './ui/SafeListItemText';

// Componentes de layout
export { default as MainLayout } from './layout/MainLayout';
export { default as LoadingWithRedirect } from './layout/LoadingWithRedirect';
export { default as FixHydrationIssues } from './layout/FixHydrationIssues';

// Componentes comuns reutilizáveis
export { BrandLogo } from './common/BrandLogo';
export { AuthButtons } from './common/AuthButtons';
export { GradientButton } from './common/GradientButton';

// Componentes de navegação
export { default as MainProjectSelection } from './common/navigation/MainProjectSelection';

// Componentes utilitários
export { default as PageBreadcrumb } from './utilities/PageBreadcrumb';
export { default as PageTitle } from './utilities/PageTitle';
export { default as TitleReferenceLink } from './utilities/TitleReferenceLink';
export { default as ThemeAwareBackground } from './utilities/ThemeAwareBackground';

// Componentes de redirecionamento
export { default as Redirect } from './redirect/Redirect';
export { default as SmartRedirect } from './redirect/SmartRedirect';
export { default as RedirectSettings } from './redirect/RedirectSettings';
export { default as RedirectStats } from './redirect/RedirectStats';

// Componentes de formulário
export { URLInput } from './forms/URLInput';
export { URLShortenerForm } from './forms/URLShortenerForm';

// Componentes de resultado
export { CopyButton } from './results/CopyButton';
export { ShareActions } from './results/ShareActions';
export { ShortUrlResult } from './results/ShortUrlResult';

// Seções da landing page
export { HeroSection } from './sections/HeroSection';
export { BenefitsSection } from './sections/BenefitsSection';

// Componentes de analytics unificados
// NOVA ESTRUTURA: Todos os analytics migrados para unified-analytics
export * from './unified-analytics';

// Componentes de link
// export { LinkHeader } from './link/LinkHeader'; // Arquivo não existe
// export { LinkMetrics } from './link/LinkMetrics'; // Arquivo não existe
export { LinksHeader } from './link/LinksHeader';
// export { LinksMetrics } from './link/LinksMetrics'; // REMOVIDO - usar UnifiedMetrics
export { LinksFilters } from './link/LinksFilters';

// Componentes de formulário avançados
export { LinkForm } from './forms/LinkForm';
export { LinkFormFields } from './forms/LinkFormFields';
export { linkFormSchema, type LinkFormData } from './forms/LinkFormSchema';

// Componentes de dashboard - MIGRADOS para unified-analytics
// export { DashboardHeader } from './dashboard/DashboardHeader'; // REMOVIDO - usar Header do unified-analytics
// export { QuickActions } from './dashboard/QuickActions'; // MOVIDO para unified-analytics/dashboard/
// export { TopLinks } from './dashboard/TopLinks'; // MOVIDO para unified-analytics/dashboard/

// Componentes de profile
export { ProfileHeader } from './profile/ProfileHeader';
export { ProfileForm } from './profile/ProfileForm';
export { ProfileSidebar } from './profile/ProfileSidebar';

// ✅ Rate-limit funcionalidades migradas para unified-analytics/analysis/PerformanceAnalysis

// Componentes de configurações
export { default as LightDarkModeToggle } from './settings/LightDarkModeToggle';

// Componentes de erro
export { ErrorPageLayout } from './error/ErrorPageLayout';
