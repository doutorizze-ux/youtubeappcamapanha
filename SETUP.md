# 🚀 GUIA DE SETUP RÁPIDO

## ⚡ Instalação Rápida (5 minutos)

### 1️⃣ Instalar Dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2️⃣ Configurar Banco de Dados

**Instalar PostgreSQL:**
- Windows: https://www.postgresql.org/download/windows/
- Ou usar Docker: `docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`

**Criar banco de dados:**
```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar database
CREATE DATABASE campaign_db;
\q
```

**Configurar .env do backend:**
```bash
cd backend
# Edite o arquivo .env com suas credenciais
```

**Executar migrations:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 3️⃣ Obter API Keys

#### YouTube API Key
1. Acesse: https://console.cloud.google.com/
2. Criar projeto → APIs & Services → Enable APIs
3. Buscar "YouTube Data API v3" → Enable
4. Credentials → Create Credentials → API Key
5. Copiar a chave para `.env`

#### Spotify API
1. Acesse: https://developer.spotify.com/dashboard
2. Create App
3. Copiar Client ID e Client Secret para `.env`

### 4️⃣ Iniciar Aplicação

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5️⃣ Acessar Sistema

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

**Primeiro acesso:**
1. Clique em "Registre-se"
2. Crie uma conta
3. Faça login
4. Crie sua primeira campanha!

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"
- Verifique se PostgreSQL está rodando
- Confirme credenciais no `.env`
- Teste conexão: `psql -U postgres -d campaign_db`

### Erro: "YouTube API quota exceeded"
- YouTube API tem limite diário gratuito
- Aguarde reset (meia-noite PST)
- Ou crie novo projeto no Google Cloud

### Erro: "Port already in use"
- Backend (3001): `netstat -ano | findstr :3001` → `taskkill /PID <PID> /F`
- Frontend (5173): Altere em `vite.config.js`

### Erro: "Prisma Client not generated"
```bash
cd backend
npx prisma generate
```

---

## 📝 Checklist de Setup

- [ ] Node.js instalado (v18+)
- [ ] PostgreSQL instalado e rodando
- [ ] Database `campaign_db` criado
- [ ] Backend `.env` configurado
- [ ] Frontend `.env` configurado
- [ ] YouTube API Key obtida
- [ ] Spotify Client ID/Secret obtidos
- [ ] Migrations executadas
- [ ] Backend rodando (porta 3001)
- [ ] Frontend rodando (porta 5173)
- [ ] Conta de usuário criada
- [ ] Primeira campanha testada

---

## 🎯 Próximos Passos

1. **Criar campanhas de teste** com URLs reais
2. **Testar validação manual** clicando em "Validar"
3. **Explorar dashboard** e gráficos
4. **Aguardar validação automática** (12h)
5. **Preparar para deploy** (ver README.md)

---

## 💡 Dicas

- Use URLs reais do YouTube/Spotify para testes
- Metas pequenas (ex: 1000 views) facilitam testes
- Validação automática roda a cada 12h
- Histórico de validações aparece após primeira validação
- Gráficos aparecem após ter dados

---

**Precisa de ajuda?** Consulte o README.md completo ou ARCHITECTURE.md
