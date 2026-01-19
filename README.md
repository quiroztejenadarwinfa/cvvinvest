# 🏦 CVVInvest - Investment Platform

A modern and secure investment platform built with Next.js 14, Supabase, and TypeScript.

## ✨ Features

- 🔐 **Secure Authentication** with Supabase Auth + OAuth
- 📊 **Interactive Dashboard** for users and investors  
- 👨‍💼 **Complete Admin Panel** with full management capabilities
- 💰 **Deposit System** with multiple payment methods
- 📈 **Investment Management** with flexible plans
- 🔔 **Real-time Notifications**
- 🎨 **Responsive Design** with dark/light theme
- 🚀 **Production Ready** with Vercel deployment

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS, shadcn/ui
- **Auth**: Supabase Auth, NextAuth.js
- **Deploy**: Vercel

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/quiroztejenadarwinfa/cvvinvest.git
cd cvvinvest
pnpm install
```

### 2. Setup Environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Setup Database
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. In **SQL Editor**, execute the content of `00-CREAR-TABLAS.sql`
4. Update `.env.local` with your project credentials

### 4. Run Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👥 Default Users

### Admin Access
```
Email:    exe.main.darwin@gmail.com
Password: admin12345
Role:     admin
```

### Test User
```
Email:    test@cvvinvest.com
Password: (any password - auto-created)
Role:     user
```

## 📋 Deployment

### Deploy to Vercel

1. **Push to GitHub** (already done)
2. **Connect to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Framework: Next.js (auto-detected)

3. **Environment Variables**:
   Copy from `vercel-env-variables.txt` to Vercel Dashboard

4. **Deploy**: Click "Deploy" and wait 2-3 minutes

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=https://bbdltcgkidyokhxwyqku.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

## 🏗️ Project Structure

```
cvvinvest/
├── app/                    # App Router (Next.js 14)
│   ├── api/               # API Routes
│   ├── dashboard/         # User Dashboard
│   ├── admin/            # Admin Panel
│   └── (auth)/           # Authentication Pages
├── components/            # Reusable Components
├── lib/                  # Utilities & Configuration
├── scripts/              # Utility Scripts
└── 00-CREAR-TABLAS.sql   # Database Schema
```

## 🔐 Security Features

- 🛡️ **Supabase Auth** with email confirmation
- 🔒 **Row Level Security (RLS)** in database
- ✅ **Data Validation** on frontend and backend
- 🌐 **Security Headers** (CSP, HSTS, etc.)
- 🔑 **Service Role Key** for admin operations
- 🚫 **CSRF & XSS Protection**

## 📊 Database Schema

### Main Tables
- **users**: User information and profiles
- **deposits**: Deposit transactions
- **investments**: Active investments
- **withdrawals**: Withdrawal requests
- **notifications**: Notification system
- **chat_sessions**: Chat functionality
- **chat_messages**: Chat messages

## 🧪 Testing

```bash
# Verify Supabase connection
node scripts/verify-supabase.js

# Run development server
pnpm dev

# Build for production
pnpm build
```

## 📞 Support

### Common Issues

1. **Connection Error**: Check variables in `.env.local`
2. **Tables don't exist**: Execute `00-CREAR-TABLAS.sql` in Supabase
3. **RLS blocking**: Use service_role_key in admin APIs
4. **Build failing**: Check TypeScript errors

### Useful Logs
- **Vercel**: Dashboard > Functions > View Logs
- **Supabase**: Dashboard > Logs
- **Browser**: F12 > Console/Network

## 🤝 Contributing

1. Fork the project
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Need help?** Check the deployment guides in the `scripts/` folder or open an issue.

🚀 **Made with ❤️ for the investment community!**