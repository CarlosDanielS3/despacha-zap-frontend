import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const AWS_API_BASE_URL = process.env.AWS_API_BASE_URL;
const AWS_API_KEY = process.env.AWS_API_KEY;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Despacha Zap Backend is running' });
});

// Proxy endpoint for vehicle preview
app.post('/api/retrieve-plate-preview', async (req, res) => {
  try {
    const response = await fetch(`${AWS_API_BASE_URL}/retrieve-plate-preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AWS_API_KEY,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxying preview request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Proxy endpoint for full vehicle data
app.post('/api/retrieve-plate-full', async (req, res) => {
  try {
    const response = await fetch(`${AWS_API_BASE_URL}/retrieve-plate-full`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AWS_API_KEY,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxying full data request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Proxy endpoint for PIX invoice generation
app.post('/api/woovi-pix-invoice', async (req, res) => {
  try {
    const response = await fetch(`${AWS_API_BASE_URL}/woovi-pix-invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AWS_API_KEY,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxying PIX invoice request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Proxy endpoint for payment status check
app.post('/api/check-payment-status', async (req, res) => {
  try {
    const response = await fetch(`${AWS_API_BASE_URL}/check-payment-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AWS_API_KEY,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxying payment status request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Despacha Zap Backend running on port ${PORT}`);
  console.log(`📡 Proxying to: ${AWS_API_BASE_URL}`);
  console.log(`🔒 CORS allowed origins: ${allowedOrigins.join(', ')}`);
});
