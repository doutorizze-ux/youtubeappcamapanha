# 🏗️ ARQUITETURA DO SISTEMA - New Music

## 📊 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Login     │  │  Dashboard   │  │   Campaign   │          │
│  │              │  │              │  │    Details   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                           │                                      │
│                    ┌──────▼──────┐                              │
│                    │   API Client │                              │
│                    │   (Axios)    │                              │
│                    └──────┬──────┘                              │
└───────────────────────────┼─────────────────────────────────────┘
                            │ HTTP/REST
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      BACKEND (Node.js/Express)                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                        Routes                            │   │
│  │  /api/auth/*          /api/campaigns/*                   │   │
│  └────────┬──────────────────────┬──────────────────────────┘   │
│           │                      │                               │
│  ┌────────▼────────┐    ┌───────▼────────┐                     │
│  │  Auth Controller │    │ Campaign Ctrl  │                     │
│  └────────┬─────────┘    └───────┬────────┘                     │
│           │                      │                               │
│           │         ┌────────────▼────────────┐                 │
│           │         │  Validation Service     │                 │
│           │         │  ┌──────────────────┐   │                 │
│           │         │  │  YouTube Service │   │                 │
│           │         │  └──────────────────┘   │                 │
│           │         │  ┌──────────────────┐   │                 │
│           │         │  │  Spotify Service │   │                 │
│           │         │  └──────────────────┘   │                 │
│           │         └─────────────────────────┘                 │
│           │                      │                               │
│  ┌────────▼──────────────────────▼────────┐                     │
│  │          Prisma ORM (Database Layer)    │                     │
│  └────────────────────┬────────────────────┘                     │
└───────────────────────┼──────────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────────┐
│                    PostgreSQL Database                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐              │
│  │   User   │  │ Campaign │  │ ValidationHistory │              │
│  └──────────┘  └──────────┘  └──────────────────┘              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      External APIs                                │
│  ┌─────────────────────┐    ┌──────────────────────┐            │
│  │  YouTube Data API   │    │   Spotify Web API    │            │
│  │        v3           │    │                      │            │
│  └─────────────────────┘    └──────────────────────┘            │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      Automation Layer                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Node-Cron (Every 12 hours)                              │   │
│  │  → Validates all pending campaigns                       │   │
│  │  → Updates current values                                │   │
│  │  → Creates validation history records                    │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Dados

### 1. Cadastro de Campanha
```
User → Frontend Form → POST /api/campaigns → Campaign Controller
  → Prisma → PostgreSQL → Response → Frontend → Dashboard Update
```

### 2. Validação Manual
```
User → Click "Validar" → POST /api/campaigns/:id/validate
  → Validation Service → YouTube/Spotify API → Get Stats
  → Update Campaign (currentValue, status) → Create ValidationHistory
  → Response → Frontend → UI Update
```

### 3. Validação Automática (Cron)
```
Every 12h → Cron Job Triggers → validateAllCampaigns()
  → For each pending campaign:
    → Fetch stats from YouTube/Spotify
    → Update campaign
    → Create history record
  → (Optional) Send notifications
```

### 4. Autenticação
```
User → Login Form → POST /api/auth/login → Auth Controller
  → Find user → Compare password (bcrypt) → Generate JWT
  → Response with token → Store in localStorage
  → All subsequent requests include: Authorization: Bearer {token}
```

## 📁 Estrutura de Pastas Detalhada

```
youtubeappcamapanha/
│
├── backend/
│   ├── node_modules/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── migrations/            # Database migrations
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Prisma client instance
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js  # Login, Register
│   │   │   └── campaignController.js # CRUD operations
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # /api/auth/*
│   │   │   └── campaignRoutes.js  # /api/campaigns/*
│   │   │
│   │   ├── services/
│   │   │   ├── youtubeService.js  # YouTube API integration
│   │   │   ├── spotifyService.js  # Spotify API integration
│   │   │   └── validationService.js # Validation logic
│   │   │
│   │   └── server.js              # Express app + Cron setup
│   │
│   ├── .env                       # Environment variables
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login/Register page
│   │   │   ├── Login.css
│   │   │   ├── Dashboard.jsx      # Main dashboard
│   │   │   ├── Dashboard.css
│   │   │   ├── CampaignForm.jsx   # Create campaign
│   │   │   ├── CampaignForm.css
│   │   │   ├── CampaignDetails.jsx # Campaign details
│   │   │   └── CampaignDetails.css
│   │   │
│   │   ├── services/
│   │   │   └── api.js             # Axios configuration
│   │   │
│   │   ├── App.jsx                # Router setup
│   │   ├── index.css              # Global styles
│   │   └── main.jsx               # Entry point
│   │
│   ├── .env                       # Frontend env vars
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md                      # Documentation
```

## 🗃️ Modelo de Dados (ERD)

```
┌─────────────────────────┐
│         User            │
├─────────────────────────┤
│ id (PK)                 │
│ name                    │
│ email (UNIQUE)          │
│ password (HASHED)       │
│ role                    │
│ createdAt               │
└────────┬────────────────┘
         │
         │ 1:N
         │
┌────────▼────────────────┐         ┌──────────────────────────┐
│      Campaign           │         │   ValidationHistory      │
├─────────────────────────┤         ├──────────────────────────┤
│ id (PK)                 │◄────────┤ id (PK)                  │
│ name                    │   1:N   │ campaignId (FK)          │
│ platform                │         │ value                    │
│ url                     │         │ checkedAt                │
│ targetValue             │         └──────────────────────────┘
│ currentValue            │
│ provider                │
│ status                  │
│ startDate               │
│ endDate                 │
│ userId (FK)             │
│ createdAt               │
└─────────────────────────┘
```

## 🔌 Endpoints da API

### Authentication Endpoints

| Method | Endpoint           | Description        | Auth Required |
|--------|--------------------|--------------------|---------------|
| POST   | /api/auth/register | Create new user    | No            |
| POST   | /api/auth/login    | Login user         | No            |

### Campaign Endpoints

| Method | Endpoint                    | Description              | Auth Required |
|--------|-----------------------------|--------------------------|---------------|
| GET    | /api/campaigns              | List all campaigns       | Yes           |
| GET    | /api/campaigns/:id          | Get campaign by ID       | Yes           |
| POST   | /api/campaigns              | Create new campaign      | Yes           |
| POST   | /api/campaigns/:id/validate | Manually validate        | Yes           |

## 🎨 Design System

### Color Palette
```css
Primary Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Secondary Gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)
Success Gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)

Background Primary: #0f0f23
Background Secondary: #1a1a2e
Background Tertiary: #16213e

Text Primary: #ffffff
Text Secondary: #b8b8d1
Text Muted: #6b6b8c
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Spacing Scale
- Small: 8px
- Medium: 16px
- Large: 24px
- XL: 32px

### Border Radius
- Small: 8px
- Medium: 12px
- Large: 16px
- XL: 24px

## 🔐 Segurança

### Autenticação
- **JWT** com expiração de 1 dia
- **Bcrypt** para hash de senhas (salt rounds: 10)
- Token armazenado em `localStorage`
- Middleware de autenticação em rotas protegidas

### Validação
- Validação de inputs no frontend e backend
- Sanitização de URLs
- Proteção contra SQL injection (via Prisma)

### CORS
- Configurado para aceitar requisições do frontend
- Headers apropriados configurados

## 📊 Métricas e Monitoramento

### Dados Coletados
- Total de campanhas
- Campanhas atingidas vs pendentes
- Distribuição por plataforma
- Histórico de validações
- Progresso em tempo real

### Relatórios
- Progresso individual de campanha
- Evolução histórica (gráfico de linha)
- Comparação meta vs atual (gráfico de barras)
- Exportação de dados (copy to clipboard)

## 🚀 Performance

### Frontend
- Code splitting com React Router
- Lazy loading de componentes
- Otimização de re-renders
- CSS modular

### Backend
- Conexão pool do Prisma
- Queries otimizadas
- Caching potencial (Redis - futuro)
- Rate limiting (futuro)

## 🔄 Ciclo de Vida da Campanha

```
1. CRIAÇÃO
   ↓
2. PENDENTE (status: "pending")
   ↓
3. VALIDAÇÃO PERIÓDICA
   ├─ currentValue < targetValue → Continua PENDENTE
   └─ currentValue >= targetValue → ATINGIDA
   ↓
4. ATINGIDA (status: "achieved")
   ↓
5. HISTÓRICO MANTIDO
```

## 🧪 Testes (Futuro)

### Backend
- Unit tests (Jest)
- Integration tests
- API endpoint tests

### Frontend
- Component tests (React Testing Library)
- E2E tests (Playwright/Cypress)

## 📈 Roadmap Futuro

- [ ] Notificações por email (Nodemailer)
- [ ] Notificações por WhatsApp (Twilio)
- [ ] Exportação de relatórios em PDF
- [ ] Exportação de relatórios em Excel
- [ ] Dashboard com mais métricas
- [ ] Suporte para mais plataformas (TikTok, Instagram)
- [ ] Sistema de permissões mais granular
- [ ] API de webhooks
- [ ] Testes automatizados
- [ ] CI/CD pipeline

---

**Última atualização**: Dezembro 2024
