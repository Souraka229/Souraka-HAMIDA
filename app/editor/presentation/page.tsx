'use client'

import { useState } from 'react'
import { Plus, Download, Eye } from 'lucide-react'
import SlideEditor from '@/components/presentation/SlideEditor'
import SlidePreview from '@/components/presentation/SlidePreview'

interface Slide {
  id: string
  title: string
  subtitle?: string
  content: string
  layout: 'title' | 'content' | 'two-column'
  backgroundColor?: string
}

export default function PresentationPage() {
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: '1',
      title: 'Presentation Title',
      subtitle: 'Your subtitle here',
      content: '',
      layout: 'title',
    },
  ])
  const [selectedSlideId, setSelectedSlideId] = useState('1')
  const [presentationTitle, setPresentationTitle] = useState('My Presentation')

  const selectedSlide = slides.find((s) => s.id === selectedSlideId)

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: 'New Slide',
      content: '',
      layout: 'content',
    }
    setSlides([...slides, newSlide])
    setSelectedSlideId(newSlide.id)
  }

  const handleUpdateSlide = (updates: Partial<Slide>) => {
    setSlides(
      slides.map((s) =>
        s.id === selectedSlideId ? { ...s, ...updates } : s
      )
    )
  }

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) return
    const newSlides = slides.filter((s) => s.id !== id)
    setSlides(newSlides)
    setSelectedSlideId(newSlides[0].id)
  }

  const handleExportPPTX = async () => {
    try {
      const response = await fetch('/api/export/presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: presentationTitle,
          slides,
        }),
      })

      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${presentationTitle}.pptx`
      a.click()
    } catch (error) {
      alert('Failed to export presentation')
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <input
              type="text"
              value={presentationTitle}
              onChange={(e) => setPresentationTitle(e.target.value)}
              className="text-3xl font-bold bg-transparent border-none focus:outline-none px-0"
            />
            <p className="text-gray-400 text-sm">{slides.length} slides</p>
          </div>
          <button
            onClick={handleExportPPTX}
            className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-orange-600 transition"
          >
            <Download size={18} />
            Export to PowerPoint
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Slides Panel */}
          <div className="lg:col-span-1 space-y-4 max-h-screen overflow-y-auto">
            <button
              onClick={handleAddSlide}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={18} />
              Add Slide
            </button>

            <div className="space-y-2">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  onClick={() => setSelectedSlideId(slide.id)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedSlideId === slide.id
                      ? 'bg-primary/20 border border-primary'
                      : 'bg-dark-surface-alt border border-dark-surface-alt hover:border-primary'
                  }`}
                >
                  <div className="text-sm font-medium truncate">{slide.title}</div>
                  <div className="text-xs text-gray-500">Slide {idx + 1}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Editor & Preview */}
          <div className="lg:col-span-3">
            {selectedSlide && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SlideEditor slide={selectedSlide} onUpdate={handleUpdateSlide} />
                <SlidePreview slide={selectedSlide} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
