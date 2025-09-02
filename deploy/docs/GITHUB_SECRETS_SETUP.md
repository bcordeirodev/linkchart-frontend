# 🔐 CONFIGURAÇÃO DE SECRETS DO GITHUB ACTIONS

Guia completo para configurar os secrets necessários para deploy automático.

## 📋 SECRETS NECESSÁRIOS

Acesse: [GitHub Secrets](https://github.com/bcordeirodev/linkchart-frontend/settings/secrets/actions)

Configure estes **3 secrets obrigatórios**:

### 1️⃣ `PRODUCTION_HOST`
```
Valor: 134.209.33.182
```

### 2️⃣ `PRODUCTION_USER`
```
Valor: root
```

### 3️⃣ `PRODUCTION_SSH_KEY`
```
Valor: [chave SSH privada - ver abaixo]
```

---

## 🔑 CONFIGURAÇÃO SSH

### **Chave SSH Atual (Copie EXATAMENTE)**

```
-----BEGIN OPENSSH PRIVATE KEY-----
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
-----END OPENSSH PRIVATE KEY-----
```

---

## ⚠️ IMPORTANTE

### ✅ **Ao Configurar a Chave SSH:**
- ✅ Copie **EXATAMENTE** como está acima
- ✅ Inclua as linhas `-----BEGIN` e `-----END`
- ✅ Não adicione espaços ou quebras extras
- ✅ Cole no GitHub Secrets como texto puro

### ❌ **Não Faça:**
- ❌ Não modifique o formato da chave
- ❌ Não remova as linhas BEGIN/END
- ❌ Não adicione comentários ou espaços
- ❌ Não compartilhe a chave privada

---

## 🧪 TESTE DE CONFIGURAÇÃO

### **1. Configurar os 3 Secrets no GitHub**
1. Acesse: https://github.com/bcordeirodev/linkchart-frontend/settings/secrets/actions
2. Clique em "New repository secret"
3. Configure cada um dos 3 secrets listados acima

### **2. Testar Deploy Automático**
```bash
# Fazer um pequeno commit para testar
echo "test deploy" >> README.md
git add .
git commit -m "test: trigger automatic deploy"
git push origin main
```

### **3. Monitorar Workflow**
1. Acesse: https://github.com/bcordeirodev/linkchart-frontend/actions
2. Clique no último workflow executado
3. Acompanhe os logs em tempo real

### **4. Verificar Deploy**
```bash
# Testar aplicação
curl -f http://134.209.33.182:3000/health
curl -f http://134.209.33.182:3000/

# Se falhar, verificar logs no servidor
ssh root@134.209.33.182 'cd /var/www/linkchart-frontend && docker compose -f deploy/docker-compose.prod.yml logs'
```

---

## 🔧 RESOLUÇÃO DE PROBLEMAS

### ❌ **Erro: "Permission denied (publickey)"**
**Solução**: Verificar se a chave SSH está correta no GitHub Secrets

### ❌ **Erro: "Host key verification failed"**
**Solução**: O workflow já inclui `-o StrictHostKeyChecking=no`

### ❌ **Erro: "Connection refused"**
**Solução**: Verificar se o servidor está acessível e o SSH está rodando

### ❌ **Erro: "docker: command not found"**
**Solução**: Executar o script de setup no servidor primeiro

---

## 📋 CHECKLIST FINAL

Antes de fazer o primeiro deploy automático:

- [ ] ✅ 3 secrets configurados no GitHub
- [ ] ✅ Servidor configurado com Docker
- [ ] ✅ SSH funcionando (teste manual)
- [ ] ✅ Repositório clonado no servidor
- [ ] ✅ Arquivo `.env.production` configurado
- [ ] ✅ Porta 3000 liberada no firewall

**Após configurar tudo, qualquer push para `main` irá automaticamente atualizar a aplicação!**

---

## 🎯 RESULTADO ESPERADO

Após configurar corretamente:

1. **Push para main** → Workflow inicia automaticamente
2. **Quality checks** → TypeScript, build, security
3. **Deploy** → SSH, git pull, docker build, restart
4. **Validation** → Health checks automáticos
5. **Notificação** → Sucesso/falha no GitHub

**🌐 Aplicação estará disponível em**: http://134.209.33.182:3000
