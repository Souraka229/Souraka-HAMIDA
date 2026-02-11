# Deployment Guide

## Vercel Deployment (Recommended)

### Step 1: Prepare Repository
1. Push your code to GitHub
2. Ensure `.env.example` is up-to-date with all required variables

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select "Next.js" as the framework

### Step 3: Environment Variables
In Vercel Project Settings → Environment Variables, add:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
POSTGRES_URL=your_postgres_url
```

### Step 4: Database Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Execute `scripts/init-database.sql` in Supabase SQL Editor
3. Copy the connection string and add to Vercel env vars

### Step 5: Deploy
Click "Deploy" - Vercel will automatically build and deploy your app!

## Manual Deployment

### Using Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Using PM2
```bash
npm install -g pm2

npm run build
pm2 start "npm start" --name "professional-platform"
pm2 save
pm2 startup
```

## Production Checklist

- [ ] Environment variables configured in Vercel
- [ ] Database migrations applied
- [ ] SSL/HTTPS enabled
- [ ] CORS configured for your domain
- [ ] Backup strategy for database
- [ ] Monitoring and error tracking setup
- [ ] Email notifications enabled
- [ ] Rate limiting configured

## Post-Deployment

### Monitor Performance
- Check Vercel Analytics
- Monitor Supabase metrics
- Set up error tracking with Sentry

### Database Maintenance
```sql
-- Vacuum database (monthly)
VACUUM ANALYZE;

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Scaling Strategy
- Vercel handles frontend scaling automatically
- For database: upgrade Supabase tier if needed
- Consider caching with Redis for high-traffic endpoints

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
vercel rebuild
```

### Database Connection Issues
1. Check environment variables
2. Verify Supabase project is active
3. Check connection limits

### Slow Performance
1. Check database query performance
2. Enable caching where applicable
3. Optimize images and assets

## Rollback Strategy
1. Vercel automatically keeps previous deployments
2. Use Vercel dashboard to revert to previous version
3. Database migrations should be reversible

---

For more help, check [Vercel Docs](https://vercel.com/docs) or [Supabase Docs](https://supabase.com/docs)
