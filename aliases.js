/**
 * Create aliases for the new domain-driven structure
 */
const aliases = (prefix = `src`) => ({
  // Main aliases
  '@': `${prefix}`,
  '@/shared': `${prefix}/shared`,
  '@/features': `${prefix}/features`,
  '@/lib': `${prefix}/lib`,
  '@/app': `${prefix}/app`,
  
  // Feature aliases
  '@/auth': `${prefix}/features/auth`,
  '@/analytics': `${prefix}/features/analytics`,
  '@/links': `${prefix}/features/links`,
  '@/profile': `${prefix}/features/profile`,
  '@/redirect': `${prefix}/features/redirect`,
  
  // Shared aliases
  '@/ui': `${prefix}/shared/ui`,
  '@/layout': `${prefix}/shared/layout`,
  '@/hooks': `${prefix}/shared/hooks`,
  
  // Lib aliases
  '@/api': `${prefix}/lib/api`,
  '@/theme': `${prefix}/lib/theme`,
  '@/store': `${prefix}/lib/store`,
  '@/utils': `${prefix}/lib/utils`,
  '@/i18n': `${prefix}/lib/i18n`,
  

  '@history': `${prefix}/@history`,
  "@mock-utils": `${prefix}/@mock-utils`,
  '@schema': `${prefix}/@schema`
});

export default aliases;
