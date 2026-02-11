# Installation Guide

Complete step-by-step instructions for setting up Professional Platform locally and in production.

## Prerequisites

Before starting, ensure you have:
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **GitHub Account** - For repository
- **Supabase Account** - [Create free](https://supabase.com/)
- **OpenAI Account** - [Create account](https://openai.com/)

## Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/professional-platform.git
cd professional-platform
```

### Step 2: Install Dependencies

```bash
npm install
```

Or with yarn:
```bash
yarn install
```

Or with pnpm:
```bash
pnpm install
```

### Step 3: Create Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Project Name**: Your project name
   - **Database Password**: Generate secure password
   - **Region**: Choose nearest region
4. Click "Create new project"
5. Wait for database to initialize (2-3 minutes)

### Step 4: Setup Database

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open `scripts/init-database.sql`
4. Copy entire SQL content
5. Paste into SQL Editor
6. Click **Run**
7. Wait for all tables to be created

### Step 5: Get Supabase Credentials

1. Go to **Settings → API**
2. Copy these values:
   - `SUPABASE_URL` (Project URL)
   - `anon public` key (ANON_KEY)
   - `service_role` key (SERVICE_ROLE_KEY)

### Step 6: Get OpenAI API Key

1. Visit [openai.com](https://openai.com)
2. Go to **API Keys**
3. Click **Create new secret key**
4. Copy the key (save securely)

### Step 7: Create Environment File

Create `.env.local` in project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI
OPENAI_API_KEY=your_openai_key_here

# Environment
NODE_ENV=development
```

**Important**: Never commit `.env.local` to Git. It's in `.gitignore` for security.

### Step 8: Start Development Server

```bash
npm run dev
```

Output will show:
```
> Professional Platform dev
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 9: Test Installation

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the landing page
3. Click **Get Started** → **Create Account**
4. Register a test account
5. Try the Dashboard

## Troubleshooting Installation

### Port 3000 Already in Use

```bash
# Use different port
npm run dev -- -p 3001
```

### Database Connection Failed

Check in this order:
1. Is `.env.local` created with correct values?
2. Is Supabase project active?
3. Does the database exist in Supabase?
4. Are credentials correct (copy-paste carefully)?

```bash
# Test connection
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

### Missing Dependencies

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Rebuild
npm run build
```

### OpenAI API Key Issues

1. Check key is active in OpenAI dashboard
2. Ensure key starts with `sk-`
3. Verify account has API credits

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# View environment
npm run env
```

## Database Management

### View Database

In Supabase SQL Editor, run:
```sql
-- See all tables
SELECT * FROM information_schema.tables WHERE table_schema = 'public';

-- See users
SELECT id, email, created_at FROM users;

-- See projects
SELECT id, name, type, status FROM projects;
```

### Reset Database

```sql
-- WARNING: Deletes all data!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Then re-run init-database.sql
```

### Backup Database

1. In Supabase dashboard → Backups
2. Click "Create backup"
3. Download backup file

## Browser Support

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## File Upload Limits

Default limits:
- CSV files: 10MB
- JSON files: 10MB
- Images: 5MB

Edit in `lib/constants.ts`:
```typescript
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // bytes
```

## Performance Tips

1. **Use SSD**: Faster development builds
2. **Close unused tabs**: More RAM for dev server
3. **Update Node.js**: Latest LTS recommended
4. **Clear cache**: `rm -rf .next`

## Common Errors & Solutions

### "Cannot find module 'next'"
```bash
npm install
```

### "Port 3000 is already in use"
```bash
lsof -i :3000  # Find process
kill -9 <PID>  # Kill process
```

### "NEXT_PUBLIC_SUPABASE_URL is not defined"
- Check `.env.local` exists
- Restart dev server: `Ctrl+C` then `npm run dev`

### "RLS policy violation"
- Check user is authenticated
- Verify RLS policies in Supabase

### "OpenAI API rate limit exceeded"
- Wait 1 minute
- Check OpenAI dashboard for limits
- Upgrade to paid plan if needed

## Next Steps

1. ✅ Local setup complete
2. Read [QUICKSTART.md](./QUICKSTART.md) for usage
3. Check [README.md](./README.md) for features
4. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for structure

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Deploying to Vercel
- Setting up CI/CD
- Environment configuration
- Database migration
- Monitoring setup

## Getting Help

- Check [CONTRIBUTING.md](./CONTRIBUTING.md) for community guidelines
- Review documentation files
- Open GitHub issue for bugs
- Discuss in community forum

## Security Checklist

- [ ] `.env.local` in `.gitignore`
- [ ] Database passwords secure
- [ ] API keys stored safely
- [ ] HTTPS enabled (production)
- [ ] CORS configured
- [ ] RLS policies enabled
- [ ] Rate limiting set up

---

**Installation Status**: Follow these steps in order for successful setup!
