# 🏗️ Arquitetura de Services - Frontend

## 📋 Visão Geral

Esta pasta contém a arquitetura centralizada de services para comunicação com o backend. Todos os fetchs e chamadas de API devem passar por estes services.

## 🎯 Objetivos

- **Centralizar** todas as chamadas de API
- **Padronizar** tratamento de erros e fallbacks
- **Eliminar** código duplicado
- **Facilitar** manutenção e debugging
- **Garantir** type safety completo

## 📁 Estrutura

```
src/services/
├── base.service.ts          # Service base para herança
├── auth.service.ts          # Autenticação e usuário
├── link.service.ts          # Gerenciamento de links
├── profile.service.ts       # Perfil do usuário
├── analytics.service.ts     # Analytics e métricas
├── index.ts                 # Exportações centralizadas
└── README.md               # Esta documentação
```

## 🏛️ Arquitetura

### BaseService

Classe abstrata que fornece:
- ✅ Métodos HTTP padronizados (`get`, `post`, `put`, `delete`)
- ✅ Tratamento de erro unificado
- ✅ Logging centralizado
- ✅ Validações automáticas
- ✅ Fallbacks configuráveis
- ✅ Type safety completo

```typescript
// Exemplo de herança
class MyService extends BaseService {
    constructor() {
        super('MyService');
    }

    async getData(): Promise<MyData> {
        return this.get<MyData>('/endpoint', {
            fallback: defaultData,
            context: 'get_data'
        });
    }
}
```

### Services Específicos

#### AuthService
- `signIn()` - Login do usuário
- `signUp()` - Registro de novo usuário
- `getMe()` - Dados do usuário atual
- `signOut()` - Logout

#### LinkService
- `all()` - Lista todos os links
- `save()` - Cria novo link
- `update()` - Atualiza link existente
- `findOne()` - Busca link específico
- `remove()` - Remove link
- `getAnalytics()` - Analytics do link
- `createShortUrl()` - Cria URL encurtada (legacy)

#### AnalyticsService
- `getAnalytics()` - Analytics gerais
- `getDashboardMetrics()` - Métricas do dashboard
- `getLinkPerformance()` - Performance de links
- `getLinkAnalytics()` - Analytics de link específico
- `getEnhancedLinkAnalytics()` - Analytics avançados
- `getLinkGeographicData()` - Dados geográficos
- `getLinkHeatmap()` - Heatmap de links
- `getLinkInsights()` - Insights de negócio
- `getMetricsByCategory()` - Métricas por categoria
- `compareMetrics()` - Comparação de métricas
- `clearMetricsCache()` - Limpar cache

#### ProfileService
- `getCurrentUser()` - Usuário atual
- `updateProfile()` - Atualizar perfil

## 📝 Como Usar

### Importação Individual
```typescript
import { linkService, analyticsService } from '@/services';

// Usar os services
const links = await linkService.all();
const analytics = await analyticsService.getAnalytics();
```

### Importação do Objeto Consolidado
```typescript
import { services } from '@/services';

// Usar via objeto consolidado
const links = await services.link.all();
const analytics = await services.analytics.getAnalytics();
```

### Hook Helper
```typescript
import { useServices } from '@/services';

function MyComponent() {
    const { link, analytics } = useServices();
    
    // Usar nos effects/callbacks
    useEffect(() => {
        link.all().then(setLinks);
    }, []);
}
```

### Compatibilidade Legacy
```typescript
// Ainda funciona para compatibilidade
import * as linkService from '@/services/link.service';
const links = await linkService.all();
```

## 🛠️ Funcionalidades

### Tratamento de Erros Automático
```typescript
// O service automaticamente:
// 1. Loga o erro
// 2. Aplica fallback se configurado
// 3. Propaga erro se necessário
const data = await analyticsService.getAnalytics();
// ↳ Sempre retorna dados válidos (real ou fallback)
```

### Validações Automáticas
```typescript
// Validação de IDs
await linkService.findOne(''); // ❌ Erro: ID é obrigatório

// Validação de campos obrigatórios
await linkService.save({}); // ❌ Erro: original_url é obrigatório
```

### Fallbacks Configuráveis
```typescript
// Com fallback
const links = await linkService.all();
// ↳ Se API falhar, retorna dados mockados

// Sem fallback (propaga erro)
const specificData = await linkService.findOne('123');
// ↳ Se falhar, throw error
```

### Logging Centralizado
```typescript
// Automático em desenvolvimento:
// ✅ LinkService GET /api/links - Success
// ❌ LinkService GET /api/links/123 - Error: 404

// Em produção: apenas erros são logados
```

## 🔄 Migração de Hooks

### Antes (chamada direta)
```typescript
const response = await api.get('/api/analytics');
```

### Depois (via service)
```typescript
const response = await analyticsService.getAnalytics();
```

### Benefícios da Migração
- ✅ **Fallback automático** se endpoint falhar
- ✅ **Validação** de parâmetros
- ✅ **Logging** padronizado
- ✅ **Type safety** completo
- ✅ **Tratamento de erro** unificado
- ✅ **Manutenibilidade** maior

## 🚀 Padrões de Uso

### Para Hooks
```typescript
export function useMyData() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Usar service - ele já tem fallback e logging
            const response = await myService.getData();
            setData(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, refetch: fetchData };
}
```

### Para Componentes
```typescript
function MyComponent() {
    const { link } = useServices();
    
    const handleCreate = async (formData) => {
        try {
            await link.save(formData);
            // Success feedback
        } catch (error) {
            // Error feedback
        }
    };
}
```

## 📊 Vantagens

### Antes da Padronização
- ❌ **50+ chamadas diretas** ao `api`
- ❌ **Fallbacks duplicados** em vários hooks
- ❌ **Validações inconsistentes**
- ❌ **Tratamento de erro** espalhado
- ❌ **Logs desnecessários** misturados

### Depois da Padronização
- ✅ **4 services centralizados** + BaseService
- ✅ **Fallbacks automáticos** configuráveis
- ✅ **Validações padronizadas**
- ✅ **Tratamento de erro unificado**
- ✅ **Logging estruturado** apenas quando necessário

## 🎯 Próximos Passos

1. **Migrar hooks restantes** para usar services
2. **Adicionar testes unitários** para services
3. **Implementar cache** no BaseService
4. **Adicionar retry automático** para falhas de rede
5. **Métricas de performance** dos services

---

**💡 Esta arquitetura garante que todo fetch ao backend seja controlado, logado e tratado de forma consistente!**
