'use client'

interface Slide {
  id: string
  title: string
  subtitle?: string
  content: string
  layout: 'title' | 'content' | 'two-column'
  backgroundColor?: string
}

interface SlidePreviewProps {
  slide: Slide
}

export default function SlidePreview({ slide }: SlidePreviewProps) {
  const bgColor = slide.backgroundColor || '#1A1F2E'

  return (
    <div className="bg-dark-surface-alt rounded-lg p-6 overflow-hidden">
      <h2 className="font-bold text-lg mb-4">Preview</h2>

      <div
        className="aspect-video rounded-lg overflow-hidden flex flex-col items-center justify-center p-8 text-center"
        style={{ backgroundColor: bgColor }}
      >
        {slide.layout === 'title' && (
          <>
            <h1 className="text-4xl font-bold mb-4">{slide.title}</h1>
            {slide.subtitle && (
              <p className="text-xl text-gray-300">{slide.subtitle}</p>
            )}
          </>
        )}

        {slide.layout === 'content' && (
          <>
            <h2 className="text-3xl font-bold mb-6">{slide.title}</h2>
            <div className="text-left max-w-lg">
              <p className="text-gray-200 whitespace-pre-wrap">{slide.content}</p>
            </div>
          </>
        )}

        {slide.layout === 'two-column' && (
          <div className="w-full grid grid-cols-2 gap-8">
            <div className="text-left">
              <h2 className="text-2xl font-bold mb-4">{slide.title}</h2>
              <p className="text-gray-200 text-sm">{slide.content}</p>
            </div>
            <div className="bg-dark-surface rounded-lg p-4 flex items-center justify-center text-gray-400 text-sm">
              [Chart / Image Area]
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
