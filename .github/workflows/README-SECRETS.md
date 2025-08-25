# 🔐 Secrets Necessários para CI/CD

## 📋 Configuração no GitHub Repository

Para que o workflow de deploy funcione, você precisa configurar os seguintes secrets no seu repositório:

### 🔑 Acesse: `Settings > Secrets and variables > Actions`

### 1. **Docker Hub Credentials**
```
DOCKERHUB_USERNAME = seu_usuario_dockerhub
DOCKERHUB_TOKEN = seu_token_dockerhub
```

### 2. **Server Deploy**
```
DEPLOY_HOST = 138.197.121.81
DEPLOY_SSH_KEY = sua_chave_ssh_privada
```

### 3. **Environment Variables**
```
NEXT_PUBLIC_API_URL = http://138.197.121.81
NEXT_PUBLIC_BASE_URL = https://linkchartapp.com
NEXT_PUBLIC_SITE_URL = https://linkchartapp.com
API_BASE_URL = http://138.197.121.81
AUTH_SECRET = Jk9vT3N2cXl5Z0p4b3F1dGZrT3Z3c2R5R2F2c3F1c3J3b3F1c3R2c3F1dGZrT3Z3c2Q=
GOOGLE_CLIENT_ID = 752687363878-6dai5pmt33iua9l4mmeuh9l1fafirpsn.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = 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
AUTH_URL = https://linkchartapp.com
NEXTAUTH_URL = https://linkchartapp.com
NEXT_PUBLIC_APP_NAME = Link Chart
NEXT_PUBLIC_APP_VERSION = 1.0.0
NEXT_PUBLIC_APP_DESCRIPTION = Encurtador de URLs profissional com analytics avançados
```

## 🚀 Como Configurar

### **Docker Hub Token:**
1. Acesse [Docker Hub](https://hub.docker.com)
2. Vá em `Account Settings > Security`
3. Clique em `New Access Token`
4. Copie o token gerado

### **SSH Key:**
1. Gere uma chave SSH: `ssh-keygen -t rsa -b 4096`
2. Adicione a chave pública no servidor: `~/.ssh/authorized_keys`
3. Copie a chave privada para o secret

## ✅ Benefícios da Nova Configuração

- **Build mais rápido**: Feito na GitHub Actions (máquinas mais potentes)
- **Deploy mais confiável**: Imagem pré-construída e testada
- **Rollback fácil**: Tags com SHA do commit
- **Cache otimizado**: Dependências cacheadas entre builds
- **Timeout reduzido**: De 45min para 30min
- **Build local**: Sem dependência de recursos do servidor
