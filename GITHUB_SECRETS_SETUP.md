# 🔐 CONFIGURAÇÃO DE SECRETS DO GITHUB ACTIONS

Para que o workflow de deploy automático funcione 100%, você precisa configurar os secrets no GitHub.

## 🔑 SECRETS NECESSÁRIOS

### 1. Acessar Configurações do Repositório
```
https://github.com/bcordeirodev/linkchart-frontend/settings/secrets/actions
```

### 2. Adicionar os 3 Secrets Obrigatórios

#### PRODUCTION_HOST
```
Nome: PRODUCTION_HOST
Valor: 134.209.33.182
```

#### PRODUCTION_USER
```
Nome: PRODUCTION_USER
Valor: root
```

#### PRODUCTION_SSH_KEY
```
Nome: PRODUCTION_SSH_KEY
Valor: [CHAVE SSH PRIVADA - veja abaixo como obter]
```

## 🔐 COMO OBTER A CHAVE SSH PRIVADA

Execute este comando no servidor para ver a chave privada:

```bash
ssh root@134.209.33.182 "cat ~/.ssh/id_rsa"
```

**⚠️ IMPORTANTE**: Copie TODO o conteúdo, incluindo:
- `-----BEGIN OPENSSH PRIVATE KEY-----`
- Todo o conteúdo do meio
- `-----END OPENSSH PRIVATE KEY-----`

## 🧪 TESTAR O WORKFLOW

Após configurar os secrets, o workflow será executado automaticamente a cada:
- ✅ Push para branch `main`
- ✅ Pull Request merged
- ✅ Dispatch manual

### Verificar Execução
1. Acesse: `https://github.com/bcordeirodev/linkchart-frontend/actions`
2. Veja o workflow "🚀 Deploy to Production"
3. Acompanhe os logs em tempo real

## 📊 O QUE O WORKFLOW FAZ

### 1. 🧪 Quality Checks
- ✅ TypeScript validation
- ✅ ESLint checks  
- ✅ Build test
- ✅ Security audit

### 2. 🐳 Docker Build
- ✅ Build da imagem
- ✅ Push para registry
- ✅ Vulnerability scan

### 3. 🚀 Deploy Automático
- ✅ SSH para servidor
- ✅ Git pull da versão mais recente
- ✅ Backup automático
- ✅ Build da nova imagem
- ✅ Deploy com zero-downtime
- ✅ Health check automático
- ✅ Rollback se falhar

## 🔍 MONITORAMENTO

### URLs para Verificar
- **Aplicação**: http://134.209.33.182:3000
- **Health Check**: http://134.209.33.182:3000/health
- **GitHub Actions**: https://github.com/bcordeirodev/linkchart-frontend/actions

### Logs no Servidor
```bash
# Logs da aplicação
ssh root@134.209.33.182 "cd /var/www/linkchart-frontend && docker compose -f docker-compose.prod.yml logs -f"

# Status dos containers
ssh root@134.209.33.182 "cd /var/www/linkchart-frontend && docker compose -f docker-compose.prod.yml ps"
```

## ⚡ TESTE RÁPIDO

Para testar se tudo está funcionando:

1. **Faça uma pequena alteração** no código (ex: README.md)
2. **Commit e push** para main
3. **Acompanhe** o workflow no GitHub Actions
4. **Verifique** se a aplicação foi atualizada em http://134.209.33.182:3000

## 🎯 CHECKLIST FINAL

- [ ] Secrets configurados no GitHub
- [ ] SSH key funcionando
- [ ] Primeira execução do workflow bem-sucedida
- [ ] Aplicação acessível em http://134.209.33.182:3000
- [ ] Health check respondendo
- [ ] Deploy automático testado

---

**🎉 Após configurar os secrets, o deploy será 100% automático!**

**Qualquer push para `main` irá automaticamente atualizar a aplicação em produção! 🚀**
