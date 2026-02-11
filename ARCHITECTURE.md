# Platform Architecture

## System Overview

Professional Platform is a three-tier web application designed for scalability, performance, and maintainability.

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌──────────┬──────────────┬──────────┬──────────────────┐  │
│  │Dashboard │Code Generator│Viz Builder│Presentation Bldr│  │
│  └──────────┴──────────────┴──────────┴──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     API Layer (Route Handlers)               │
│  ┌────────┬──────────┬──────────┬────────┬─────────────┐  │
│  │Auth    │Dashboard │Generate  │Export  │Settings     │  │
│  └────────┴──────────┴──────────┴────────┴─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Backend Services & Database                     │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐    │
│  │Supabase     │  │OpenAI API    │  │External APIs   │    │
│  │(PostgreSQL) │  │(Code Gen)    │  │(Data Sources)  │    │
│  └─────────────┘  └──────────────┘  └────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Components

### Frontend Layer

#### Pages
- **Landing Page** (`app/page.tsx`)
  - Hero section
  - Feature highlights
  - Call-to-action buttons

- **Authentication** (`app/auth/login`, `app/auth/register`)
  - User registration
  - Login flow
  - Session management

- **Dashboard** (`app/dashboard/page.tsx`)
  - Project listing
  - Quick project creation
  - User information

- **Editors**
  - Code Generator (`app/editor/code/page.tsx`)
  - Visualization Builder (`app/editor/visualization/page.tsx`)
  - Presentation Builder (`app/editor/presentation/page.tsx`)

- **Settings** (`app/settings/page.tsx`)
  - User preferences
  - Notification settings
  - Account management

#### Components
```
components/
├── dashboard/
│   ├── Sidebar.tsx          # Navigation sidebar
│   └── ProjectCard.tsx      # Project preview card
├── editor/
│   ├── PromptInput.tsx      # Code generation prompt
│   └── CodeDisplay.tsx      # Syntax-highlighted code
├── visualization/
│   ├── DataSourceManager.tsx # File upload & parsing
│   └── ChartPreview.tsx     # Chart visualization
└── presentation/
    ├── SlideEditor.tsx      # Slide content editor
    └── SlidePreview.tsx     # Slide preview
```

### API Layer

#### Authentication Routes
```
POST /api/auth/register    → Create account
POST /api/auth/login       → Authenticate user
POST /api/auth/logout      → Destroy session
```

#### Dashboard Routes
```
GET /api/dashboard/projects    → List user projects
POST /api/dashboard/projects   → Create project
```

#### Generation Routes
```
POST /api/generate/code        → AI code generation
```

#### Export Routes
```
POST /api/export/presentation  → Export to PowerPoint
```

#### Settings Routes
```
POST /api/settings             → Update preferences
```

### Database Layer

#### Tables
- **users** - User accounts & profiles
- **projects** - User projects (code/viz/presentation)
- **data_sources** - Uploaded/connected data
- **code_generations** - Generated code history
- **visualizations** - Chart configurations
- **presentations** - Presentation slides
- **user_interactions** - Activity tracking for ML
- **api_connections** - External API credentials

#### Security
- Row Level Security (RLS) policies
- User isolation per account
- Encrypted credential storage

### External Services

#### OpenAI API
- Model: `gpt-4-turbo`
- Purpose: Code generation
- Integration: AI SDK

#### Supabase
- Authentication
- PostgreSQL database
- Vector storage (future)

## Data Flow

### Code Generation Flow
```
User Input (prompt)
        ↓
CodeEditor Component
        ↓
POST /api/generate/code
        ↓
OpenAI API (streamText)
        ↓
Stream response to client
        ↓
Display in CodeDisplay
        ↓
User copies/downloads
```

### Visualization Flow
```
CSV/JSON File Upload
        ↓
DataSourceManager (PapaParse)
        ↓
Store in state
        ↓
User selects chart type & axes
        ↓
ChartPreview renders (Recharts)
        ↓
User exports/embeds
```

### Presentation Flow
```
Create Slides
        ↓
Edit content & layout
        ↓
SlidePreview renders
        ↓
POST /api/export/presentation
        ↓
Generate PPTX
        ↓
User downloads
```

## Deployment Architecture

```
Git Repository
    ↓
GitHub (Source Control)
    ↓
Vercel (CI/CD)
    ├─→ Build (npm run build)
    ├─→ Test & Lint
    ├─→ Deploy to Vercel Edge Network
    │
    └─→ Environment Variables
        ├─ SUPABASE_URL
        ├─ OPENAI_API_KEY
        └─ Other secrets

        ↓

Vercel Global CDN
    ├─ Static assets (images, CSS)
    ├─ Next.js app
    └─ API routes

        ↓

Supabase (Database)
    ├─ PostgreSQL
    ├─ Auth
    └─ Real-time subscriptions
```

## Performance Optimizations

### Frontend
- Code splitting with dynamic imports
- Image optimization with Next.js Image
- Lazy loading of components
- CSS-in-JS with Tailwind
- Caching with SWR

### API
- Response streaming for large data
- Database indexing on frequently queried fields
- Connection pooling with Supabase
- Rate limiting for API endpoints

### Database
- Indexes on user_id, project_id, etc.
- Partitioning for large tables
- Query optimization with EXPLAIN
- Regular VACUUM ANALYZE

## Security Architecture

### Authentication
- JWT tokens via Supabase Auth
- HTTP-only cookies
- CSRF protection
- Secure session storage

### Authorization
- Row Level Security (RLS) in database
- Middleware authentication checks
- API route protection
- User isolation

### Data Protection
- Encrypted passwords with bcrypt
- API key encryption in transit (HTTPS)
- Environment variable isolation
- SQL injection prevention with parameterized queries

## Error Handling

### Frontend
- Global error boundary (`app/error.tsx`)
- 404 handling (`app/not-found.tsx`)
- Form validation
- User-friendly error messages

### API
- Try-catch error handling
- Consistent error response format
- Logging to console (extensible)
- HTTP status codes

### Database
- Connection error handling
- Transaction rollback on failure
- Constraint violations
- Retry logic where appropriate

## Monitoring & Logging

### Available Integrations
- Vercel Analytics (performance)
- Supabase monitoring (database)
- Error tracking (ready for Sentry)
- Logging (console.log)

### Key Metrics
- Page load time
- API response time
- Database query time
- Error rates
- User conversion funnel

## Scalability Considerations

### Horizontal Scaling
- Vercel handles automatic scaling
- Supabase connection pooling
- CDN for static assets

### Vertical Scaling
- Upgrade Supabase tier
- Increase database compute
- Optimize queries

### Future Improvements
- Implement caching layer (Redis)
- Message queue for async tasks
- WebSocket for real-time collaboration
- GraphQL API option
- Microservices architecture

## Technology Justifications

| Technology | Reason |
|-----------|--------|
| Next.js 16 | SSR, automatic code splitting, fast refresh |
| Supabase | PostgreSQL, Auth, RLS, real-time |
| Tailwind | Utility-first, performant styling |
| TypeScript | Type safety, better DX |
| Recharts | React-native charts, lightweight |
| AI SDK | OpenAI integration, streaming |
| Vercel | Optimized hosting, CI/CD |

---

For detailed information on specific systems, see individual documentation files.
