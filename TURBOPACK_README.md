# 🚀 Turbopack Configuration

Este projeto agora está configurado para usar o **Turbopack**, o bundler de próxima geração do Next.js, que oferece performance significativamente melhorada durante o desenvolvimento.

## ⚡ Performance Benefits

- **~10x mais rápido** que o Webpack para builds incrementais
- **Hot Module Replacement (HMR)** mais rápido
- **Cold starts** mais rápidos
- **Menor uso de memória**

## 🛠️ Scripts Disponíveis

### Desenvolvimento com Turbopack (Recomendado)
```bash
npm run dev
```

### Desenvolvimento com Webpack (Legacy)
```bash
npm run dev:legacy
```

### Build de Produção
```bash
npm run build
```

## 📋 Configurações

### package.json
- Script `dev` atualizado para usar `--turbo`
- Script `dev:legacy` mantido para compatibilidade

### next.config.mjs
- Configuração experimental do Turbopack adicionada
- Configuração simplificada para máxima compatibilidade
- Raw-loader mantido apenas para Webpack (fallback)

## 🔧 Compatibilidade

O Turbopack está em **stable** no Next.js 15+ e é totalmente compatível com:
- ✅ TypeScript
- ✅ CSS Modules
- ✅ Tailwind CSS
- ✅ Material-UI
- ✅ NextAuth
- ✅ API Routes

## 🐛 Troubleshooting

Se encontrar problemas com o Turbopack, você pode:

1. **Usar o modo legacy temporariamente:**
   ```bash
   npm run dev:legacy
   ```

2. **Verificar logs detalhados:**
   ```bash
   npm run dev -- --show-all
   ```

3. **Limpar cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

## 📊 Monitoramento

Para verificar se o Turbopack está ativo:
```bash
ps aux | grep "next dev --turbo"
```

Você deve ver o processo rodando com a flag `--turbo`.

---

**Nota:** O Turbopack é automaticamente usado apenas em desenvolvimento. Builds de produção ainda usam o Webpack otimizado do Next.js.
