'use client'

interface Slide {
  id: string
  title: string
  subtitle?: string
  content: string
  layout: 'title' | 'content' | 'two-column'
  backgroundColor?: string
}

interface SlideEditorProps {
  slide: Slide
  onUpdate: (updates: Partial<Slide>) => void
}

export default function SlideEditor({ slide, onUpdate }: SlideEditorProps) {
  return (
    <div className="bg-dark-surface-alt rounded-lg p-6 space-y-4">
      <h2 className="font-bold text-lg mb-4">Edit Slide</h2>

      <div>
        <label className="block text-sm font-medium mb-2">Layout</label>
        <select
          value={slide.layout}
          onChange={(e) => onUpdate({ layout: e.target.value as any })}
          className="w-full px-3 py-2 bg-dark-surface border border-dark-surface-alt rounded-lg focus:border-primary transition"
        >
          <option value="title">Title Slide</option>
          <option value="content">Content</option>
          <option value="two-column">Two Column</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={slide.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 bg-dark-surface border border-dark-surface-alt rounded-lg focus:border-primary transition"
        />
      </div>

      {slide.layout === 'title' && (
        <div>
          <label className="block text-sm font-medium mb-2">Subtitle</label>
          <input
            type="text"
            value={slide.subtitle || ''}
            onChange={(e) => onUpdate({ subtitle: e.target.value })}
            className="w-full px-3 py-2 bg-dark-surface border border-dark-surface-alt rounded-lg focus:border-primary transition"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <textarea
          value={slide.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Enter slide content..."
          className="w-full h-32 px-3 py-2 bg-dark-surface border border-dark-surface-alt rounded-lg focus:border-primary transition resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Background Color</label>
        <input
          type="color"
          value={slide.backgroundColor || '#1A1F2E'}
          onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
          className="w-full h-10 rounded-lg cursor-pointer"
        />
      </div>
    </div>
  )
}
