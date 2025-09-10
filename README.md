# 🌍 CareerNest - AI-Powered Career Platform

**CareerNest** is a comprehensive AI-powered career development platform designed for MTN MoMo users across West and South Africa. It provides CV generation, cover letter creation, job search, and personalized career guidance in 25+ local languages.

## ✨ Features

### 🤖 **AI Services**
- **CV Generator** - Professional CV creation with ATS optimization
- **Cover Letter Generator** - Personalized cover letters for job applications  
- **Career Pathway Generator** - AI-driven career guidance and planning
- **Job Search & Alerts** - Intelligent job matching with email notifications

### 🌍 **Multi-Language Support**
- **25+ Languages** across West and South Africa
- **Localized Pricing** in local currencies (ZAR, NGN, GHS, CFA, etc.)
- **Cultural Adaptation** with region-specific content
- **RTL Language Support** for Arabic scripts

### 💰 **MTN MoMo Integration**
- **Real-time Payments** via MTN Mobile Money
- **Multi-Country Support** (Ghana, Nigeria, South Africa, etc.)
- **Secure Transactions** with payment verification
- **Subscription Management** for recurring services

### 🎯 **Smart Features**
- **Intelligent Chatbot** for career guidance
- **Skills Assessment** and development tracking
- **Mentorship Network** connecting users with professionals
- **Success Stories** and community features

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** database (local or cloud)
- **MTN MoMo API credentials** (see setup guide below)
- **Git** for version control

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/careernest.git
cd careernest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

#### Copy Environment File
```bash
cp .env.example .env
```

#### Configure Database
Choose one of these database options:

**Option A: Supabase (Recommended)**
```bash
# 1. Go to https://supabase.com
# 2. Create new project
# 3. Get connection string from Settings > Database
# 4. Add to .env:
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

**Option B: Neon**
```bash
# 1. Go to https://neon.tech
# 2. Create new project
# 3. Get connection string
# 4. Add to .env:
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/careernest
```

**Option C: Local PostgreSQL**
```bash
# 1. Install PostgreSQL locally
# 2. Create database: createdb careernest
# 3. Add to .env:
DATABASE_URL=postgresql://username:password@localhost:5432/careernest
```

#### Configure MTN MoMo API

You already have the subscription keys. Now you need to generate API User IDs and Keys:

**Step 1: Run the MoMo Setup Script**
```bash
node setup-momo-api.js
```

**Step 2: Update .env with Generated Credentials**
```bash
# Collections API (Receiving Payments)
MOMO_COLLECTIONS_SUBSCRIPTION_KEY=b09bff7ce0c54f9fafe3bd78bb74279d
MOMO_COLLECTIONS_USER_ID=your-generated-user-id
MOMO_COLLECTIONS_API_KEY=your-generated-api-key

# Disbursements API (Sending Payments)  
MOMO_DISBURSEMENTS_SUBSCRIPTION_KEY=22dd0dec976649989455bf871abb24b0
MOMO_DISBURSEMENTS_USER_ID=your-generated-user-id
MOMO_DISBURSEMENTS_API_KEY=your-generated-api-key
```

### 4. Database Setup

```bash
# Push database schema
npm run db:push
```

### 5. Launch the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

### 6. Access the Application

Open your browser and navigate to:
- **Local Development**: http://localhost:5000
- **Production**: Your deployed URL

## 🔧 Configuration Guide

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `MOMO_COLLECTIONS_SUBSCRIPTION_KEY` | MTN MoMo Collections API key | `b09bff7ce0c54f9fafe3bd78bb74279d` |
| `MOMO_DISBURSEMENTS_SUBSCRIPTION_KEY` | MTN MoMo Disbursements API key | `22dd0dec976649989455bf871abb24b0` |
| `MOMO_COLLECTIONS_USER_ID` | Collections API User ID | Generated via setup script |
| `MOMO_COLLECTIONS_API_KEY` | Collections API Key | Generated via setup script |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `OPENAI_API_KEY` | OpenAI API for AI services | Required for AI features |
| `SMTP_HOST` | Email server for job alerts | `smtp.gmail.com` |

## 🌐 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings > Environment Variables
```

### Deploy to Railway

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy to Railway"
git push

# 2. Go to https://railway.app
# 3. Connect GitHub repository
# 4. Deploy automatically
```

### Deploy to Render

```bash
# 1. Push to GitHub
# 2. Go to https://render.com
# 3. Create new Web Service
# 4. Connect GitHub repository
# 5. Add environment variables
```

## 🧪 Testing

### Run Integration Tests
```bash
node test-integration.js
```

### Test MoMo API Connection
```bash
# Test Collections API
curl -X GET "https://sandbox.momodeveloper.mtn.com/collection/v1_0/account/balance" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Ocp-Apim-Subscription-Key: b09bff7ce0c54f9fafe3bd78bb74279d"
```

### Test Language Switching
1. Open application in browser
2. Click language selector in header
3. Switch between languages (English, isiZulu, Setswana, etc.)
4. Verify pricing updates to local currency
5. Check welcome messages in selected language

## 📱 Usage Guide

### For Users

1. **Registration**: Choose your preferred language during signup
2. **Language Selection**: Switch languages anytime via header menu
3. **AI Services**: Purchase services using MTN MoMo
4. **Job Search**: Browse jobs with intelligent matching
5. **Career Guidance**: Chat with AI career advisor

### For Developers

1. **Adding Languages**: Update `client/src/i18n/languages.ts`
2. **Adding Translations**: Update `client/src/i18n/translations.ts`
3. **MoMo Integration**: Modify `server/services/momoService.ts`
4. **Database Changes**: Update `shared/schema.ts` and run migrations

## 🔍 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check DATABASE_URL format
# Ensure database exists
# Verify network connectivity
```

**MoMo API Errors**
```bash
# Verify subscription keys are correct
# Check API User ID and Key generation
# Ensure sandbox environment is used for testing
```

**Language Not Loading**
```bash
# Check translation files exist
# Verify language code in SUPPORTED_LANGUAGES
# Clear browser cache and reload
```

**Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **MTN MoMo Support**: Contact MTN Developer Portal for API issues

### Useful Links

- [MTN MoMo Developer Portal](https://momodeveloper.mtn.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [React Documentation](https://react.dev/)

## 🎯 Next Steps

After successful launch:

1. **Test Payment Flow**: Make test payments in sandbox
2. **Add Real Content**: Upload actual job listings
3. **Configure Email**: Set up SMTP for job alerts
4. **Monitor Performance**: Add analytics and monitoring
5. **Scale Infrastructure**: Upgrade database and hosting as needed

## 🔐 Security

- Environment variables are never committed to version control
- API keys are stored securely in environment files
- Database connections use SSL in production
- User passwords are hashed with bcrypt
- Session management with secure cookies

---

**🎉 Congratulations!** Your CareerNest platform is now ready to help users across Africa advance their careers with AI-powered tools and MTN MoMo integration!
