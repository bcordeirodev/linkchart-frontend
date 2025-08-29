# 📦 Guia de Migração - Tipos Organizados

## 🎯 Visão Geral

Este guia documenta a nova organização de tipos no frontend, com foco na centralização, reutilização e manutenibilidade.

## 📁 Nova Estrutura de Arquivos

```
src/types/
├── index.ts           # 📦 Exportação centralizada
├── api.ts             # 🌐 Tipos da API
├── components.ts      # 🧩 Props de componentes
├── hooks.ts           # 🎣 Tipos de hooks
├── common.ts          # 🔧 Tipos utilitários
├── analytics.ts       # 📊 Analytics (atualizado)
├── link.ts           # 🔗 Links (atualizado)
├── linkPerformance.ts # 🚀 Performance
├── metrics.ts        # 📈 Métricas (atualizado)
├── shorter.ts        # 🔗 Encurtador (atualizado)
├── user.ts           # 👤 Usuários (atualizado)
└── TYPES_MIGRATION_GUIDE.md
```

## 🔄 Como Migrar

### ✅ ANTES (Antigo):
```typescript
// Importações espalhadas
import { AnalyticsData } from '@/types/analytics';
import { ILinkCreate } from '@/types/link';
import { MetricCardProps } from '@/components/ui/MetricCard';

// Interfaces duplicadas em vários arquivos
interface MyComponentProps {
  data: AnalyticsData;
  loading?: boolean;
}
```

### ✅ DEPOIS (Novo):
```typescript
// Importação centralizada
import { 
  AnalyticsData, 
  LinkCreateRequest, 
  MetricCardProps,
  DataComponentProps
} from '@/types';

// Reutilização de tipos base
interface MyComponentProps extends DataComponentProps<AnalyticsData> {
  customProp?: string;
}
```

## 📋 Principais Mudanças

### 1. 🌐 Tipos de API (`api.ts`)
- **Centralização**: Todos os tipos de API em um arquivo
- **Padronização**: `ApiResponse<T>`, `PaginatedResponse<T>`
- **Nomenclatura**: `LoginRequest`, `LoginResponse`, etc.

### 2. 🧩 Props de Componentes (`components.ts`)
- **Tipos base**: `BaseComponentProps`, `DataComponentProps<T>`
- **Props específicas**: `AnalyticsProps`, `MetricsProps`
- **Reutilização**: Extensão de tipos base

### 3. 🎣 Hooks (`hooks.ts`)
- **Padrão consistente**: `UseXxxState`, `UseXxxActions`, `UseXxx`
- **Tipos de opções**: `UseXxxOptions`
- **Estados assíncronos**: `UseAsyncState<T>`

### 4. 🔧 Tipos Comuns (`common.ts`)
- **Utilitários**: `Optional<T>`, `Nullable<T>`, `DeepPartial<T>`
- **UI**: `Size`, `Variant`, `Color`, `Severity`
- **Estado**: `Status`, `LoadingState`, `AsyncState<T>`

## 🔗 Mapeamento de Tipos

### Tipos Antigos → Novos

| Antigo | Novo | Arquivo |
|--------|------|---------|
| `ILinkCreate` | `LinkCreateRequest` | `api.ts` |
| `ILinkUpdate` | `LinkUpdateRequest` | `api.ts` |
| `ILinkResponse` | `LinkResponse` | `api.ts` |
| `IUser` | `IUser` (mantido) | `user.ts` |
| `IAuthResponse` | `LoginResponse` | `api.ts` |
| `AnalyticsComponentProps` | `AnalyticsProps` | `components.ts` |

### Compatibilidade Mantida

```typescript
// ✅ Ainda funciona (deprecated)
interface ILinkCreate { ... }

// ✅ Recomendado
import { LinkCreateRequest } from '@/types';
```

## 🎨 Padrões de Uso

### 1. Componentes
```typescript
import { AnalyticsProps, BaseComponentProps } from '@/types';

// ✅ Usar tipos base
interface MyComponentProps extends BaseComponentProps {
  title: string;
  onAction?: () => void;
}

// ✅ Usar props específicas
const AnalyticsComponent: React.FC<AnalyticsProps> = ({ data, loading }) => {
  // ...
};
```

### 2. Hooks
```typescript
import { UseAsync, UseAnalytics } from '@/types';

// ✅ Usar padrão consistente
const useMyData = (): UseAsync<MyData> => {
  // ...
};

// ✅ Usar hooks específicos
const analytics: UseAnalytics = useAnalytics();
```

### 3. API Calls
```typescript
import { ApiResponse, LinkResponse, LinkCreateRequest } from '@/types';

// ✅ Usar tipos de API
const createLink = async (data: LinkCreateRequest): Promise<ApiResponse<LinkResponse>> => {
  // ...
};
```

### 4. Estados
```typescript
import { AsyncState, LoadingState } from '@/types';

// ✅ Usar estados padrão
const [state, setState] = useState<AsyncState<LinkResponse>>({
  data: null,
  loading: false,
  error: null,
  status: 'idle'
});
```

## 🔍 Verificação de Migração

### Checklist:
- [ ] Substituir imports espalhados por `import { ... } from '@/types'`
- [ ] Usar tipos base para props de componentes
- [ ] Padronizar hooks com `UseXxx` pattern
- [ ] Utilizar `ApiResponse<T>` para calls da API
- [ ] Aplicar tipos utilitários (`Optional<T>`, `Nullable<T>`)

### Comandos Úteis:
```bash
# Verificar imports antigos
grep -r "from '@/types/" src/ --exclude-dir=types

# Verificar interfaces globais
grep -r "interface I[A-Z]" src/

# Verificar tipos deprecated
grep -r "@deprecated" src/types/
```

## 🎯 Benefícios

### ✅ Antes da Organização:
- ❌ Tipos espalhados em 50+ arquivos
- ❌ Interfaces duplicadas
- ❌ Inconsistências de nomenclatura
- ❌ Difícil manutenção

### ✅ Depois da Organização:
- ✅ **Centralização**: Tudo em `/types/`
- ✅ **Reutilização**: Tipos base extensíveis
- ✅ **Consistência**: Padrões bem definidos
- ✅ **Manutenibilidade**: Fácil localização e edição
- ✅ **TypeScript**: Melhor inferência de tipos
- ✅ **DX**: Developer Experience aprimorada

## 🚀 Próximos Passos

1. **Migração Gradual**: Atualizar imports conforme necessário
2. **Linting**: Adicionar regras para forçar imports centralizados
3. **Documentação**: Manter este guia atualizado
4. **Code Review**: Verificar uso correto em PRs

## 📚 Recursos

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Material-UI TypeScript Guide](https://mui.com/guides/typescript/)

---

**🎯 Objetivo**: Código mais limpo, tipado e manutenível através de organização inteligente de tipos!
