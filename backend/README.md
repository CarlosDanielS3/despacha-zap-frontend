# Despacha Zap Backend Proxy

This is a secure proxy server that handles API authentication for the Despacha Zap frontend.

## Why?

- **Security**: API keys are never exposed to the browser
- **CORS**: Handles cross-origin requests properly
- **Control**: Centralized API access management

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables in `.env`:
```
PORT=3001
AWS_API_BASE_URL=https://your-api-gateway-url.com
AWS_API_KEY=your-secret-key
ALLOWED_ORIGINS=http://localhost:8080,https://your-domain.com
```

3. Run the server:
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## Endpoints

All endpoints proxy to AWS API Gateway with authentication:

- `POST /api/retrieve-plate-preview` - Get basic vehicle info
- `POST /api/retrieve-plate-full` - Get full vehicle data (requires payment)
- `POST /api/woovi-pix-invoice` - Generate PIX payment
- `POST /api/check-payment-status` - Check payment status
- `GET /health` - Health check

## Deployment

### Option 1: Same server as frontend
```bash
# Build frontend
npm run build

# Serve both from Express
# Add static serving to server.js
```

### Option 2: Separate deployment
- Deploy backend to Railway/Render/Heroku
- Update frontend `VITE_API_BASE_URL` to backend URL
- Add backend URL to CORS allowed origins

### Option 3: Serverless
- Convert to AWS Lambda/Vercel Functions
- Deploy as edge functions
