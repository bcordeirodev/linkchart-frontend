/**
 * 🎨 APP ICON COMPONENT
 * Componente centralizado para ícones da aplicação
 */

import { forwardRef } from 'react';
import { LucideProps } from 'lucide-react';
import { AppIcons, IconCategory, IconName, AnyIconName, FlatAppIcons, IconIntents, IconIntent } from './AppIcons';

// ========================================
// 🎯 COMPONENT PROPS
// ========================================

interface AppIconProps extends Omit<LucideProps, 'ref'> {
    /** Nome do ícone usando categoria.nome */
    name?: AnyIconName;
    /** Intent semântico (mais fácil de usar) */
    intent?: IconIntent;
    /** Categoria + nome separados */
    category?: IconCategory;
    iconName?: string;
}

// ========================================
// 🧩 APP ICON COMPONENT
// ========================================

/**
 * Componente de ícone centralizado da aplicação
 * Suporta tanto nomes categorizados quanto intents semânticos
 * 
 * @example
 * ```tsx
 * // Por intent (recomendado)
 * <AppIcon intent="save" size={20} />
 * <AppIcon intent="edit" color="blue" />
 * 
 * // Por categoria.nome
 * <AppIcon name="actions.save" size={24} />
 * <AppIcon name="navigation.back" />
 * 
 * // Por categoria + nome separados
 * <AppIcon category="actions" iconName="delete" />
 * ```
 */
export const AppIcon = forwardRef<SVGSVGElement, AppIconProps>(({
    name,
    intent,
    category,
    iconName,
    size = 20,
    color = 'currentColor',
    ...props
}, ref) => {
    // Determinar qual ícone usar baseado nas props
    let IconComponent;

    if (intent) {
        // Usar intent semântico (mais fácil)
        IconComponent = IconIntents[intent];
    } else if (name) {
        // Usar nome completo categoria.nome
        IconComponent = FlatAppIcons[name];
    } else if (category && iconName) {
        // Usar categoria + nome separados
        const categoryIcons = AppIcons[category] as any;
        IconComponent = categoryIcons?.[iconName];
    }

    // Fallback se ícone não encontrado
    if (!IconComponent) {
        console.warn(`AppIcon: Ícone não encontrado`, { name, intent, category, iconName });
        IconComponent = AppIcons.status.error; // Ícone de erro como fallback
    }

    return (
        <IconComponent
            ref={ref}
            size={size}
            color={color}
            {...props}
        />
    );
});

AppIcon.displayName = 'AppIcon';

// ========================================
// 🎯 SPECIALIZED ICON COMPONENTS
// ========================================

/**
 * Ícone de ação - otimizado para botões de ação
 */
export const ActionIcon = forwardRef<SVGSVGElement, { intent: IconIntent } & Omit<LucideProps, 'ref'>>(({
    intent,
    size = 18,
    ...props
}, ref) => {
    const IconComponent = IconIntents[intent];
    return <IconComponent ref={ref} size={size} {...props} />;
});

ActionIcon.displayName = 'ActionIcon';

/**
 * Ícone de navegação - otimizado para elementos de navegação
 */
export const NavIcon = forwardRef<SVGSVGElement, { intent: IconIntent } & Omit<LucideProps, 'ref'>>(({
    intent,
    size = 20,
    ...props
}, ref) => {
    const IconComponent = IconIntents[intent];
    return <IconComponent ref={ref} size={size} {...props} />;
});

NavIcon.displayName = 'NavIcon';

/**
 * Ícone de status - otimizado para indicadores de status
 */
export const StatusIcon = forwardRef<SVGSVGElement, { intent: IconIntent } & Omit<LucideProps, 'ref'>>(({
    intent,
    size = 16,
    ...props
}, ref) => {
    const IconComponent = IconIntents[intent];
    return <IconComponent ref={ref} size={size} {...props} />;
});

StatusIcon.displayName = 'StatusIcon';

export default AppIcon;
