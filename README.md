# 🚗 DespachAzap - Vehicle Information Platform

A modern, full-stack web application for Brazilian vehicle license plate lookup, built with React, TypeScript, and serverless AWS infrastructure. This platform enables users to quickly retrieve comprehensive vehicle information and generate detailed PDF reports via PIX payment integration.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazon-aws&logoColor=white)

## ✨ Features

### Core Functionality
- 🔍 **License Plate Validation**: Real-time Brazilian plate format validation (ABC-1234 / ABC1D23)
- 📊 **Vehicle Preview**: Free instant vehicle information preview
- 📄 **Detailed Reports**: Comprehensive PDF reports with 20+ data points including:
  - Vehicle specifications (make, model, year, color)
  - FIPE price table information
  - Debts and fines history
  - Ownership information
  - Technical specifications
- 💳 **PIX Payment Integration**: Secure payments via Woovi API
- ⚡ **Real-time Status**: Live payment verification and PDF generation tracking

### Technical Highlights
- 🎨 **Modern UI**: Built with shadcn/ui components and TailwindCSS
- 📱 **Responsive Design**: Mobile-first, works seamlessly on all devices
- 🔐 **Security**: API keys secured via CloudFront Functions (never exposed to client)
- 🚀 **Performance**: CloudFront CDN distribution for global low latency
- ♿ **Accessibility**: WCAG compliant components
- 📈 **Cost Optimization**: Serverless architecture with automatic scaling

## 🏗️ Architecture

### Frontend Stack
```
React 18 + TypeScript + Vite
├── UI Framework: shadcn/ui + Radix UI
├── Styling: TailwindCSS
├── State Management: TanStack Query (React Query)
├── Routing: React Router v6
├── Forms: React Hook Form + Zod validation
└── API Client: Fetch API with custom service layer
```

### Backend Stack
```
Node.js Express API (Proxy Server)
├── CORS management
├── API key injection (dev environment)
├── Request forwarding to AWS Lambda
└── Error handling middleware
```

### AWS Infrastructure (via Terraform)
```
CloudFront Distribution
├── S3 Origin (Static Assets)
├── CloudFront Functions (API Key Injection)
├── Route 53 (DNS Management)
├── ACM (SSL Certificate)
└── API Gateway → Lambda Functions
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **Git** for version control
- **AWS Account** (for deployment)
- **Terraform** (for infrastructure)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/CarlosDanielS3/despacha-zap-frontend.git
cd despacha-zap-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Backend API Configuration
AWS_API_BASE_URL=https://your-api-gateway-url.amazonaws.com
AWS_API_KEY=your-api-gateway-key

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:8080,https://yourdomain.com

# Server Port
PORT=3001
```

4. **Start development server**
```bash
# Terminal 1: Frontend (Vite)
npm run dev

# Terminal 2: Backend Proxy (Express)
cd backend
npm install
npm run dev
```

Visit `http://localhost:8080` (frontend) and the API proxy runs on `http://localhost:3001`

## 📦 Project Structure

```
despacha-zap-finder/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui base components
│   │   ├── Header.tsx      # Navigation header
│   │   ├── HeroSection.tsx # Landing page hero
│   │   └── ...             # Feature sections
│   ├── pages/              # Route pages
│   │   ├── Index.tsx       # Landing page
│   │   ├── Preview.tsx     # Plate preview page
│   │   ├── Pagamento.tsx   # Payment page
│   │   ├── Resultado.tsx   # Results/PDF page
│   │   └── ...             # Legal pages
│   ├── services/           # API service layer
│   │   └── vehicleApi.ts   # Vehicle API client
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── App.tsx             # Main app component
├── backend/                # Express proxy server
│   ├── server.js           # API proxy logic
│   └── package.json
├── terraform/              # AWS infrastructure
│   ├── main.tf            # Core infrastructure
│   ├── cloudfront.tf      # CDN configuration
│   ├── s3.tf              # Static hosting
│   └── ...
├── public/                 # Static assets
├── package.json
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server

# Building
npm run build            # Production build
npm run build:dev        # Development build

# Code Quality
npm run lint             # Run ESLint

# Preview
npm run preview          # Preview production build locally
```

## 🔐 Security

### API Key Management
- **Development**: API keys injected by Express proxy server, never exposed to browser
- **Production**: CloudFront Functions inject API keys at the edge, maintaining zero client-side exposure
- All sensitive keys stored in environment variables

### CORS Configuration
- Whitelist-based origin validation
- Configurable via environment variables
- Secure credential handling

## 🌐 Deployment

### Frontend Deployment (AWS)

1. **Build the application**
```bash
npm run build
```

2. **Deploy infrastructure**
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

3. **Upload to S3**
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

4. **Invalidate CloudFront cache**
```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Backend Deployment
The Express proxy is only needed for local development. In production, CloudFront Functions handle API key injection directly at the edge.

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Type checking
npm run type-check
```

## 📝 Environment Variables

Create `.env` file based on `.env.example`:

| Variable | Description | Required |
|----------|-------------|----------|
| `AWS_API_BASE_URL` | API Gateway endpoint URL | Yes |
| `AWS_API_KEY` | API Gateway API key | Yes |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | Yes |
| `PORT` | Backend server port | No (default: 3001) |

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Acknowledgments

- UI Components: [shadcn/ui](https://ui.shadcn.com/)
- Icons: [Lucide Icons](https://lucide.dev/)
- Styling: [TailwindCSS](https://tailwindcss.com/)
- State Management: [TanStack Query](https://tanstack.com/query)
- Payment Integration: [Woovi](https://woovi.com/)

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Time to Interactive**: < 2s
- **First Contentful Paint**: < 1s
- **CloudFront Edge**: Global CDN distribution

## 🔗 Related Projects

- [despachazap-lambdas](https://github.com/CarlosDanielS3/despachazap-lambdas) - Serverless backend Lambda functions

---

**Note**: This is a portfolio project demonstrating full-stack development with modern web technologies and cloud infrastructure. The service integrates with Brazilian vehicle databases for educational purposes.

## 👨‍💻 Author

**Carlos Santos**

- 🌐 **Website**: [despachazap.com](https://despachazap.com/)
- 💼 **LinkedIn**: [carlos-santos-engineer](https://www.linkedin.com/in/carlos-santos-engineer/)

Feel free to reach out if you have any questions or collaboration opportunities!