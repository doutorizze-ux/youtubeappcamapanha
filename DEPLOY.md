# 🚀 GUIA DE DEPLOY - Render + Hospedagem Compartilhada

## 📋 PRÉ-REQUISITOS

- Conta no GitHub (gratuita)
- Conta no Render (gratuita)
- Hospedagem compartilhada com FTP/cPanel

---

## PARTE 1: PREPARAR O CÓDIGO

### 1. Criar Repositório no GitHub

```bash
# Inicializar Git
git init
git add .
git commit -m "Initial commit - Campaign Validator"

# Criar repositório no GitHub e conectar
git remote add origin https://github.com/SEU_USUARIO/campaign-validator.git
git branch -M main
git push -u origin main
```

---

## PARTE 2: DEPLOY DO BACKEND NO RENDER

### 1. Criar Conta no Render
- Acesse: https://render.com
- Clique em "Get Started"
- Faça login com GitHub

### 2. Criar Novo Web Service
1. No Dashboard, clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório GitHub
4. Selecione o repositório `campaign-validator`

### 3. Configurar o Web Service

**Build & Deploy:**
- **Name:** `campaign-validator-api`
- **Region:** Oregon (US West)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** Node
- **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
- **Start Command:** `npm start`

**Environment:**
- **Plan:** Free

### 4. Adicionar Variáveis de Ambiente

Clique em "Advanced" e adicione:

```
NODE_VERSION=18.17.0
JWT_SECRET=seu_secret_jwt_super_seguro_aqui
YOUTUBE_API_KEY=sua_chave_youtube_api
SPOTIFY_CLIENT_ID=seu_spotify_client_id
SPOTIFY_CLIENT_SECRET=seu_spotify_client_secret
```

⚠️ **NÃO adicione DATABASE_URL** - O Render vai criar automaticamente!

### 5. Criar PostgreSQL Database

1. No Dashboard do Render, clique em "New +"
2. Selecione "PostgreSQL"
3. Configure:
   - **Name:** `campaign-validator-db`
   - **Database:** `campaign_validator`
   - **User:** (deixe padrão)
   - **Region:** Oregon (mesma do backend)
   - **Plan:** Free
4. Clique em "Create Database"

### 6. Conectar Database ao Web Service

1. Volte para o Web Service
2. Em "Environment", clique em "Add Environment Variable"
3. Adicione:
   - **Key:** `DATABASE_URL`
   - **Value:** Clique em "From Database" → Selecione `campaign-validator-db` → `Internal Database URL`

### 7. Deploy!

1. Clique em "Create Web Service"
2. Aguarde o build (5-10 minutos)
3. Quando aparecer "Live", sua API está no ar! 🎉

**URL da API:** `https://campaign-validator-api.onrender.com`

---

## PARTE 3: DEPLOY DO FRONTEND NA HOSPEDAGEM COMPARTILHADA

### 1. Build do Frontend

No seu computador:

```bash
cd frontend

# Atualizar .env com URL do Render
echo VITE_API_URL=https://campaign-validator-api.onrender.com/api > .env

# Build
npm run build
```

Isso cria a pasta `dist/` com todos os arquivos.

### 2. Criar arquivo .htaccess

Crie o arquivo `frontend/dist/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Habilitar CORS
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
</IfModule>

# Compressão
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 3. Upload via FTP

**Opção A: FileZilla**
1. Baixe FileZilla
2. Conecte com dados da hospedagem
3. Navegue até `public_html/` (ou `www/`)
4. Faça upload de TODOS os arquivos da pasta `dist/`

**Opção B: cPanel File Manager**
1. Acesse cPanel da hospedagem
2. Abra "File Manager"
3. Vá para `public_html/`
4. Clique em "Upload"
5. Selecione todos os arquivos da pasta `dist/`
6. Aguarde upload completar

### 4. Configurar CORS no Backend

Adicione no `backend/src/server.js`:

```javascript
app.use(cors({
  origin: ['https://seusite.com.br', 'http://localhost:5173'],
  credentials: true
}));
```

Faça commit e push para atualizar no Render.

---

## ✅ CHECKLIST FINAL

### Backend (Render)
- [ ] Repositório no GitHub criado
- [ ] Web Service criado no Render
- [ ] PostgreSQL Database criado
- [ ] Variáveis de ambiente configuradas
- [ ] Build completado com sucesso
- [ ] API respondendo (teste: `https://sua-api.onrender.com`)

### Frontend (Hospedagem)
- [ ] Build gerado (`npm run build`)
- [ ] `.htaccess` criado
- [ ] Arquivos enviados via FTP
- [ ] Site acessível no navegador
- [ ] Login funcionando
- [ ] Campanhas sendo criadas

---

## 🧪 TESTAR O SISTEMA

### 1. Testar API
```bash
curl https://campaign-validator-api.onrender.com
```

Deve retornar: "Campaign Validator API is running"

### 2. Testar Frontend
1. Acesse: `https://seusite.com.br`
2. Faça login/registro
3. Crie uma campanha
4. Valide a campanha

---

## ⚠️ PROBLEMAS COMUNS

### "API não responde"
- Aguarde 1-2 minutos (Render free tier dorme após inatividade)
- Verifique logs no Dashboard do Render

### "CORS Error"
- Adicione seu domínio no CORS do backend
- Faça novo deploy

### "Database connection failed"
- Verifique se DATABASE_URL está configurada
- Confirme que database e web service estão na mesma região

### "Frontend mostra página em branco"
- Verifique se `.htaccess` foi enviado
- Confirme que `VITE_API_URL` está correto no build

---

## 📊 MONITORAMENTO

### Logs do Backend (Render)
1. Acesse Dashboard do Render
2. Clique no Web Service
3. Vá em "Logs"

### Métricas
- Render mostra uso de CPU, memória e requests
- Free tier: 750 horas/mês

---

## 🔄 ATUALIZAR O SISTEMA

### Backend
```bash
git add .
git commit -m "Update backend"
git push
```
Render faz deploy automático!

### Frontend
```bash
cd frontend
npm run build
# Upload novamente via FTP
```

---

## 💰 CUSTOS

- **Render (Backend + Database):** GRÁTIS
- **Hospedagem Compartilhada:** R$ 10-30/mês
- **Total:** R$ 10-30/mês

---

## 🎉 PRONTO!

Seu sistema está no ar em:
- **API:** `https://campaign-validator-api.onrender.com`
- **Frontend:** `https://seusite.com.br`

**Próximos passos:**
1. Configurar domínio personalizado
2. Adicionar SSL (HTTPS) - Render já inclui!
3. Monitorar uso e performance
4. Adicionar mais funcionalidades

---

**Precisa de ajuda? Consulte:**
- Render Docs: https://render.com/docs
- Prisma Docs: https://www.prisma.io/docs

**Boa sorte! 🚀**
