# 👥 Módulo de Audiência - Link Chart

## 📋 **Visão Geral**

O módulo de audiência fornece análises completas sobre o comportamento e características dos usuários que interagem com seus links. Oferece insights sobre dispositivos, navegadores, sistemas operacionais e padrões de engajamento.

## 🏗️ **Arquitetura**

### **Componentes Principais:**

```
audience/
├── AudienceAnalysis.tsx     # Componente principal unificado
├── AudienceChart.tsx        # Gráficos de distribuição
├── AudienceInsights.tsx     # Insights estratégicos
├── AudienceMetrics.tsx      # Métricas agregadas
├── hooks/
│   └── useAudienceData.ts   # Hook personalizado
├── types/
│   └── audience.ts          # Tipos centralizados
└── README.md               # Esta documentação
```

## 🚀 **Uso Básico**

### **1. Modo Global (Todos os Links)**

```tsx
import { AudienceAnalysis } from '@/features/analytics/components/audience';

function GlobalAnalytics() {
	return (
		<AudienceAnalysis
			title='📊 Audiência Global'
		/>
	);
}
```

### **2. Link Específico**

```tsx
import { AudienceAnalysis } from '@/features/analytics/components/audience';

function LinkAnalytics({ linkId }: { linkId: string }) {
	return (
		<AudienceAnalysis
			linkId={linkId}
			title={`📊 Audiência - Link ${linkId}`}
		/>
	);
}
```

### **3. Modo Legado (Compatibilidade)**

```tsx
import { AudienceAnalysis } from '@/features/analytics/components/audience';

function LegacyAnalytics({ data }: { data: any }) {
	return (
		<AudienceAnalysis
			data={data}
			showTitle={false}
		/>
	);
}
```

## 🎯 **Hook useAudienceData**

### **Funcionalidades:**

-   ✅ **Busca automática** de dados (global ou específico)
-   ✅ **Tempo real** com polling configurável
-   ✅ **Gestão de estado** completa (loading, error, data)
-   ✅ **Cancelamento de requisições** para evitar race conditions
-   ✅ **Cálculo de estatísticas** agregadas
-   ✅ **Refresh manual** dos dados

### **Exemplo de Uso:**

```tsx
import { useAudienceData } from '@/features/analytics/components/audience';

function CustomAudienceComponent() {
	const { data, stats, loading, error, refresh, isRealtime } = useAudienceData({
		linkId: '123',
		enableRealtime: true,
		refreshInterval: 30000, // 30 segundos
		includeDetails: true
	});

	if (loading) return <div>Carregando...</div>;
	if (error) return <div>Erro: {error}</div>;

	return (
		<div>
			<h3>Dispositivos: {data?.device_breakdown?.length}</h3>
			<p>Total de cliques: {stats?.totalClicks}</p>
			<p>Dispositivo principal: {stats?.primaryDevice}</p>
			<button onClick={refresh}>Atualizar</button>
		</div>
	);
}
```

## 📊 **Componentes Individuais**

### **AudienceChart**

Renderiza gráficos interativos de distribuição de audiência.

```tsx
import { AudienceChart } from '@/features/analytics/components/audience';

<AudienceChart
	deviceBreakdown={devices}
	browserBreakdown={browsers}
	osBreakdown={operatingSystems}
	totalClicks={1000}
	height={400}
	showPieChart={true}
	showBarChart={true}
/>;
```

### **AudienceInsights**

Fornece insights estratégicos baseados nos dados.

```tsx
import { AudienceInsights } from '@/features/analytics/components/audience';

<AudienceInsights
	deviceBreakdown={devices}
	browserBreakdown={browsers}
	totalClicks={1000}
	showAdvancedInsights={true}
/>;
```

### **AudienceMetrics**

Exibe métricas agregadas em cards.

```tsx
import { AudienceMetrics } from '@/features/analytics/components/audience';

<AudienceMetrics
	data={audienceData}
	showTitle={true}
	title='📊 Métricas de Audiência'
	variant='detailed'
/>;
```

## 🔧 **Configuração Avançada**

### **Opções do Hook useAudienceData:**

```typescript
interface UseAudienceDataOptions {
	linkId?: string; // ID do link específico
	enableRealtime?: boolean; // Habilitar tempo real
	refreshInterval?: number; // Intervalo de atualização (ms)
	includeDetails?: boolean; // Incluir dados detalhados
}
```

### **Estrutura de Dados:**

```typescript
interface AudienceData {
	device_breakdown: DeviceData[]; // Dispositivos
	browser_breakdown?: BrowserData[]; // Navegadores
	os_breakdown?: OSData[]; // Sistemas operacionais
	referrer_breakdown?: ReferrerData[]; // Fontes de tráfego
	stats?: AudienceStats; // Estatísticas agregadas
}
```

## 🌐 **Endpoints da API**

### **Link Específico:**

-   `GET /api/analytics/link/{linkId}/audience`

### **Global (Métricas Unificadas):**

-   `GET /api/metrics/dashboard?category=audience`

### **Estrutura da Resposta:**

```json
{
  "success": true,
  "data": {
    "device_breakdown": [
      {
        "device": "Desktop",
        "clicks": 150,
        "percentage": 60.0
      },
      {
        "device": "Mobile",
        "clicks": 100,
        "percentage": 40.0
      }
    ],
    "browser_breakdown": [...],
    "os_breakdown": [...]
  },
  "metadata": {
    "total_clicks": 250,
    "unique_visitors": 180,
    "primary_device": "Desktop",
    "last_updated": "2024-01-15T10:30:00Z"
  }
}
```

## 🎨 **Personalização**

### **Temas e Estilos:**

O módulo utiliza o sistema de temas do Material-UI e pode ser personalizado através de:

```tsx
import { ThemeProvider } from '@mui/material/styles';

const customTheme = {
	palette: {
		primary: { main: '#1976d2' },
		secondary: { main: '#dc004e' }
	}
};

<ThemeProvider theme={customTheme}>
	<AudienceAnalysis {...props} />
</ThemeProvider>;
```

### **Cores dos Gráficos:**

```typescript
const chartColors = [
	'#1976d2', // Azul principal
	'#2e7d32', // Verde
	'#dc004e', // Rosa
	'#9c27b0', // Roxo
	'#ff9800', // Laranja
	'#d32f2f' // Vermelho
];
```

## 🔍 **Troubleshooting**

### **Problemas Comuns:**

#### **1. Dados não carregam**

```bash
# Verificar se o endpoint está funcionando
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/analytics/link/123/audience
```

#### **2. Erro de CORS**

-   Verificar configuração no `back-end/config/cors.php`
-   Confirmar que o frontend está na lista de origens permitidas

#### **3. Hook não atualiza**

```tsx
// Forçar refresh manual
const { refresh } = useAudienceData({ linkId: '123' });

useEffect(() => {
	refresh();
}, [someCondition]);
```

#### **4. Performance lenta**

```tsx
// Reduzir intervalo de polling
const { data } = useAudienceData({
	linkId: '123',
	refreshInterval: 120000, // 2 minutos em vez de 1
	includeDetails: false // Menos dados detalhados
});
```

## 📈 **Métricas e Analytics**

### **Estatísticas Calculadas:**

-   **Total de Cliques:** Soma de todos os cliques registrados
-   **Visitantes Únicos:** Estimativa baseada em padrões de uso
-   **Dispositivo Principal:** Dispositivo com maior número de cliques
-   **Taxa de Novos Visitantes:** Percentual de visitantes novos vs. retornantes
-   **Taxa de Rejeição:** Percentual de visitantes que saem rapidamente
-   **Duração Média da Sessão:** Tempo médio de permanência

### **Insights Automáticos:**

-   **Mobile-First:** Quando mobile > 60% dos cliques
-   **Desktop-Focused:** Quando desktop > 60% dos cliques
-   **Audiência Equilibrada:** Quando diferença < 10%
-   **Alta Diversidade:** Quando > 3 tipos de dispositivos
-   **Recomendações Estratégicas:** Baseadas no perfil da audiência

## 🚀 **Roadmap**

### **Versão 2.1 (Próxima):**

-   [ ] Suporte a filtros por período
-   [ ] Comparação entre períodos
-   [ ] Exportação de dados
-   [ ] Alertas personalizados

### **Versão 2.2 (Futuro):**

-   [ ] Integração com Google Analytics
-   [ ] Segmentação avançada de audiência
-   [ ] Predições baseadas em ML
-   [ ] Dashboard customizável

## 🤝 **Contribuição**

Para contribuir com o módulo de audiência:

1. **Seguir padrões:** JSDoc, TypeScript strict, testes unitários
2. **Manter compatibilidade:** Não quebrar APIs existentes
3. **Documentar mudanças:** Atualizar este README
4. **Testar completamente:** Modo global, específico e legado

## 📝 **Changelog**

### **v2.0.0 (Atual)**

-   ✅ Hook `useAudienceData` implementado
-   ✅ Suporte a modo global e específico
-   ✅ Tipos centralizados e documentados
-   ✅ Componentes refatorados e otimizados
-   ✅ Documentação completa

### **v1.0.0 (Legado)**

-   ✅ Componentes básicos de audiência
-   ✅ Integração com `useEnhancedAnalytics`
-   ✅ Gráficos e insights básicos
