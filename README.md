# 🔗 Link Chart - Frontend

Interface moderna da aplicação Link Chart desenvolvida em Next.js 15 com React 19.

## 🚀 Tecnologias

-   **Next.js 15**
-   **React 19**
-   **TypeScript**
-   **Material-UI (MUI) 6**
-   **ApexCharts**
-   **React Leaflet**
-   **Framer Motion**

## 📦 Instalação Local

```bash
# Clonar repositório
git clone git@github.com:bcordeirodev/linkchart-frontend.git
cd linkchart-frontend

# Instalar dependências
npm install

# Copiar configurações
cp .env.example .env.local

# Iniciar desenvolvimento
npm run dev
```

## 🌐 Deploy na Vercel

### Deploy Automático:

1. Conecte este repositório na Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Deploy Manual:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Linting
npm run lint
npm run lint:fix

# Formatação
npm run format
npm run format:check
```

## 📊 Funcionalidades

-   ✅ Dashboard de analytics
-   ✅ Encurtamento de URLs
-   ✅ Mapas de calor interativos
-   ✅ Gráficos avançados
-   ✅ Autenticação segura
-   ✅ Interface responsiva
-   ✅ Tema dark/light
-   ✅ PWA ready

## 🎨 Componentes

-   **Analytics Dashboard**: Métricas em tempo real
-   **Link Manager**: Gerenciamento de links
-   **Heatmaps**: Visualização geográfica
-   **Charts**: Gráficos interativos
-   **Forms**: Formulários otimizados
-   **Auth**: Sistema de autenticação

## ⚡ Performance

-   **Bundle Splitting**: Carregamento otimizado
-   **Image Optimization**: WebP/AVIF automático
-   **Static Generation**: SSG onde possível
-   **Edge Runtime**: Vercel Edge Functions
-   **CDN Global**: Cache distribuído

## 🔒 Segurança

-   **CSP Headers**: Content Security Policy
-   **XSS Protection**: Proteção contra ataques
-   **HSTS**: HTTP Strict Transport Security
-   **Secure Cookies**: Cookies seguros
-   **CORS**: Cross-Origin configurado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 🚀 Deploy

### **Deploy Automático**

```bash
git push origin main  # Deploy automático via GitHub Actions
```

### **Monitoramento**

-   **Aplicação**: http://134.209.33.182
-   **Health Check**: http://134.209.33.182/api/health
-   **GitHub Actions**: https://github.com/bcordeirodev/linkchart-frontend/actions

### **Documentação**

-   [📋 Guia de Deploy](DEPLOY_GUIDE.md)
-   [🔧 Workflows](WORKFLOWS_SUMMARY.md)
-   [🐳 Docker & Scripts](docker/README.md)

## 📄 Licença

Este projeto está sob a licença MIT.
