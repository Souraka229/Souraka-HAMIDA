# Professional Platform - Enterprise Software Generator

A powerful, fully automated platform for generating production-ready code, creating interactive data visualizations, and building professional PowerPoint presentations.

## Features

### Code Generator
- **AI-Powered Code Generation**: Generate clean, modular, production-ready code using advanced AI
- **Multi-Framework Support**: React, Next.js, Vue, Svelte
- **Multi-Language Support**: TypeScript, JavaScript, Python
- **Smart Copy-Paste**: One-click copying of generated code
- **Code Formatting**: Auto-formatted, well-commented code
- **Download Support**: Export code directly to your machine

### Data Visualization Engine
- **Multiple Chart Types**: Bar, Line, Pie, Scatter, Area charts
- **Data Source Flexibility**: CSV, JSON file upload support
- **Interactive Charts**: Hover tooltips, legends, responsive design
- **Real-time Preview**: See changes instantly
- **Professional Styling**: Dark theme with accent colors

### Presentation Builder
- **Slide Management**: Add, edit, delete slides easily
- **Multiple Layouts**: Title slides, content, two-column layouts
- **Design Customization**: Background colors, typography control
- **Live Preview**: See your presentation as you build
- **PowerPoint Export**: Export to standard .pptx format

## Technology Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Data visualization library
- **Lucide Icons**: Modern icon library
- **PapaParse**: CSV parsing

### Backend
- **Next.js API Routes**: Serverless backend functions
- **Supabase**: PostgreSQL database + authentication
- **AI SDK**: OpenAI integration for code generation
- **bcryptjs**: Password hashing

### Infrastructure
- **Vercel**: Deployment and hosting
- **Supabase**: Database and authentication

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/professional-platform
cd professional-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **Database Setup**
Execute the SQL migration in Supabase:
```sql
-- Run scripts/init-database.sql in your Supabase SQL editor
```

5. **Start Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
professional-platform/
├── app/
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── editor/            # Code, visualization, presentation editors
│   ├── api/               # API routes
│   ├── settings/          # User settings
│   └── layout.tsx         # Root layout
├── components/
│   ├── dashboard/         # Dashboard components
│   ├── editor/            # Editor components
│   ├── visualization/     # Chart components
│   └── presentation/      # Slide components
├── scripts/               # Database migrations
└── public/                # Static assets
```

## Usage

### Code Generation
1. Navigate to Dashboard → "Create New" → "Code Generator"
2. Select your framework and language
3. Write a detailed prompt describing what code you need
4. Click "Generate Code"
5. Copy or download the generated code

### Data Visualization
1. Go to Dashboard → "Visualizations"
2. Upload your CSV or JSON data file
3. Select chart type and configure axes
4. Customize colors and styling
5. Export or embed your chart

### Presentations
1. Access Dashboard → "Presentations"
2. Add slides and choose layouts
3. Edit content with rich text
4. Customize background colors
5. Export to PowerPoint (.pptx)

## API Documentation

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out

### Code Generation
- `POST /api/generate/code` - Generate code from prompt

### Projects
- `GET /api/dashboard/projects` - List user projects
- `POST /api/dashboard/projects` - Create new project

### Settings
- `POST /api/settings` - Update user preferences

### Export
- `POST /api/export/presentation` - Export presentation

## Development

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Database
- Migrations: Use `scripts/` folder
- Schema: View in `scripts/init-database.sql`

## Performance Optimizations

- Server-side rendering for fast initial loads
- Code splitting and lazy loading
- Optimized bundle size with Next.js
- Caching strategies for API responses
- Efficient database queries with indexes

## Security Features

- Row-Level Security (RLS) in Supabase
- Password hashing with bcryptjs
- JWT token authentication
- Environment variable protection
- Input validation and sanitization

## Roadmap

### Phase 1 ✅ (Complete)
- Core platform architecture
- User authentication
- Basic code generator
- Chart visualizations
- Presentation builder

### Phase 2 (In Progress)
- Advanced code generation with tool usage
- Real-time collaboration
- Team workspaces
- Custom templates

### Phase 3 (Planned)
- AI-powered code optimization
- Advanced data analysis
- Custom chart themes
- Automatic presentation generation

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and feature requests, please open an issue on GitHub.

## Acknowledgments

- Built with Next.js and Vercel
- Powered by Supabase
- Charts powered by Recharts
- AI generation via OpenAI
- Icons from Lucide React

---

**Ready to generate amazing software?** Start building today!
