# Migração de Ícones para Lucide React

**Data:** 2026-04-27
**Stack afetada:** frontend (React/Vite)
**Escopo:** substituição completa de `@mui/icons-material` + `react-icons` por `lucide-react`

## 1. Objetivo

Unificar o sistema de ícones do projeto em uma única biblioteca moderna (`lucide-react`), eliminando a mistura de 3 bibliotecas inconsistentes. O resultado visual: ícones stroke-based finos (`strokeWidth=1.5`), estilo Vercel/Linear/Figma, alinhados com o tema dark premium do projeto.

## 2. Estado atual

| Biblioteca | Arquivos | Problema |
|---|---|---|
| `@mui/icons-material` | 46 | Ícones filled/Material Design, visual datado |
| `react-icons/hi2` + `/md` | 5 | Inconsistente com o restante |
| `lucide-react` | 3 | Já instalado, subutilizado |

## 3. Decisões

- **Biblioteca destino:** `lucide-react` (já instalada, `^0.542.0`)
- **strokeWidth padrão:** `1.5`
- **Tamanho padrão:** `18` (inline), `20` (destaque), `16` (menus/chips)
- **Estratégia:** importações diretas por arquivo + constante central de defaults
- **AppIcons.ts:** atualizar para re-exportar de `lucide-react` (manter como referência centralizada)
- **Remover:** `react-icons` das dependências após migração

## 4. Arquivo de configuração central

Criar `src/lib/theme/iconDefaults.ts`:

```typescript
export const ICON_SM  = { size: 16, strokeWidth: 1.5 } as const; // menus, chips
export const ICON_MD  = { size: 18, strokeWidth: 1.5 } as const; // inline, botões
export const ICON_LG  = { size: 20, strokeWidth: 1.5 } as const; // destaques
export const ICON_XL  = { size: 24, strokeWidth: 1.5 } as const; // headers
```

Uso:
```tsx
import { Search } from 'lucide-react';
import { ICON_MD } from '@/lib/theme/iconDefaults';

<Search {...ICON_MD} />
```

## 5. Mapa de substituições

### @mui/icons-material → lucide-react

| MUI | Lucide | Notas |
|---|---|---|
| `Search` | `Search` | |
| `FilterList` | `SlidersHorizontal` | |
| `Sort`, `SwapVert` | `ArrowUpDown` | |
| `Add` | `Plus` | |
| `ContentCopy` | `Copy` | |
| `Launch` | `ExternalLink` | |
| `Language` | `Globe` | |
| `BarChart`, `Assessment` | `BarChart3` | |
| `TrendingUp` | `TrendingUp` | |
| `TrendingDown` | `TrendingDown` | |
| `TrendingFlat` | `Minus` | |
| `CheckCircle` | `CheckCircle` | |
| `Cancel`, `Error` | `XCircle` | |
| `Warning` | `AlertTriangle` | |
| `Schedule`, `AccessTime` | `Clock` | |
| `CalendarToday` | `Calendar` | |
| `Link`, `LinkIcon` | `Link2` | |
| `Person` | `User` | |
| `People` | `Users` | |
| `Settings` | `Settings` | |
| `Visibility` | `Eye` | |
| `VisibilityOff` | `EyeOff` | |
| `ArrowBack` | `ArrowLeft` | |
| `ArrowForward` | `ArrowRight` | |
| `Share` | `Share2` | |
| `Download` | `Download` | |
| `Email` | `Mail` | |
| `Lock` | `Lock` | |
| `Shield` | `Shield` | |
| `Speed` | `Zap` | |
| `Star` | `Star` | |
| `Refresh` | `RefreshCw` | |
| `Home` | `Home` | |
| `Public` | `Globe` | |
| `LocationOn` | `MapPin` | |
| `LocationCity` | `Building2` | |
| `Flag` | `Flag` | |
| `Devices`, `DevicesOther` | `Monitor` | |
| `TouchApp`, `Mouse` | `MousePointer2` | |
| `Timeline`, `ShowChart` | `LineChart` | |
| `Lightbulb` | `Lightbulb` | |
| `Rocket` | `Rocket` | |
| `Traffic` | `Activity` | |
| `Send` | `Send` | |
| `Save` | `Save` | |
| `PhotoCamera` | `Camera` | |
| `GitHub` | `Github` | |
| `LinkedIn` | `Linkedin` | |
| `Twitter` | `Twitter` | |
| `ExpandMore` | `ChevronDown` | |
| `Verified` | `BadgeCheck` | |
| `BugReport` | `Bug` | |
| `Fullscreen` | `Maximize2` | |
| `Security` | `ShieldCheck` | |
| `Repeat` | `Repeat` | |
| `Diversity3` | `Users2` | |
| `ErrorOutline` | `AlertCircle` | |
| `InfoOutlined` | `Info` | |

### react-icons → lucide-react

| react-icons | Lucide |
|---|---|
| `HiChartBar` | `BarChart3` |
| `HiClipboardDocument` | `ClipboardCopy` |
| `HiEllipsisVertical` | `MoreVertical` |
| `HiListBullet` | `List` |
| `HiPencilSquare` | `Pencil` |
| `HiQrCode` | `QrCode` |
| `HiTrash` | `Trash2` |
| `MdPeople` | `Users` |
| `MdPhoneAndroid` | `Smartphone` |
| `MdLanguage` | `Globe` |
| `MdComputer` | `Monitor` |
| `MdBolt` | `Zap` |
| `MdPublic` | `Globe` |
| `MdBarChart` | `BarChart3` |
| `MdEmojiEvents` | `Trophy` |

## 6. Padrão de uso em JSX

### Antes (MUI):
```tsx
import { Search } from '@mui/icons-material';
<Search sx={{ fontSize: 20, color: 'text.secondary' }} />
```

### Depois (Lucide):
```tsx
import { Search } from 'lucide-react';
import { ICON_LG } from '@/lib/theme/iconDefaults';
<Search {...ICON_LG} className="text-secondary" />
// ou com cor explícita:
<Search {...ICON_LG} color={theme.palette.text.secondary} />
```

### Em MUI InputAdornment:
```tsx
// Antes:
<InputAdornment position="start">
    <Search sx={{ color: 'text.secondary', fontSize: 22 }} />
</InputAdornment>

// Depois:
<InputAdornment position="start">
    <Search size={20} strokeWidth={1.5} color={theme.palette.text.secondary} />
</InputAdornment>
```

### Em MUI Button.startIcon:
```tsx
// Antes:
<Button startIcon={<Add />}>Criar</Button>

// Depois:
<Button startIcon={<Plus size={18} strokeWidth={1.5} />}>Criar</Button>
```

## 7. Atualização do AppIcons.ts

Converter `src/shared/ui/icons/AppIcons.ts` para re-exportar de `lucide-react` com o `strokeWidth=1.5` aplicado via wrapper ou spread. Manter como referência mas não obrigatório para uso.

## 8. Remoção de dependências

Após migração completa:
```bash
npm uninstall react-icons
```
Manter `@mui/icons-material` apenas se algum ícone do MUI não tiver equivalente Lucide aceitável (improvável).

## 9. Fases de execução

1. **Setup:** criar `iconDefaults.ts`
2. **react-icons (5 arquivos):** migração mais fácil e de maior impacto imediato
3. **features/links (8 arquivos):** área de maior visibilidade
4. **features/analytics (15 arquivos):** maior volume
5. **shared/ui + pages (23 arquivos):** restante
6. **Cleanup:** remover `react-icons`, atualizar `AppIcons.ts`
7. **Validação:** `npm run quality` + inspeção visual

## 10. Critérios de aceitação

- [ ] Nenhum import de `@mui/icons-material` restante no codebase
- [ ] Nenhum import de `react-icons` restante
- [ ] Todos os ícones renderizam com `strokeWidth=1.5`
- [ ] `npm run type-check` passa sem erros
- [ ] `npm run lint` passa sem erros
- [ ] Visual verificado no browser: ícones consistentes em todas as telas
- [ ] `react-icons` removido do `package.json`
