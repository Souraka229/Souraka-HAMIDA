import { streamText, Output } from 'ai'
import { z } from 'zod'

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const { prompt, framework = 'react', language = 'typescript' } = await request.json()

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const systemPrompt = `You are an expert code generator. Generate clean, professional, production-ready code.
    
Requirements:
- Write modular, well-structured code
- Include proper error handling
- Add helpful comments for complex logic
- Follow best practices for the framework/language
- Make code easily copyable and reusable
- Use TypeScript when appropriate
- Include JSDoc comments for functions
- Ensure code is optimized for performance

Framework: ${framework}
Language: ${language}

Always provide:
1. The main code
2. Dependencies (if needed)
3. Installation instructions
4. Usage examples`

    const result = streamText({
      model: 'openai/gpt-4-turbo',
      system: systemPrompt,
      prompt: `Generate code for: ${prompt}
      
Format the response as:
## Code
\`\`\`${language === 'typescript' ? 'tsx' : language}\n[Your code here]\n\`\`\`

## Dependencies
- [list any required packages]

## Installation
\`\`\`bash
npm install [packages]
\`\`\`

## Usage
[Usage examples]`,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Code generation error:', error)
    return new Response(
      JSON.stringify({ error: 'Code generation failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
