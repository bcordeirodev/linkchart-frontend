> **Status:** ✅ IMPLEMENTADO — 2026-04-27/28

# Public Analytics Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar a página pública `/public-analytics/:slug` com estética Dark Premium alinhada ao `/shorter`, exibindo apenas link card + 4 métricas + CTA strip discreta, sem gráficos nem UpgradeCTA completo.

**Architecture:** Cinco tarefas sequenciais. Nenhuma nova rota ou hook — apenas um novo componente `PublicAnalyticsCtaStrip` e redesenho visual de três componentes existentes. `PublicCharts` e `AnalyticsInfo` são removidos da renderização (sem deletar os arquivos). Tokens de cor hardcoded compartilhados com `/shorter` (índigo `#6366f1`/`#8b5cf6`, esmeralda `#10b981`, fundo `#060610`).

**Tech Stack:** React 18, MUI 6, lucide-react, date-fns/ptBR, `useClipboard` (hook interno), `useNavigate` (react-router-dom).

---

## Mapa de arquivos

| Arquivo | Ação |
|---|---|
| `src/features/public-analytics/components/info/PublicAnalyticsCtaStrip.tsx` | Criar |
| `src/features/public-analytics/components/index.ts` | Modificar — adicionar export |
| `src/features/public-analytics/components/info/LinkInfoCard.tsx` | Reescrever completo |
| `src/features/public-analytics/components/metrics/PublicMetrics.tsx` | Reescrever completo |
| `src/pages/public/PublicAnalyticsPage.tsx` | Reescrever completo |

---

## Task 1: Criar `PublicAnalyticsCtaStrip`

**Files:**
- Create: `src/features/public-analytics/components/info/PublicAnalyticsCtaStrip.tsx`

- [ ] **Criar o arquivo**

```tsx
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function PublicAnalyticsCtaStrip() {
	const navigate = useNavigate();
	return (
		<Box
			sx={{
				background: 'rgba(255,255,255,0.03)',
				border: '1px solid rgba(255,255,255,0.07)',
				borderRadius: '12px',
				p: '18px 22px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 3,
				flexDirection: { xs: 'column', sm: 'row' }
			}}
		>
			<Box>
				<Typography
					sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', mb: 0.5 }}
				>
					Ver analytics completos.
				</Typography>
				<Typography sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
					Crie uma conta grátis para acessar dispositivos, países, horários de pico e histórico de cliques.
				</Typography>
			</Box>
			<Button
				variant='contained'
				onClick={() => navigate('/sign-up')}
				sx={{
					background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
					fontWeight: 700,
					fontSize: '0.8125rem',
					px: 3,
					py: 1.25,
					borderRadius: '8px',
					boxShadow: 'none',
					whiteSpace: 'nowrap',
					flexShrink: 0,
					'&:hover': { boxShadow: 'none', opacity: 0.9 }
				}}
			>
				Criar conta grátis
			</Button>
		</Box>
	);
}
```

- [ ] **TypeScript check**

```bash
docker exec linkchart-frontend-dev sh -c "cd /app && npx tsc --noEmit 2>&1 | grep CtaStrip"
```

Esperado: sem output (zero erros).

- [ ] **Commit**

```bash
git add src/features/public-analytics/components/info/PublicAnalyticsCtaStrip.tsx
git commit -m "feat(public-analytics): cria PublicAnalyticsCtaStrip — CTA discreta dark premium"
```

---

## Task 2: Exportar `PublicAnalyticsCtaStrip` no index

**Files:**
- Modify: `src/features/public-analytics/components/index.ts`

- [ ] **Adicionar a linha de export após o export de `AnalyticsInfo`**

O arquivo atual tem:
```ts
export { AnalyticsInfo } from './info/AnalyticsInfo';
```

Adicionar logo abaixo:
```ts
export { PublicAnalyticsCtaStrip } from './info/PublicAnalyticsCtaStrip';
```

- [ ] **Commit**

```bash
git add src/features/public-analytics/components/index.ts
git commit -m "chore(public-analytics): exporta PublicAnalyticsCtaStrip"
```

---

## Task 3: Redesenhar `LinkInfoCard`

**Files:**
- Modify: `src/features/public-analytics/components/info/LinkInfoCard.tsx`

- [ ] **Reescrever o arquivo completo**

```tsx
import { Box, Typography } from '@mui/material';

import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';
import useClipboard from '@/hooks/useClipboard';

import type { PublicLinkData, PublicAnalyticsActions } from '../../types';

interface LinkInfoCardProps {
	linkData: PublicLinkData;
	actions: PublicAnalyticsActions;
}

export function LinkInfoCard({ linkData, actions }: LinkInfoCardProps) {
	const { handleCreateLink, handleVisitLink } = actions;
	const dispatch = useAppDispatch();
	const { copy } = useClipboard({
		timeout: 1500,
		onSuccess: () => dispatch(showMessage({ message: 'Link copiado!', variant: 'success' }))
	});

	return (
		<Box
			sx={{
				background: 'rgba(255,255,255,0.04)',
				border: '1px solid rgba(255,255,255,0.09)',
				borderRadius: '16px',
				p: { xs: 3, md: 3.5 },
				backdropFilter: 'blur(20px)'
			}}
		>
			{/* URL box */}
			<Box
				sx={{
					background: 'rgba(99,102,241,0.08)',
					border: '1px solid rgba(99,102,241,0.2)',
					borderRadius: '10px',
					p: '14px 18px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					mb: 2,
					gap: 2
				}}
			>
				<Typography
					sx={{
						fontFamily: 'monospace',
						fontSize: { xs: '1rem', md: '1.25rem' },
						fontWeight: 800,
						color: '#a5b4fc',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap'
					}}
				>
					{linkData.short_url}
				</Typography>
				<Box
					component='button'
					onClick={() => copy(linkData.short_url)}
					sx={{
						background: 'rgba(99,102,241,0.2)',
						border: '1px solid rgba(99,102,241,0.4)',
						borderRadius: '8px',
						px: 2.25,
						py: 1,
						fontSize: '0.8125rem',
						fontWeight: 600,
						color: '#a5b4fc',
						cursor: 'pointer',
						flexShrink: 0,
						'&:hover': { background: 'rgba(99,102,241,0.35)' }
					}}
				>
					Copiar
				</Box>
			</Box>

			{/* URL original */}
			<Typography
				title={linkData.original_url}
				sx={{
					fontFamily: 'monospace',
					fontSize: '0.8125rem',
					color: 'rgba(255,255,255,0.3)',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
					mb: 2.5
				}}
			>
				→ {linkData.original_url}
			</Typography>

			{/* Ações */}
			<Box sx={{ display: 'flex', gap: 1 }}>
				{[
					{ label: 'Encurtar outro link', onClick: handleCreateLink },
					{ label: 'Visitar destino', onClick: handleVisitLink }
				].map(({ label, onClick }) => (
					<Box
						key={label}
						component='button'
						onClick={onClick}
						sx={{
							flex: 1,
							p: '10px',
							borderRadius: '8px',
							fontSize: '0.75rem',
							fontWeight: 600,
							textAlign: 'center',
							cursor: 'pointer',
							border: '1px solid rgba(255,255,255,0.08)',
							background: 'rgba(255,255,255,0.04)',
							color: 'rgba(255,255,255,0.5)',
							'&:hover': { borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }
						}}
					>
						{label}
					</Box>
				))}
			</Box>
		</Box>
	);
}
```

- [ ] **TypeScript check**

```bash
docker exec linkchart-frontend-dev sh -c "cd /app && npx tsc --noEmit 2>&1 | grep LinkInfoCard"
```

Esperado: sem output.

- [ ] **Commit**

```bash
git add src/features/public-analytics/components/info/LinkInfoCard.tsx
git commit -m "feat(public-analytics): redesenha LinkInfoCard — dark premium glassmorphism"
```

---

## Task 4: Redesenhar `PublicMetrics`

**Files:**
- Modify: `src/features/public-analytics/components/metrics/PublicMetrics.tsx`

- [ ] **Reescrever o arquivo completo**

```tsx
import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import type { PublicAnalyticsData } from '../../types';

interface PublicMetricsProps {
	analyticsData: PublicAnalyticsData;
}

const cardBase = {
	background: 'rgba(255,255,255,0.04)',
	border: '1px solid rgba(255,255,255,0.07)',
	borderRadius: '12px',
	p: '18px 16px'
} as const;

const labelSx = {
	fontSize: '0.625rem',
	color: 'rgba(255,255,255,0.3)',
	fontWeight: 500,
	textTransform: 'uppercase' as const,
	letterSpacing: '0.5px',
	mb: 1
};

const subSx = {
	fontSize: '0.625rem',
	color: 'rgba(255,255,255,0.2)',
	mt: 0.75
};

export function PublicMetrics({ analyticsData }: PublicMetricsProps) {
	const createdDate = analyticsData.created_at ? new Date(analyticsData.created_at) : null;
	const validDate = createdDate && !isNaN(createdDate.getTime());
	const dateLabel = validDate ? format(createdDate!, 'dd/MM/yyyy', { locale: ptBR }) : '—';
	const timeLabel = validDate ? format(createdDate!, 'HH:mm', { locale: ptBR }) : '';

	return (
		<Box
			sx={{
				display: 'grid',
				gridTemplateColumns: { xs: '1fr 1fr', md: '2fr 1fr 1fr 1fr' },
				gap: '10px'
			}}
		>
			{/* Cliques — destaque */}
			<Box sx={{ ...cardBase, borderColor: 'rgba(99,102,241,0.15)', gridColumn: { xs: 'span 2', md: 'span 1' } }}>
				<Typography sx={labelSx}>Total de cliques</Typography>
				<Typography sx={{ fontSize: { xs: '2.5rem', md: '2.75rem' }, fontWeight: 900, color: '#818cf8', lineHeight: 1 }}>
					{analyticsData.total_clicks.toLocaleString('pt-BR')}
				</Typography>
				<Typography sx={subSx}>desde a criação</Typography>
			</Box>

			{/* Status */}
			<Box sx={cardBase}>
				<Typography sx={labelSx}>Status</Typography>
				<Box
					sx={{
						display: 'inline-flex',
						alignItems: 'center',
						background: analyticsData.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
						border: '1px solid',
						borderColor: analyticsData.is_active ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
						borderRadius: '6px',
						px: 1.25,
						py: 0.5,
						mt: 0.5
					}}
				>
					<Typography
						sx={{ fontSize: '0.75rem', fontWeight: 600, color: analyticsData.is_active ? '#34d399' : '#f87171' }}
					>
						{analyticsData.is_active ? 'Ativo' : 'Inativo'}
					</Typography>
				</Box>
				<Typography sx={subSx}>link operacional</Typography>
			</Box>

			{/* Criado em */}
			<Box sx={cardBase}>
				<Typography sx={labelSx}>Criado em</Typography>
				<Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
					{dateLabel}
				</Typography>
				{timeLabel ? <Typography sx={subSx}>às {timeLabel}</Typography> : null}
			</Box>

			{/* Analytics */}
			<Box sx={cardBase}>
				<Typography sx={labelSx}>Analytics</Typography>
				<Box
					sx={{
						display: 'inline-flex',
						alignItems: 'center',
						background: analyticsData.has_analytics ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.05)',
						border: '1px solid',
						borderColor: analyticsData.has_analytics ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.08)',
						borderRadius: '6px',
						px: 1.25,
						py: 0.5,
						mt: 0.5
					}}
				>
					<Typography
						sx={{
							fontSize: '0.75rem',
							fontWeight: 600,
							color: analyticsData.has_analytics ? '#a5b4fc' : 'rgba(255,255,255,0.3)'
						}}
					>
						{analyticsData.has_analytics ? 'Disponível' : 'Sem dados'}
					</Typography>
				</Box>
				<Typography sx={subSx}>dados coletados</Typography>
			</Box>
		</Box>
	);
}
```

- [ ] **TypeScript check**

```bash
docker exec linkchart-frontend-dev sh -c "cd /app && npx tsc --noEmit 2>&1 | grep PublicMetrics"
```

Esperado: sem output.

- [ ] **Commit**

```bash
git add src/features/public-analytics/components/metrics/PublicMetrics.tsx
git commit -m "feat(public-analytics): redesenha PublicMetrics — grid dark premium, cliques em destaque"
```

---

## Task 5: Redesenhar `PublicAnalyticsPage`

**Files:**
- Modify: `src/pages/public/PublicAnalyticsPage.tsx`

- [ ] **Reescrever o arquivo completo**

```tsx
import { Box, Container, Fade, Stack, Typography } from '@mui/material';
import { memo, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import {
	LinkInfoCard,
	PublicMetrics,
	PublicAnalyticsCtaStrip,
	ErrorState,
	usePublicAnalytics
} from '@/features/public-analytics';
import { PublicLayout } from '@/shared/layout';
import { PublicAnalyticsSkeleton } from '@/shared/ui/feedback/skeletons';

function PublicAnalyticsPage() {
	const { slug } = useParams<{ slug: string }>();
	const {
		linkData,
		analyticsData,
		loading,
		error,
		debugInfo,
		handleCopyLink,
		handleCreateLink,
		handleVisitLink
	} = usePublicAnalytics({ slug });

	const actions = useMemo(
		() => ({ handleCopyLink, handleCreateLink, handleVisitLink }),
		[handleCopyLink, handleCreateLink, handleVisitLink]
	);

	if (loading) {
		return <PublicAnalyticsSkeleton />;
	}

	if (error || !linkData || !analyticsData) {
		return (
			<ErrorState
				error={error || 'Link não encontrado'}
				debugInfo={debugInfo}
				onCreateLink={handleCreateLink}
			/>
		);
	}

	return (
		<PublicLayout
			variant='shorter'
			showHeader
			showFooter
		>
			<Box sx={{ position: 'relative', minHeight: '100vh', background: '#060610' }}>
				{/* Glow índigo — top right */}
				<Box
					sx={{
						position: 'fixed',
						top: '-20%',
						right: '-10%',
						width: 500,
						height: 500,
						borderRadius: '50%',
						pointerEvents: 'none',
						zIndex: 0,
						background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)'
					}}
				/>
				{/* Glow esmeralda — bottom left */}
				<Box
					sx={{
						position: 'fixed',
						bottom: '-20%',
						left: '-10%',
						width: 400,
						height: 400,
						borderRadius: '50%',
						pointerEvents: 'none',
						zIndex: 0,
						background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)'
					}}
				/>

				<Container
					maxWidth='md'
					sx={{ position: 'relative', zIndex: 1, py: { xs: 4, md: 6 }, pb: 8 }}
				>
					<Stack spacing={2}>
						<Fade in timeout={400}>
							<Typography
								sx={{
									fontSize: '0.6875rem',
									fontWeight: 600,
									color: 'rgba(255,255,255,0.3)',
									letterSpacing: '1px',
									textTransform: 'uppercase'
								}}
							>
								Analytics do link
							</Typography>
						</Fade>

						<Fade in timeout={600}>
							<Box>
								<LinkInfoCard
									linkData={linkData}
									actions={actions}
								/>
							</Box>
						</Fade>

						<Fade in timeout={900}>
							<Box>
								<PublicMetrics analyticsData={analyticsData} />
							</Box>
						</Fade>

						<Fade in timeout={1200}>
							<Box>
								<PublicAnalyticsCtaStrip />
							</Box>
						</Fade>
					</Stack>
				</Container>
			</Box>
		</PublicLayout>
	);
}

export default memo(PublicAnalyticsPage);
```

- [ ] **TypeScript check geral**

```bash
docker exec linkchart-frontend-dev sh -c "cd /app && npx tsc --noEmit 2>&1 | grep -v '^$' | head -20"
```

Esperado: apenas os erros pré-existentes da área de analytics (não relacionados a esta feature). Nenhum erro novo nos arquivos modificados.

- [ ] **Verificar no browser em `http://localhost:3000/public-analytics/<slug>`** com um slug real

  Checklist visual:
  - [ ] Fundo `#060610` com glows radiais visíveis
  - [ ] Header com "Entrar" e "Criar conta grátis"
  - [ ] Label "ANALYTICS DO LINK" em uppercase discreto
  - [ ] Card glassmorphism: short_url em monospace `#a5b4fc`, botão Copiar, URL original truncada, 2 botões de ação
  - [ ] Clicar "Copiar" → toast "Link copiado!" aparece
  - [ ] Grid de métricas: cliques em `#818cf8` grande, chips de Status e Analytics sem animação
  - [ ] CTA strip: texto neutro + botão gradiente "Criar conta grátis"
  - [ ] Sem gráficos, sem UpgradeCTA com lista de features

- [ ] **Commit**

```bash
git add src/pages/public/PublicAnalyticsPage.tsx
git commit -m "feat(public-analytics): redesign dark premium — layout compacto, sem gráficos"
```

---

## Self-Review

**Cobertura do spec:**
- ✅ Dark Premium: `#060610`, glows radiais, glassmorphism
- ✅ Header com auth buttons (via `PublicLayout variant='shorter'`, já implementado)
- ✅ Sem badges pulsantes, sem animações chamativas
- ✅ LinkInfoCard: short_url + copiar + original_url + 2 ações
- ✅ PublicMetrics: grid 4 colunas, cliques em destaque `#818cf8`
- ✅ PublicAnalyticsCtaStrip: faixa discreta, botão "Criar conta grátis" → `/sign-up`
- ✅ PublicCharts e AnalyticsInfo removidos da página (arquivos mantidos)

**Tipos consistentes:**
- `PublicLinkData` e `PublicAnalyticsActions` usados em Task 3 batem com `types/index.ts` ✅
- `PublicAnalyticsData` usado em Task 4 bate com `types/index.ts` ✅
- `usePublicAnalytics` retorna `{ linkData, analyticsData, loading, error, debugInfo, handleCopyLink, handleCreateLink, handleVisitLink }` — todos desestruturados na Task 5 ✅

**Atenção Task 3:** `LinkInfoCard` agora usa `useClipboard` diretamente em vez de `actions.handleCopyLink`. `handleCopyLink` é recebido via `actions` mas não usado — isso não causa erro de TypeScript (desestruturar apenas o que é necessário do objeto). O `handleCopyLink` continua fazendo parte da interface `PublicAnalyticsActions` no hook pai.
