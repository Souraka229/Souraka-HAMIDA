import { NextRequest, NextResponse } from 'next/server'

// For now, return a simple structured representation
// In production, you'd use a library like pptxgen-js to create actual PPTX files
export async function POST(request: NextRequest) {
  try {
    const { title, slides } = await request.json()

    if (!slides || slides.length === 0) {
      return NextResponse.json(
        { error: 'No slides provided' },
        { status: 400 }
      )
    }

    // Create a simple PPTX structure (simplified for now)
    // In production, use pptxgen-js library
    const presentationData = {
      name: title,
      slides: slides.map((slide: any) => ({
        title: slide.title,
        subtitle: slide.subtitle,
        content: slide.content,
        layout: slide.layout,
        backgroundColor: slide.backgroundColor,
      })),
    }

    // Return as JSON for now (can be extended to generate real PPTX)
    const buffer = Buffer.from(JSON.stringify(presentationData))

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${title}.json"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    )
  }
}
