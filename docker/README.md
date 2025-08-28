# 🐳 Docker & Scripts - Link Chart Frontend

## 📋 **ESTRUTURA**

```
docker/
├── development/           # Ambiente de desenvolvimento
│   ├── Dockerfile        # Imagem para dev com hot reload
│   └── docker-compose.yml # Orquestração para desenvolvimento
├── production/           # Ambiente de produção
│   ├── Dockerfile        # Imagem otimizada para produção
│   └── docker-compose.yml # Orquestração para produção
├── scripts/              # Scripts de automação
│   ├── build-docker.sh   # Build da imagem Docker
│   ├── cleanup.js        # Limpeza de arquivos temporários
│   ├── fix-client-components.js # Correção automática de 'use client'
│   ├── test-docker.sh    # Teste da imagem Docker
│   └── validate-structure.js # Validação da estrutura do projeto
└── README.md            # Esta documentação
```

---

## 🚀 **DEPLOY ATUAL**

### ✅ **Deploy SSH (Ativo)**

O deploy em produção é feito via **SSH direto** no servidor, **não via Docker**.

-   Workflow: `.github/workflows/deploy-ssh.yml`
-   Método: `npm ci && npm run build && systemctl restart`
-   Status: ✅ 100% funcional

### 🐳 **Docker (Alternativo)**

Os arquivos Docker estão mantidos para:

-   Desenvolvimento local
-   Testes de build
-   Deploy futuro via containers (se necessário)

---

## 🛠️ **SCRIPTS DISPONÍVEIS**

### 1. **Validação e Correção**

#### `validate-structure.js`

```bash
npm run validate
```

-   ✅ Verifica client components (`'use client'`)
-   ✅ Analisa tamanho de arquivos
-   ✅ Testa build automaticamente
-   ✅ Relatório detalhado de problemas

#### `fix-client-components.js`

```bash
npm run fix:client
```

-   ✅ Adiciona `'use client'` automaticamente
-   ✅ Corrige componentes React que usam hooks
-   ✅ Preserva estrutura e comentários

#### `cleanup.js`

```bash
npm run cleanup
```

-   ✅ Remove arquivos temporários
-   ✅ Limpa cache de build
-   ✅ Organiza estrutura de arquivos

### 2. **Docker (Desenvolvimento/Teste)**

#### `build-docker.sh`

```bash
npm run docker:build
```

-   🐳 Build da imagem Docker de produção
-   🔍 Validação antes do build
-   📊 Análise de tamanho da imagem

#### `test-docker.sh`

```bash
npm run docker:test
```

-   🧪 Testa a imagem Docker
-   🔍 Health check automático
-   📋 Relatório de funcionamento

---

## 📦 **COMANDOS NPM**

### **Desenvolvimento**

```bash
npm run dev              # Desenvolvimento local (sem Docker)
npm run build            # Build de produção
npm run start            # Iniciar aplicação
```

### **Validação e Correção**

```bash
npm run validate         # Validar estrutura
npm run fix:client       # Corrigir client components
npm run fix:all          # Corrigir tudo (client + lint + format)
npm run cleanup          # Limpar arquivos temporários
```

### **Docker (Opcional)**

```bash
npm run docker:build    # Build da imagem
npm run docker:test     # Testar imagem
npm run docker:all      # Cleanup + Build + Test
```

### **Desenvolvimento com Docker**

```bash
# Ambiente completo com hot reload
docker-compose -f docker/development/docker-compose.yml up

# Apenas build de produção
docker-compose -f docker/production/docker-compose.yml up --build
```

---

## 🔧 **CONFIGURAÇÃO DOS DOCKERFILES**

### **Development Dockerfile**

-   🔥 Hot reload habilitado
-   🛠️ DevDependencies incluídas
-   📝 Logs detalhados
-   🔄 Restart automático

### **Production Dockerfile**

-   ⚡ Multi-stage build otimizado
-   🗜️ Imagem mínima (apenas runtime)
-   🔒 Usuário não-root
-   🏥 Health check configurado

---

## 📊 **QUANDO USAR CADA MÉTODO**

### 🚀 **Deploy SSH (Atual - Recomendado)**

-   ✅ Deploy rápido (3-5 min)
-   ✅ Menos complexidade
-   ✅ Controle direto do servidor
-   ✅ Logs diretos no systemd

### 🐳 **Deploy Docker (Futuro)**

-   🔄 Isolamento completo
-   📦 Portabilidade entre ambientes
-   🔧 Orquestração com Docker Compose
-   📈 Escalabilidade horizontal

---

## 🛠️ **MANUTENÇÃO**

### **Scripts de Validação**

Execute regularmente para manter a qualidade:

```bash
# Antes de commits importantes
npm run validate

# Correção automática
npm run fix:all

# Limpeza periódica
npm run cleanup
```

### **Testes Docker**

Para validar builds alternativos:

```bash
# Testar build Docker
npm run docker:build

# Verificar funcionamento
npm run docker:test
```

---

## 🎯 **RESUMO**

### ✅ **Funcionando**

-   **Deploy SSH**: 100% operacional via GitHub Actions
-   **Scripts**: Validação e correção automática
-   **Docker**: Pronto para uso futuro

### 📋 **Arquivos Importantes**

-   `docker/production/Dockerfile` - Imagem de produção
-   `docker/scripts/validate-structure.js` - Validação principal
-   `docker/scripts/fix-client-components.js` - Correção automática

### 🚀 **Para Deploy**

Use o método atual via SSH:

```bash
git push origin main
```

**Os scripts Docker estão prontos para uso futuro se necessário!** 🐳
