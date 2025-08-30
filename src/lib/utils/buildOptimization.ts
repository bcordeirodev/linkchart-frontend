/**
 * Utilitários para otimização de build e detecção de erros
 * Centraliza lógicas para melhorar performance e debugging
 */

/**
 * Configurações para otimização de client modules
 */
export const CLIENT_MODULE_CONFIG = {
    // Componentes que DEVEM ter 'use client'
    REQUIRED_CLIENT_COMPONENTS: [
        'pages',
        'layouts',
        'providers',
        'forms',
        'interactive-components'
    ],

    // Hooks que requerem 'use client'
    CLIENT_HOOKS: [
        'useState',
        'useEffect',
        'useCallback',
        'useMemo',
        'useRef',
        'useContext',
        'useReducer',
        'useLayoutEffect'
    ],

    // Componentes que podem ser server components
    SERVER_COMPONENTS: [
        'static-content',
        'metadata-generators',
        'data-fetchers'
    ]
};

/**
 * Validações para estrutura de arquivos
 */
export const FILE_STRUCTURE_RULES = {
    // Páginas devem ter menos de 100 linhas
    MAX_PAGE_LINES: 100,

    // Componentes devem ter menos de 200 linhas
    MAX_COMPONENT_LINES: 200,

    // Estrutura obrigatória para módulos
    REQUIRED_MODULE_STRUCTURE: [
        'page.tsx',
        'Header.tsx',
        'Metrics.tsx',
        'Tabs.tsx'
    ]
};

/**
 * Configurações de imports otimizados
 */
export const IMPORT_OPTIMIZATION = {
    // Aliases recomendados
    RECOMMENDED_ALIASES: {
        '@fuse': 'src/@fuse',
        '@/lib': 'src/lib',
        '@/shared': 'src/shared',
        '@/features': 'src/features',
        '@': 'src'
    },

    // Imports que devem ser evitados
    AVOID_IMPORTS: [
        'import * from', // Evitar imports de tudo
        'import { ... } from "lodash"', // Usar lodash específico
        'import { ... } from "@mui/material"' // Usar imports específicos
    ],

    // Imports recomendados
    RECOMMENDED_IMPORTS: {
        'lodash': 'import _ from "lodash"',
        'mui-components': 'import { Button } from "@mui/material/Button"',
        'mui-icons': 'import { Add } from "@mui/icons-material"'
    }
};

/**
 * Configurações de performance
 */
export const PERFORMANCE_CONFIG = {
    // Bundle size máximo por página (em KB)
    MAX_BUNDLE_SIZE: 500,

    // First Load JS máximo (em KB)
    MAX_FIRST_LOAD_JS: 400,

    // Shared chunks máximo (em KB)
    MAX_SHARED_CHUNKS: 150
};

/**
 * Utilitário para validar estrutura de componente
 */
export function validateComponentStructure(filePath: string, content: string) {
    const issues: string[] = [];

    // Verificar se é client component quando necessário
    const hasClientHooks = CLIENT_MODULE_CONFIG.CLIENT_HOOKS.some(hook =>
        content.includes(hook)
    );

    const hasUseClient = content.includes("'use client'");

    if (hasClientHooks && !hasUseClient) {
        issues.push(`Componente ${filePath} usa hooks client mas não tem 'use client' directive`);
    }

    // Verificar tamanho do arquivo
    const lines = content.split('\n').length;
    const isPage = filePath.includes('/page.tsx');
    const isComponent = filePath.includes('/components/');

    if (isPage && lines > FILE_STRUCTURE_RULES.MAX_PAGE_LINES) {
        issues.push(`Página ${filePath} tem ${lines} linhas (máximo: ${FILE_STRUCTURE_RULES.MAX_PAGE_LINES})`);
    }

    if (isComponent && lines > FILE_STRUCTURE_RULES.MAX_COMPONENT_LINES) {
        issues.push(`Componente ${filePath} tem ${lines} linhas (máximo: ${FILE_STRUCTURE_RULES.MAX_COMPONENT_LINES})`);
    }

    return issues;
}

/**
 * Utilitário para otimizar imports
 */
export function optimizeImports(content: string): string {
    let optimized = content;

    // Otimizar imports do Material-UI
    optimized = optimized.replace(
        /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@mui\/material['"]/g,
        (match, imports) => {
            const importList = imports.split(',').map((imp: string) => imp.trim());
            return importList.map((imp: string) =>
                `import { ${imp} } from '@mui/material/${imp}';`
            ).join('\n');
        }
    );

    return optimized;
}

/**
 * Configurações de ESLint customizadas para o projeto
 */
export const ESLINT_RULES = {
    // Regras específicas para client components
    'client-component-rules': {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn'
    },

    // Regras para performance
    'performance-rules': {
        'import/no-default-export': 'off', // React.js precisa de default exports
        'import/prefer-default-export': 'off'
    }
};

/**
 * Configurações do TypeScript otimizadas
 */
export const TYPESCRIPT_CONFIG = {
    compilerOptions: {
        // Otimizações para build
        incremental: true,
        skipLibCheck: true,
        skipDefaultLibCheck: true,

        // Strict mode para melhor detecção de erros
        strict: true,
        strictNullChecks: true,
        noFallthroughCasesInSwitch: true,

        // Module resolution
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true
    }
};

export default {
    CLIENT_MODULE_CONFIG,
    FILE_STRUCTURE_RULES,
    IMPORT_OPTIMIZATION,
    PERFORMANCE_CONFIG,
    validateComponentStructure,
    optimizeImports,
    ESLINT_RULES,
    TYPESCRIPT_CONFIG
};
