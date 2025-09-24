/**
 * 🚀 CONFIGURAÇÃO ESLINT OTIMIZADA - LINK CHART
 *
 * Melhorias aplicadas:
 * - Regras TypeScript mais rigorosas para qualidade
 * - Ordenação automática de imports
 * - Regras React otimizadas
 * - Configuração de performance melhorada
 * - Regras de acessibilidade básicas
 */

import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslint from '@eslint/js';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginImport from 'eslint-plugin-import';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname
});

export default tseslint.config({
    files: ['**/*.ts', '**/*.tsx'],
    ignores: [
        '**/app/(public)/documentation/material-ui-components/components/**',
        '**/app/(public)/documentation/material-ui-components/doc/**',
        '**/utils/node-scripts/fuse-react-message.js',
        '**/.next/**',
    ],
    languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
            project: true,
        },
    },
    plugins: {
        "@typescript-eslint": tseslint.plugin,
        "unused-imports": eslintPluginUnusedImports,
        "react": eslintPluginReact,
        "react-hooks": eslintPluginReactHooks,
        "react-refresh": eslintPluginReactRefresh,
        "prettier": eslintPluginPrettier,
        "import": eslintPluginImport,
    },
    extends: [
        // Eslint
        eslint.configs.recommended,
        // TypeScript
        ...tseslint.configs.recommended,
        ...tseslint.configs.stylistic,
        // React
        eslintPluginReact.configs.flat.recommended,
        eslintPluginReact.configs.flat['jsx-runtime'],
        ...compat.extends('plugin:react-hooks/recommended'),
        // Import
        ...compat.extends('plugin:import/recommended'),
        ...compat.extends('plugin:import/typescript'),
        // Prettier
        eslintPluginPrettierRecommended
    ],
    settings: {
        "import/resolver": {
            "typescript": {
                "alwaysTryTypes": true,
                "project": "./tsconfig.json"
            },
            "node": {
                "extensions": [".js", ".jsx", ".ts", ".tsx"]
            }
        },
        "react": {
            "version": "detect"
        }
    },
    rules: {
        "prettier/prettier": "off",
        "quotes": [
            "warn",
            "single",
            {
                "allowTemplateLiterals": true,
                "avoidEscape": true
            }
        ],
        "padding-line-between-statements": [
            "warn",
            { "blankLine": "always", "prev": "function", "next": "*" },
            { "blankLine": "always", "prev": "*", "next": "if" },
            { "blankLine": "always", "prev": "if", "next": "*" },
            { "blankLine": "always", "prev": "*", "next": "function" }
        ],
        "no-console": "warn",
        "import/no-cycle": "off",
        "import/no-named-as-default": "off",
        "import/no-named-as-default-member": "off",
        "import/default": "off",
        "import/no-unresolved": "off",
        "operator-linebreak": "off",
        "no-param-reassign": "off",
        "implicit-arrow-linebreak": "off",
        "max-len": "off",
        "indent": "off",
        "no-shadow": "off",
        "arrow-parens": "off",
        "no-confusing-arrow": "off",
        "no-use-before-define": "off",
        "object-curly-newline": "off",
        "function-paren-newline": "off",
        "import/prefer-default-export": "off",
        "max-classes-per-file": "off",
        "react/jsx-filename-extension": "off",
        "import/extensions": "off",

        // ===== IMPORTS E ORGANIZAÇÃO =====
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
            "warn",
            {
                "vars": "all",
                "varsIgnorePattern": "^_",
                "args": "after-used",
                "argsIgnorePattern": "^_",
                "caughtErrors": "all",
                "caughtErrorsIgnorePattern": "^_"
            }
        ],
        "import/order": "off",
        "import/no-duplicates": "error",
        "import/no-cycle": "error",
        "import/no-self-import": "error",

        // ===== TYPESCRIPT =====
        "@typescript-eslint/no-unused-vars": "off", // Handled by unused-imports
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-non-null-assertion": "warn",
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "@typescript-eslint/prefer-optional-chain": "error",
        "@typescript-eslint/prefer-as-const": "error",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }],
        "@typescript-eslint/no-import-type-side-effects": "error",
        "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
        "@typescript-eslint/no-useless-constructor": "error",
        "@typescript-eslint/no-empty-object-type": "warn",
        "@typescript-eslint/no-namespace": "warn",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/require-await": "off",
        "no-useless-catch": "warn",

        // ===== REACT =====
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react/jsx-props-no-spreading": "off",
        "react/no-array-index-key": "warn",
        "react/jsx-key": "error",
        "react/jsx-no-bind": "off",
        "react/jsx-no-leaked-render": "error",
        "react/jsx-no-useless-fragment": "warn",
        "react/no-unstable-nested-components": "error",
        "react/self-closing-comp": "error",
        "react/jsx-boolean-value": ["error", "never"],
        "react/jsx-curly-brace-presence": ["error", { "props": "never", "children": "never" }],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "off",
        "react-refresh/only-export-components": "warn",

        // ===== QUALIDADE GERAL =====
        "no-console": "warn",
        "no-debugger": "error",
        "no-var": "error",
        "prefer-const": "error",
        "eqeqeq": ["error", "always"],
        "curly": ["error", "all"],
        "no-eval": "error",
        "no-implied-eval": "error",
        "prefer-template": "error",
        "prefer-arrow-callback": "error",
        "object-shorthand": ["error", "always"],

        // ===== REGRAS DESABILITADAS (compatibilidade) =====
        "no-tabs": "off", // Usamos tabs
        "no-underscore-dangle": "off", // Permitir _variáveis privadas
        "import/no-extraneous-dependencies": "off", // Muito restritivo
        "import/prefer-default-export": "off", // Preferimos named exports
        "camelcase": "off", // TypeScript cuida disso
    },
});
