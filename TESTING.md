# 🧪 GUIA DE TESTES - New Music

## 📋 Checklist de Testes

Use este guia para testar todas as funcionalidades do sistema.

---

## 🚀 Pré-requisitos

- [ ] PostgreSQL instalado e rodando
- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (backend e frontend)
- [ ] Banco de dados criado e migrations executadas
- [ ] YouTube API Key configurada no .env
- [ ] Spotify Client ID/Secret configurados no .env
- [ ] Backend rodando na porta 3001
- [ ] Frontend rodando na porta 5173

---

## 1️⃣ Testes de Autenticação

### Registro de Usuário

**Passos:**
1. Acesse http://localhost:5173
2. Clique em "Não tem conta? Registre-se"
3. Preencha:
   - Nome: "João Silva"
   - Email: "joao@test.com"
   - Senha: "senha123"
   - Perfil: "Gestor de Campanha"
4. Clique em "Criar Conta"

**Resultado Esperado:**
- ✅ Mensagem de sucesso
- ✅ Redirecionamento para tela de login
- ✅ Usuário criado no banco de dados

### Login

**Passos:**
1. Na tela de login, preencha:
   - Email: "joao@test.com"
   - Senha: "senha123"
2. Clique em "Entrar"

**Resultado Esperado:**
- ✅ Redirecionamento para dashboard
- ✅ Token JWT armazenado no localStorage
- ✅ Nome do usuário aparece no navbar

### Logout

**Passos:**
1. No dashboard, clique em "Sair"

**Resultado Esperado:**
- ✅ Redirecionamento para tela de login
- ✅ Token removido do localStorage
- ✅ Não consegue acessar /dashboard sem login

---

## 2️⃣ Testes de Campanha - YouTube

### Criar Campanha YouTube

**Passos:**
1. Faça login
2. Clique em "+ Nova Campanha"
3. Preencha:
   - Nome: "Teste YouTube - Never Gonna Give You Up"
   - Plataforma: YouTube
   - URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
   - Meta: 1000000000 (1 bilhão)
   - Fornecedor: "Fornecedor Teste A"
   - Data Início: 01/01/2024
   - Data Fim: 31/12/2024
4. Clique em "Criar Campanha"

**Resultado Esperado:**
- ✅ Redirecionamento para dashboard
- ✅ Campanha aparece na lista
- ✅ Status: "Pendente" (badge amarelo)
- ✅ Plataforma: "▶️ YouTube" (badge vermelho)
- ✅ Progresso: 0%

### Validar Campanha YouTube

**Passos:**
1. Na lista de campanhas, clique em "Validar" na campanha criada
2. Aguarde alguns segundos

**Resultado Esperado:**
- ✅ Valor atual atualizado (deve mostrar ~1.5 bilhão de views)
- ✅ Status muda para "Atingida" (badge verde)
- ✅ Progresso: >100%
- ✅ Registro criado em ValidationHistory

### Ver Detalhes da Campanha

**Passos:**
1. Clique em "Ver Detalhes" na campanha

**Resultado Esperado:**
- ✅ Página de detalhes carrega
- ✅ Informações completas exibidas
- ✅ Barra de progresso grande mostra 100%+
- ✅ Gráfico de evolução aparece (se houver múltiplas validações)
- ✅ Lista de validações mostra histórico
- ✅ Botão "Abrir no YouTube" funciona

---

## 3️⃣ Testes de Campanha - Spotify

### Criar Campanha Spotify

**Passos:**
1. Clique em "+ Nova Campanha"
2. Preencha:
   - Nome: "Teste Spotify - Blinding Lights"
   - Plataforma: Spotify
   - URL: https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b
   - Meta: 50000 (50 mil)
   - Fornecedor: "Fornecedor Teste B"
   - Data Início: 01/01/2024
   - Data Fim: 31/12/2024
3. Clique em "Criar Campanha"

**Resultado Esperado:**
- ✅ Campanha criada
- ✅ Plataforma: "🎧 Spotify" (badge verde)
- ✅ Status: "Pendente"

### Validar Campanha Spotify

**Passos:**
1. Clique em "Validar" na campanha Spotify

**Resultado Esperado:**
- ✅ Valor atual atualizado (baseado em popularity * 1000)
- ✅ Status pode mudar para "Atingida" dependendo da popularidade
- ✅ Histórico de validação criado

**Nota:** Spotify API não fornece plays reais, usa popularity como proxy.

---

## 4️⃣ Testes de Dashboard

### Estatísticas

**Passos:**
1. Acesse o dashboard com pelo menos 2 campanhas criadas

**Resultado Esperado:**
- ✅ Card "Total de Campanhas" mostra número correto
- ✅ Card "Metas Atingidas" mostra campanhas com status "achieved"
- ✅ Card "Pendentes" mostra campanhas com status "pending"
- ✅ Card "YouTube" mostra contagem de campanhas YouTube
- ✅ Card "Spotify" mostra contagem de campanhas Spotify

### Gráfico de Progresso

**Passos:**
1. Observe o gráfico de barras no dashboard

**Resultado Esperado:**
- ✅ Gráfico mostra até 10 campanhas
- ✅ Barras azuis (Meta) e roxas (Atual) aparecem
- ✅ Tooltip funciona ao passar mouse
- ✅ Legendas corretas

### Filtros

**Passos:**
1. Clique em cada botão de filtro:
   - Todas
   - Atingidas
   - Pendentes
   - YouTube
   - Spotify

**Resultado Esperado:**
- ✅ Tabela filtra corretamente
- ✅ Botão ativo fica destacado (roxo)
- ✅ Contadores atualizam

---

## 5️⃣ Testes de Validação Automática

### Cron Job

**Passos:**
1. Deixe o backend rodando
2. Aguarde 12 horas (ou altere o cron para 1 minuto para teste)

**Para testar rapidamente:**
```javascript
// Em backend/src/server.js, altere:
cron.schedule('*/1 * * * *', async () => { // Roda a cada 1 minuto
  console.log('Running automatic campaign validation...');
  await validateAllCampaigns();
});
```

**Resultado Esperado:**
- ✅ Console mostra "Running automatic campaign validation..."
- ✅ Campanhas pendentes são validadas
- ✅ Valores atualizados no banco
- ✅ Histórico criado automaticamente

---

## 6️⃣ Testes de Detalhes da Campanha

### Ações Rápidas

**Passos:**
1. Acesse detalhes de uma campanha
2. Teste cada ação:
   - Clique em "🔄 Validar Agora"
   - Clique em "🔗 Abrir no YouTube/Spotify"
   - Clique em "📋 Copiar Relatório"

**Resultado Esperado:**
- ✅ Validar: Campanha é revalidada, valores atualizam
- ✅ Abrir Link: Nova aba abre com o vídeo/música
- ✅ Copiar: Relatório copiado para clipboard, alert aparece

### Gráfico de Evolução

**Passos:**
1. Valide a mesma campanha múltiplas vezes (3-4 vezes)
2. Acesse os detalhes

**Resultado Esperado:**
- ✅ Gráfico de linha aparece
- ✅ Mostra evolução dos valores ao longo do tempo
- ✅ Tooltip funciona
- ✅ Linha azul conecta os pontos

---

## 7️⃣ Testes de Responsividade

### Mobile

**Passos:**
1. Abra DevTools (F12)
2. Ative modo responsivo
3. Teste com:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)

**Resultado Esperado:**
- ✅ Layout se adapta
- ✅ Cards empilham verticalmente
- ✅ Tabela tem scroll horizontal
- ✅ Botões ficam full-width
- ✅ Navbar se reorganiza
- ✅ Formulário fica em coluna única

---

## 8️⃣ Testes de Erros

### Login com Credenciais Inválidas

**Passos:**
1. Tente fazer login com email/senha errados

**Resultado Esperado:**
- ✅ Mensagem de erro: "Invalid credentials"
- ✅ Não redireciona
- ✅ Campos não são limpos

### Criar Campanha com URL Inválida

**Passos:**
1. Tente criar campanha com URL: "invalid-url"

**Resultado Esperado:**
- ✅ Validação HTML impede submit (required + type="url")

### Acessar Rota Protegida sem Login

**Passos:**
1. Faça logout
2. Tente acessar diretamente: http://localhost:5173/dashboard

**Resultado Esperado:**
- ✅ Redirecionamento automático para /login

---

## 9️⃣ Testes de Performance

### Múltiplas Campanhas

**Passos:**
1. Crie 20+ campanhas
2. Observe o dashboard

**Resultado Esperado:**
- ✅ Página carrega rapidamente (<2s)
- ✅ Gráfico mostra apenas top 10
- ✅ Tabela mostra todas
- ✅ Scroll suave

### Validação em Lote

**Passos:**
1. Com 10+ campanhas pendentes
2. Aguarde validação automática

**Resultado Esperado:**
- ✅ Todas são validadas sequencialmente
- ✅ Sem erros de rate limit (se dentro da quota)
- ✅ Banco atualizado corretamente

---

## 🔟 Testes de Integração API

### YouTube API

**Teste Manual via cURL:**
```bash
curl "https://www.googleapis.com/youtube/v3/videos?part=statistics&id=dQw4w9WgXcQ&key=YOUR_API_KEY"
```

**Resultado Esperado:**
- ✅ JSON com viewCount
- ✅ Valor > 1 bilhão

### Spotify API

**Teste Manual via cURL:**
```bash
# 1. Get Token
curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=YOUR_ID&client_secret=YOUR_SECRET"

# 2. Get Track
curl "https://api.spotify.com/v1/tracks/0VjIjW4GlUZAMYd2vXMi3b" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Resultado Esperado:**
- ✅ Token obtido com sucesso
- ✅ JSON com popularity (0-100)

---

## 📊 Matriz de Testes

| Funcionalidade | Status | Notas |
|----------------|--------|-------|
| Registro | ⬜ | |
| Login | ⬜ | |
| Logout | ⬜ | |
| Criar Campanha YouTube | ⬜ | |
| Criar Campanha Spotify | ⬜ | |
| Validar Manual | ⬜ | |
| Validar Automática | ⬜ | |
| Dashboard Stats | ⬜ | |
| Gráficos | ⬜ | |
| Filtros | ⬜ | |
| Detalhes Campanha | ⬜ | |
| Histórico Validações | ⬜ | |
| Ações Rápidas | ⬜ | |
| Responsividade Mobile | ⬜ | |
| Tratamento de Erros | ⬜ | |

**Legenda:**
- ⬜ Não testado
- ✅ Passou
- ❌ Falhou

---

## 🐛 Reportando Bugs

Se encontrar algum problema, documente:

1. **Descrição:** O que aconteceu?
2. **Passos para Reproduzir:** Como chegar no erro?
3. **Resultado Esperado:** O que deveria acontecer?
4. **Resultado Atual:** O que realmente aconteceu?
5. **Screenshots:** Se aplicável
6. **Console Logs:** Erros no console do navegador
7. **Ambiente:** Browser, OS, versão do Node

---

## ✅ Critérios de Aceitação

O sistema está pronto para produção se:

- ✅ Todos os testes passam
- ✅ Não há erros no console
- ✅ Performance aceitável (<3s para carregar)
- ✅ Responsivo em todos os dispositivos
- ✅ APIs externas funcionam
- ✅ Validação automática roda sem erros
- ✅ Dados persistem corretamente no banco

---

**Boa sorte com os testes! 🚀**
