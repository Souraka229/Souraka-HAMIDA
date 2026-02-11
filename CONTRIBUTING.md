# Contributing Guidelines

Thank you for your interest in contributing to Professional Platform! We welcome contributions from everyone.

## Getting Started

### 1. Fork the Repository
Click the "Fork" button on GitHub to create your own copy.

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/professional-platform
cd professional-platform
```

### 3. Add Upstream Remote
```bash
git remote add upstream https://github.com/original-owner/professional-platform
```

### 4. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

## Development Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Setup Supabase (see QUICKSTART.md)

# Start development server
npm run dev
```

## Code Standards

### TypeScript
- Use strict mode
- Add type annotations
- Avoid `any` type
- Use interfaces for objects

```typescript
// Good
interface User {
  id: string
  email: string
  createdAt: Date
}

const user: User = { /* ... */ }

// Avoid
const user: any = { /* ... */ }
```

### React Components
- Use functional components
- Use hooks (not class components)
- Use TypeScript interfaces for props
- Keep components small and focused

```typescript
interface ComponentProps {
  title: string
  onClick: () => void
}

export default function MyComponent({ title, onClick }: ComponentProps) {
  return <button onClick={onClick}>{title}</button>
}
```

### Naming Conventions
- Components: PascalCase (`UserProfile.tsx`)
- Files: kebab-case (`user-profile.tsx`)
- Variables: camelCase (`userName`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`)

### CSS/Tailwind
- Use Tailwind classes
- Avoid custom CSS when possible
- Use semantic classes
- Mobile-first approach

```tsx
// Good
<div className="flex flex-col gap-4 md:flex-row">

// Avoid
<div style={{ display: 'flex', gap: '1rem' }}>
```

### Comments
- Comment "why", not "what"
- Use JSDoc for functions
- Keep comments up-to-date

```typescript
// Good - explains intent
// Fetch user data with retry logic for network resilience
async function fetchUser(id: string) { /* ... */ }

// Avoid - obvious from code
// Get the user
function getUser(id: string) { /* ... */ }
```

## Testing

### Unit Tests (Future)
```bash
npm run test
```

### Manual Testing
- Test on Chrome, Firefox, Safari
- Test on mobile devices
- Test accessibility with screen readers
- Test with different network speeds

## Commit Guidelines

Use conventional commits:

```
feat: add new feature
fix: resolve issue
docs: update documentation
style: formatting changes
refactor: code restructuring
perf: performance improvements
test: add tests
chore: maintenance tasks
```

Examples:
```bash
git commit -m "feat: add CSV upload to visualization builder"
git commit -m "fix: correct chart tooltip positioning"
git commit -m "docs: update API documentation"
```

## Pull Request Process

### 1. Before Submitting
- Update your branch: `git rebase upstream/main`
- Run linting: `npm run lint`
- Test locally: `npm run dev`

### 2. Create Pull Request
- Provide clear description
- Reference related issues
- Include before/after screenshots if UI changes
- Keep PR focused on one feature

### 3. PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How to Test
Steps to test the changes

## Screenshots (if applicable)
Before/after screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Changes tested locally
```

### 4. Code Review
- Respond to feedback promptly
- Make requested changes
- Push updates (don't force push)
- Get approval before merging

## File Structure Best Practices

### Component Organization
```
components/
├── feature-name/
│   ├── FeatureName.tsx         # Main component
│   ├── FeatureName.test.tsx    # Tests
│   ├── types.ts                # TypeScript interfaces
│   ├── hooks.ts                # Custom hooks
│   └── utils.ts                # Helper functions
```

### Page Organization
```
app/
├── feature/
│   ├── page.tsx                # Page component
│   ├── layout.tsx              # Layout
│   ├── loading.tsx             # Loading UI
│   ├── error.tsx               # Error handling
│   └── not-found.tsx           # 404 handling
```

## Database Changes

### Adding New Tables
1. Create migration in `scripts/`
2. Include UP and DOWN migrations
3. Test locally
4. Update documentation

```sql
-- scripts/add_new_table.sql

-- UP
CREATE TABLE new_feature (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DOWN
DROP TABLE new_feature;
```

### Updating Schema
- Keep migrations small
- Always include rollback logic
- Add indexes for performance
- Update Entity/type definitions

## Documentation

### Update These Files
- `README.md` - Major feature changes
- `FEATURES.md` - New features
- `ARCHITECTURE.md` - System changes
- Code comments - Logic explanations

### Documentation Format
```markdown
## Feature Name

Brief description of feature.

### Usage
```typescript
// Code example
```

### Configuration
- Any configuration needed

### Notes
- Important information
```

## Performance Considerations

- Minimize bundle size
- Use dynamic imports for heavy components
- Optimize images
- Implement pagination for lists
- Cache API responses

## Accessibility

- Add `alt` text to images
- Ensure keyboard navigation
- Use semantic HTML
- Test with screen readers
- Maintain color contrast

## Security Checklist

- No hardcoded secrets
- Validate user input
- Use parameterized queries
- Sanitize output
- Keep dependencies updated

## Reporting Issues

### Bug Reports Include
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs
- Environment details

### Feature Requests Include
- Use case description
- Proposed solution
- Alternative solutions
- Mock-ups if applicable

## Code Review Checklist

- [ ] Code follows style guide
- [ ] Comments are helpful
- [ ] Performance is acceptable
- [ ] Security is maintained
- [ ] Tests pass (when available)
- [ ] Documentation is updated
- [ ] No unnecessary dependencies
- [ ] Error handling is complete

## Getting Help

- Create discussions for questions
- Check existing issues first
- Join our community Discord
- Check documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making Professional Platform better! 🚀
