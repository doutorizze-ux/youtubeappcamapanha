# 🚀 DEPLOY RÁPIDO - 3 PASSOS

## ✅ PASSO 1: GitHub

```bash
# No terminal, na pasta do projeto:
git init
git add .
git commit -m "Initial commit"

# Crie um repositório no GitHub e depois:
git remote add origin https://github.com/SEU_USUARIO/campaign-validator.git
git branch -M main
git push -u origin main
```

---

## ✅ PASSO 2: Render (Backend)

1. **Acesse:** https://render.com
2. **Login** com GitHub
3. **New +** → **Web Service**
4. **Conecte** seu repositório
5. **Configure:**
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`
6. **Adicione variáveis:**
   ```
   JWT_SECRET=seu_secret_aqui
   YOUTUBE_API_KEY=sua_chave
   SPOTIFY_CLIENT_ID=seu_id
   SPOTIFY_CLIENT_SECRET=seu_secret
   ```
7. **New +** → **PostgreSQL** (mesma região)
8. **Conecte database** ao Web Service
9. **Create Web Service**

**Aguarde 5-10min** → Sua API estará em: `https://seu-app.onrender.com`

---

## ✅ PASSO 3: Hospedagem (Frontend)

```bash
# 1. Atualizar .env
cd frontend
echo VITE_API_URL=https://seu-app.onrender.com/api > .env

# 2. Build
npm run build

# 3. Upload via FTP
# Envie TODOS os arquivos da pasta dist/ para public_html/
```

**Pronto!** Acesse `https://seusite.com.br`

---

## 🆘 Problemas?

- **API não responde:** Aguarde 1-2min (Render free tier dorme)
- **CORS Error:** Adicione seu domínio no backend/src/server.js
- **Página em branco:** Verifique se .htaccess foi enviado

---

**Guia completo:** Veja `DEPLOY.md`
