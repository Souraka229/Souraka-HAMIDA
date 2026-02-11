# BuildStudio - Complete Platform Guide

## Overview

BuildStudio is a professional, enterprise-grade platform for generating code, creating data visualizations, and building presentations using AI. This guide covers all aspects of the platform and how to use it effectively.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Platform Architecture](#platform-architecture)
3. [Feature Guides](#feature-guides)
4. [API Documentation](#api-documentation)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Initial Setup

1. **Create an Account**
   - Navigate to the registration page
   - Enter your email and password
   - Verify your email address

2. **Complete Your Profile**
   - Go to Settings
   - Configure your default preferences
   - Choose your preferred programming language and framework

3. **Explore the Dashboard**
   - View all available tools
   - Create your first project
   - Familiarize yourself with the interface

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- JavaScript enabled
- Recommended: 8GB RAM, 100MB storage for local files

---

## Platform Architecture

### Technology Stack

**Frontend:**
- Next.js 16 with App Router
- React 19
- TypeScript for type safety
- Tailwind CSS for styling
- Recharts for data visualization

**Backend:**
- Next.js API Routes
- Supabase for authentication and database
- AI SDK for code generation
- JWT for session management

**Infrastructure:**
- Vercel for hosting
- Supabase PostgreSQL database
- Cloud storage for files

### Database Schema

#### Users Table
- `id`: User identifier
- `email`: User email address
- `password_hash`: Encrypted password
- `created_at`: Account creation timestamp
- `preferences`: JSON field for user settings

#### Projects Table
- `id`: Project identifier
- `user_id`: Owner reference
- `name`: Project name
- `description`: Project description
- `type`: Type (code | visualization | presentation)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

#### Data Sources Table
- `id`: Data source identifier
- `project_id`: Associated project
- `name`: Source name
- `type`: Data type (csv | json | sql)
- `data`: Actual data payload
- `created_at`: Creation timestamp

#### Code Generations Table
- `id`: Generation identifier
- `project_id`: Associated project
- `prompt`: Generation prompt
- `code`: Generated code
- `language`: Programming language
- `framework`: Framework used
- `created_at`: Generation timestamp

---

## Feature Guides

### Code Generator

#### How It Works

1. **Access the Generator**
   - From Dashboard: Click "Code Generator"
   - Direct URL: `/editor/code`

2. **Configure Settings**
   - Select programming language (TypeScript, JavaScript, Python)
   - Choose framework (React, Next.js, Vue, Svelte)
   - Review default settings from your profile

3. **Write Your Prompt**
   - Be specific about requirements
   - Include design patterns you want
   - Mention any libraries or tools
   - Example: "Create a React component for a user profile card with name, email, and avatar image"

4. **Generate Code**
   - Click "Generate"
   - Wait for AI to produce code
   - Review the generated code
   - Copy or download as needed

#### Best Practices

- **Specific Prompts**: The more detailed your description, the better the output
- **Iterative Refinement**: Generate multiple versions and pick the best
- **Review Carefully**: Always review generated code before using
- **Add Comments**: The AI includes comments, but add more if needed
- **Test Thoroughly**: Test generated code in your project

#### Example Prompts

```
"Create a TypeScript React component that displays a list of todos. 
Include add, delete, and mark complete functionality. 
Use Tailwind CSS for styling and store data in React state."

"Generate a Next.js API route for user authentication. 
Use Supabase for database and JWT tokens. 
Include password hashing with bcryptjs."

"Create a Python function that parses CSV files and returns 
a list of dictionaries. Handle errors gracefully."
```

### Data Visualizations

#### Supported Chart Types

- **Bar Chart**: Compare values across categories
- **Line Chart**: Show trends over time
- **Pie Chart**: Display proportions of a whole
- **Area Chart**: Show volume and trends
- **Scatter Chart**: Find correlations between variables

#### Workflow

1. **Create New Visualization**
   - From Dashboard: Click "Visualizations"
   - Direct URL: `/editor/visualization`

2. **Upload Data**
   - CSV file format
   - JSON file format
   - Or paste raw JSON

3. **Configure Chart**
   - Select chart type
   - Choose X and Y axes
   - Customize colors
   - Add title and labels

4. **Export**
   - Download as PNG
   - Embed in presentations
   - Share as interactive HTML

#### Data Format Requirements

**CSV Format:**
```
Month,Sales,Expenses
January,45000,32000
February,52000,35000
March,48000,33000
```

**JSON Format:**
```json
[
  { "Month": "January", "Sales": 45000, "Expenses": 32000 },
  { "Month": "February", "Sales": 52000, "Expenses": 35000 }
]
```

### Presentations

#### Creating Presentations

1. **New Presentation**
   - From Dashboard: Click "Presentations"
   - Direct URL: `/editor/presentation`

2. **Add Slides**
   - Title slide for opening
   - Content slides with text and charts
   - Summary/conclusion slides

3. **Design Options**
   - Choose from preset themes
   - Customize colors and fonts
   - Add backgrounds

4. **Export**
   - Download as PowerPoint (.pptx)
   - Share online link
   - Download as PDF

#### Available Themes

- **Light**: Professional light theme
- **Dark**: Modern dark theme
- **Professional**: Blue corporate theme
- **Vibrant**: Colorful energetic theme

---

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: { "success": true, "user": {...}, "token": "..." }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: { "success": true, "user": {...}, "token": "..." }
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>

Response: { "success": true }
```

### Project Endpoints

#### Get Projects
```
GET /api/dashboard/projects
Authorization: Bearer <token>

Response: {
  "success": true,
  "projects": [
    {
      "id": "uuid",
      "name": "Project Name",
      "type": "code",
      "created_at": "2025-02-11T..."
    }
  ]
}
```

#### Create Project
```
POST /api/dashboard/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Project",
  "description": "Project description",
  "type": "code"
}

Response: { "success": true, "project": {...} }
```

### Code Generation Endpoint

```
POST /api/generate/code
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Create a React component...",
  "language": "typescript",
  "framework": "react"
}

Response: {
  "success": true,
  "code": "...",
  "explanation": "...",
  "dependencies": ["react", "react-dom"]
}
```

---

## Best Practices

### Code Organization

1. **Use TypeScript**
   - Provides type safety
   - Better IDE support
   - Catches errors early

2. **Follow Naming Conventions**
   - Components: PascalCase
   - Functions: camelCase
   - Constants: UPPER_SNAKE_CASE

3. **Component Structure**
   ```
   components/
   ├── ui/              # Reusable UI components
   ├── dashboard/       # Dashboard-specific
   ├── editor/          # Editor components
   └── layout/          # Layout components
   ```

### Data Visualization Best Practices

1. **Choose Appropriate Chart Types**
   - Trends: Line or Area
   - Comparisons: Bar
   - Parts of whole: Pie
   - Relationships: Scatter

2. **Label Everything**
   - Clear axis labels
   - Descriptive title
   - Legend if needed

3. **Color Selection**
   - Use max 5 distinct colors
   - Ensure contrast for accessibility
   - Consider colorblind-friendly palettes

### Presentation Tips

1. **Content Organization**
   - One idea per slide
   - Maximum 5 bullet points
   - Use visuals to support text

2. **Design Consistency**
   - Same fonts throughout
   - Consistent color scheme
   - Aligned elements

3. **File Optimization**
   - Compress images
   - Use web-optimized formats
   - Test file size before sharing

---

## Troubleshooting

### Authentication Issues

**Problem: Can't log in**
- Check email and password
- Verify email is registered
- Clear browser cache and cookies
- Try incognito/private mode

**Problem: Session expired**
- Log in again
- Check browser storage
- Verify no extensions blocking cookies

### Code Generation Issues

**Problem: Generated code has syntax errors**
- Review and fix manually
- Try rephrasing your prompt
- Specify the exact syntax you need

**Problem: Code doesn't match requirements**
- Be more specific in prompt
- Include code examples
- Specify exact libraries/versions

### Data Visualization Issues

**Problem: Chart not displaying data**
- Verify CSV/JSON format
- Check data types (numbers vs strings)
- Ensure X and Y axes selected

**Problem: Performance issues with large datasets**
- Reduce data size
- Use sampling/aggregation
- Export to static image

### General Issues

**Problem: Slow loading**
- Check internet speed
- Clear browser cache
- Try different browser
- Contact support

**Problem: File upload fails**
- Check file size limit (10MB max)
- Verify file format
- Try different file
- Check internet connection

### Getting Help

- **Documentation**: Visit docs section
- **Support**: Email support@buildstudio.io
- **Community**: Join our Discord
- **Bug Reports**: GitHub issues

---

## Conclusion

BuildStudio is designed to make software development faster and easier. Start with the tutorials, explore the features, and let the AI assist your development process. Happy building!

For more information, visit our website and documentation portal.
