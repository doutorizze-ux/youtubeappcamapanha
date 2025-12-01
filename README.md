# 🎵 New Music - Sistema de Validação de Campanhas Musicais

Sistema completo para validação automática de campanhas de marketing musical no YouTube e Spotify.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Deploy](#deploy)

## 🎯 Visão Geral

O New Music é uma plataforma que permite:
- Cadastrar campanhas de marketing musical
- Conectar com APIs do YouTube e Spotify
- Validar automaticamente se metas de views/plays foram atingidas
- Visualizar progresso em tempo real com gráficos
- Gerar relatórios de desempenho

## ✨ Funcionalidades

### Gestão de Campanhas
- ✅ Cadastro de campanhas com meta de visualizações/reproduções
- ✅ Suporte para YouTube e Spotify
- ✅ Definição de período e fornecedor responsável
- ✅ Validação manual e automática (a cada 12h)

### Dashboard Analítico
- 📊 Estatísticas gerais (total, atingidas, pendentes)
- 📈 Gráficos de progresso e evolução
- 🔍 Filtros por status, plataforma e fornecedor
- 📱 Design responsivo e moderno

### Autenticação
- 🔐 Login e registro de usuários
- 👥 Perfis: Administrador e Gestor de Campanha
- 🔑 JWT para autenticação segura

### Automação
- ⏰ Validação automática via cron job (12h)
- 🔄 Histórico de validações
- 📧 Preparado para notificações (email/WhatsApp)

## 🛠 Tecnologias

### Backend
- **Node.js** + **Express** - API REST
- **Prisma ORM** - Gerenciamento de banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação
- **Bcrypt** - Criptografia de senhas
- **Axios** - Requisições HTTP
- **Node-Cron** - Agendamento de tarefas

### Frontend
- **React** + **Vite** - Interface moderna
- **React Router** - Navegação
- **Recharts** - Gráficos interativos
- **Axios** - Comunicação com API
- **CSS Moderno** - Design system customizado

### APIs Externas
- **YouTube Data API v3** - Estatísticas de vídeos
- **Spotify Web API** - Dados de músicas/álbuns

## 🏗 Arquitetura

```
youtubeappcamapanha/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Modelo de dados
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Configuração Prisma
│   │   ├── controllers/
│   │   │   ├── authController.js  # Autenticação
│   │   │   └── campaignController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── campaignRoutes.js
│   │   ├── services/
│   │   │   ├── youtubeService.js  # Integração YouTube
│   │   │   ├── spotifyService.js  # Integração Spotify
│   │   │   └── validationService.js
│   │   └── server.js              # Entry point
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx          # Tela de login
    │   │   ├── Dashboard.jsx      # Dashboard principal
    │   │   ├── CampaignForm.jsx   # Formulário de campanha
    │   │   └── CampaignDetails.jsx
    │   ├── services/
    │   │   └── api.js             # Cliente API
    │   ├── App.jsx
    │   └── index.css              # Design system
    ├── .env
    └── package.json
```

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Contas de desenvolvedor: YouTube API e Spotify API

### 1. Clone o repositório
```bash
cd c:\Users\User\Desktop\youtubeappcamapanha
```

### 2. Instale as dependências do backend
```bash
cd backend
npm install
```

### 3. Instale as dependências do frontend
```bash
cd ../frontend
npm install
```

## ⚙️ Configuração

### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/campaign_db?schema=public"
JWT_SECRET="seu_secret_jwt_aqui"
PORT=3001
YOUTUBE_API_KEY="sua_chave_youtube_api"
SPOTIFY_CLIENT_ID="seu_client_id_spotify"
SPOTIFY_CLIENT_SECRET="seu_client_secret_spotify"
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api
```

### Configurar Banco de Dados

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### Obter Credenciais das APIs

#### YouTube Data API v3
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Ative a "YouTube Data API v3"
4. Crie credenciais (API Key)
5. Copie a chave para o `.env`

#### Spotify Web API
1. Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crie um novo app
3. Copie Client ID e Client Secret
4. Cole no `.env`

## 🚀 Uso

### Desenvolvimento

#### Iniciar Backend
```bash
cd backend
npm run dev
```
Servidor rodando em: `http://localhost:3001`

#### Iniciar Frontend
```bash
cd frontend
npm run dev
```
Interface disponível em: `http://localhost:5173`

### Produção

#### Build do Frontend
```bash
cd frontend
npm run build
```

#### Iniciar Backend em Produção
```bash
cd backend
npm start
```

## 📡 API Endpoints

### Autenticação

#### POST /api/auth/register
Registrar novo usuário
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "role": "manager"
}
```

#### POST /api/auth/login
Fazer login
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

### Campanhas

#### GET /api/campaigns
Listar todas as campanhas
```
Headers: Authorization: Bearer {token}
```

#### GET /api/campaigns/:id
Obter detalhes de uma campanha

#### POST /api/campaigns
Criar nova campanha
```json
{
  "name": "Lançamento Single - Artista X",
  "platform": "youtube",
  "url": "https://www.youtube.com/watch?v=...",
  "targetValue": 1000000,
  "provider": "Fornecedor A",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "userId": 1
}
```

#### POST /api/campaigns/:id/validate
Validar campanha manualmente

## 🗄️ Modelo de Dados

### User
- id (Int, PK)
- name (String)
- email (String, unique)
- password (String, hashed)
- role (String: "admin" | "manager")
- createdAt (DateTime)

### Campaign
- id (Int, PK)
- name (String)
- platform (String: "youtube" | "spotify")
- url (String)
- targetValue (Int)
- currentValue (Int)
- provider (String)
- status (String: "pending" | "achieved")
- startDate (DateTime)
- endDate (DateTime)
- userId (Int, FK)
- createdAt (DateTime)

### ValidationHistory
- id (Int, PK)
- campaignId (Int, FK)
- value (Int)
- checkedAt (DateTime)

## 🌐 Deploy

### Backend

#### Opções de Hospedagem
- **Render** (Recomendado)
- **Railway**
- **Heroku**
- **AWS EC2**

#### Passos (Render)
1. Crie conta no [Render](https://render.com)
2. Conecte seu repositório GitHub
3. Crie um Web Service
4. Configure variáveis de ambiente
5. Adicione PostgreSQL database
6. Deploy automático

### Frontend

#### Opções de Hospedagem
- **Vercel** (Recomendado)
- **Netlify**
- **Hostinger**

#### Passos (Vercel)
1. Crie conta no [Vercel](https://vercel.com)
2. Importe projeto do GitHub
3. Configure `VITE_API_URL` para URL do backend
4. Deploy automático

## 🎨 Design

O sistema utiliza um design moderno com:
- **Tema Dark** com gradientes vibrantes
- **Paleta de cores**: Roxo (#667eea), Rosa (#f093fb), Azul (#4facfe)
- **Tipografia**: Inter (Google Fonts)
- **Animações** suaves e micro-interações
- **Glassmorphism** e efeitos de blur
- **Responsivo** para mobile e desktop

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Autenticação JWT
- ✅ Validação de inputs
- ✅ CORS configurado
- ✅ Variáveis de ambiente para secrets

## 📝 Notas Importantes

### Limitações da API do Spotify
A API pública do Spotify **não fornece contagem exata de reproduções**. O sistema usa o campo `popularity` (0-100) como proxy, multiplicado por 1000 para simular contagem. Para dados reais de reproduções, seria necessário:
- Acesso como artista verificado
- Spotify for Artists API
- Ou scraping (não recomendado)

### Validação Automática
O cron job roda a cada 12 horas. Para alterar:
```javascript
// backend/src/server.js
cron.schedule('0 */12 * * *', async () => { // Altere aqui
  await validateAllCampaigns();
});
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👨‍💻 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento

---

Desenvolvido com ❤️ para validação de campanhas musicais
