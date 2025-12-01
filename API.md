# 📡 API DOCUMENTATION

## Base URL
```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer {your-jwt-token}
```

---

## 🔐 Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "manager"
}
```

**Response:** `201 Created`
```json
{
  "message": "User created",
  "userId": 1
}
```

**Errors:**
- `500` - Email already exists or validation error

---

### Login

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "role": "manager"
  }
}
```

**Errors:**
- `401` - Invalid credentials

---

## 📊 Campaign Endpoints

### List All Campaigns

**GET** `/campaigns`

Get all campaigns with validation history.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Lançamento Single - Artista X",
    "platform": "youtube",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "targetValue": 1000000,
    "currentValue": 750000,
    "provider": "Fornecedor A",
    "status": "pending",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T00:00:00.000Z",
    "userId": 1,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "validations": [
      {
        "id": 1,
        "campaignId": 1,
        "value": 500000,
        "checkedAt": "2024-01-15T12:00:00.000Z"
      },
      {
        "id": 2,
        "campaignId": 1,
        "value": 750000,
        "checkedAt": "2024-02-01T12:00:00.000Z"
      }
    ]
  }
]
```

---

### Get Campaign by ID

**GET** `/campaigns/:id`

Get detailed information about a specific campaign.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Lançamento Single - Artista X",
  "platform": "youtube",
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "targetValue": 1000000,
  "currentValue": 750000,
  "provider": "Fornecedor A",
  "status": "pending",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T00:00:00.000Z",
  "userId": 1,
  "createdAt": "2024-01-01T10:00:00.000Z",
  "validations": [...]
}
```

**Errors:**
- `404` - Campaign not found

---

### Create Campaign

**POST** `/campaigns`

Create a new campaign.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Lançamento Single - Artista X",
  "platform": "youtube",
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "targetValue": 1000000,
  "provider": "Fornecedor A",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "userId": 1
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Lançamento Single - Artista X",
  "platform": "youtube",
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "targetValue": 1000000,
  "currentValue": 0,
  "provider": "Fornecedor A",
  "status": "pending",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T00:00:00.000Z",
  "userId": 1,
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

**Validation Rules:**
- `name`: Required, string
- `platform`: Required, must be "youtube" or "spotify"
- `url`: Required, valid URL
- `targetValue`: Required, positive integer
- `provider`: Required, string
- `startDate`: Required, valid date
- `endDate`: Required, valid date (must be after startDate)
- `userId`: Required, valid user ID

**Errors:**
- `500` - Validation error or database error

---

### Validate Campaign

**POST** `/campaigns/:id/validate`

Manually trigger validation for a campaign.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "currentValue": 850000,
  "status": "pending"
}
```

**Process:**
1. Fetches current stats from YouTube/Spotify API
2. Updates campaign's `currentValue`
3. Updates `status` to "achieved" if target is met
4. Creates a new `ValidationHistory` record

**Errors:**
- `404` - Campaign not found
- `500` - API error (YouTube/Spotify unreachable)

---

## 📋 Data Models

### User
```typescript
{
  id: number;
  name: string;
  email: string;
  password: string; // hashed
  role: "admin" | "manager";
  createdAt: Date;
}
```

### Campaign
```typescript
{
  id: number;
  name: string;
  platform: "youtube" | "spotify";
  url: string;
  targetValue: number;
  currentValue: number;
  provider: string;
  status: "pending" | "achieved";
  startDate: Date;
  endDate: Date;
  userId: number;
  createdAt: Date;
}
```

### ValidationHistory
```typescript
{
  id: number;
  campaignId: number;
  value: number;
  checkedAt: Date;
}
```

---

## 🔄 Status Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 401  | Unauthorized |
| 404  | Not Found |
| 500  | Internal Server Error |

---

## 🧪 Example Usage (cURL)

### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "role": "manager"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Create Campaign
```bash
curl -X POST http://localhost:3001/api/campaigns \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Lançamento Single - Artista X",
    "platform": "youtube",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "targetValue": 1000000,
    "provider": "Fornecedor A",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "userId": 1
  }'
```

### List Campaigns
```bash
curl -X GET http://localhost:3001/api/campaigns \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Validate Campaign
```bash
curl -X POST http://localhost:3001/api/campaigns/1/validate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔌 Integration Examples

### JavaScript (Axios)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Login
const login = async () => {
  const response = await api.post('/auth/login', {
    email: 'joao@example.com',
    password: 'senha123'
  });
  const token = response.data.token;
  localStorage.setItem('token', token);
  return token;
};

// Create Campaign
const createCampaign = async (token) => {
  const response = await api.post('/campaigns', {
    name: 'My Campaign',
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=...',
    targetValue: 1000000,
    provider: 'Provider A',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    userId: 1
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

### Python (Requests)
```python
import requests

BASE_URL = 'http://localhost:3001/api'

# Login
response = requests.post(f'{BASE_URL}/auth/login', json={
    'email': 'joao@example.com',
    'password': 'senha123'
})
token = response.json()['token']

# Create Campaign
headers = {'Authorization': f'Bearer {token}'}
campaign_data = {
    'name': 'My Campaign',
    'platform': 'youtube',
    'url': 'https://www.youtube.com/watch?v=...',
    'targetValue': 1000000,
    'provider': 'Provider A',
    'startDate': '2024-01-01',
    'endDate': '2024-12-31',
    'userId': 1
}
response = requests.post(f'{BASE_URL}/campaigns', json=campaign_data, headers=headers)
campaign = response.json()
```

---

## 🚨 Rate Limiting

Currently no rate limiting is implemented. For production, consider:
- Implementing rate limiting middleware (express-rate-limit)
- YouTube API has daily quota limits (10,000 units/day free tier)
- Spotify API has rate limits per endpoint

---

## 📝 Notes

### YouTube API
- Requires API Key from Google Cloud Console
- Free tier: 10,000 quota units/day
- Each video stats request costs 1 unit
- Quota resets at midnight PST

### Spotify API
- Uses Client Credentials flow
- Public API doesn't provide exact play counts
- System uses `popularity` field (0-100) as proxy
- For real play counts, need Spotify for Artists access

---

**Last Updated**: December 2024
