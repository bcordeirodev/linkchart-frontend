# 🔐 CONFIGURAÇÃO DE SECRETS NO GITHUB

## Acesse: Settings → Secrets and variables → Actions → New repository secret

### 1. SSH_PRIVATE_KEY

```
Valor: Conteúdo da sua chave SSH privada (~/.ssh/id_rsa)
```

### 2. SSH_HOST

```
Valor: 134.209.33.182
```

### 3. SSH_USER

```
Valor: deploy
```

### 4. DEPLOY_PATH

```
Valor: /var/www/linkchart-frontend
```

## Como obter a chave SSH:

```bash
cat ~/.ssh/id_rsa
```

Copie todo o conteúdo (incluindo -----BEGIN e -----END)
