# Quick Start Guide

Get up and running in 5 minutes!

## 1. Clone & Install

```bash
git clone https://github.com/yourusername/professional-platform
cd professional-platform
npm install
```

## 2. Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In Supabase dashboard → SQL Editor
3. Copy all SQL from `scripts/init-database.sql` and execute it
4. Go to Settings → API Keys
5. Copy your `SUPABASE_URL` and `ANON_KEY`

## 3. Configure Environment

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
OPENAI_API_KEY=your_openai_key_here
```

## 4. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Create Your First Project

1. Sign up at `/auth/register`
2. Go to Dashboard
3. Click "Create New" → Choose Code Generator, Visualization, or Presentation
4. Start building!

---

## Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Key URLs

- **Landing**: `/`
- **Register**: `/auth/register`
- **Login**: `/auth/login`
- **Dashboard**: `/dashboard`
- **Code Generator**: `/editor/code`
- **Visualization**: `/editor/visualization`
- **Presentation**: `/editor/presentation`
- **Settings**: `/settings`

## API Endpoints

```bash
# Auth
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

# Projects
GET /api/dashboard/projects

# Code Generation
POST /api/generate/code

# Export
POST /api/export/presentation

# Settings
POST /api/settings
```

## Troubleshooting

**Can't connect to database?**
- Check `.env.local` variables
- Verify Supabase project is active
- Ensure migrations ran successfully

**Code generation not working?**
- Check `OPENAI_API_KEY` in env
- Verify OpenAI account has credits
- Check browser console for errors

**Build fails?**
```bash
rm -rf .next node_modules
npm install
npm run build
```

## Next Steps

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
2. Read [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy
3. Check [README.md](./README.md) for full documentation

---

Need help? Open an issue on GitHub!
