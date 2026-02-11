'use client'

import { useState } from 'react'
import { Upload, Database } from 'lucide-react'
import Papa from 'papaparse'

interface DataSourceManagerProps {
  onDataUpload: (data: any) => void
}

export default function DataSourceManager({ onDataUpload }: DataSourceManagerProps) {
  const [loading, setLoading] = useState(false)

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)

    Papa.parse(file, {
      complete: (results: any) => {
        const columns = results.data[0] || []
        const data = results.data.slice(1).filter((row: any) => row.some((cell: any) => cell))

        onDataUpload({
          type: 'csv',
          filename: file.name,
          columns,
          data: data.map((row: any) =>
            Object.fromEntries(columns.map((col: string, idx: number) => [col, row[idx]]))
          ),
        })
        setLoading(false)
      },
    })
  }

  const handleJSONUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        const isArray = Array.isArray(json)
        const dataArray = isArray ? json : [json]

        const columns = Object.keys(dataArray[0] || {})

        onDataUpload({
          type: 'json',
          filename: file.name,
          columns,
          data: dataArray,
        })
        setLoading(false)
      } catch (error) {
        alert('Invalid JSON file')
        setLoading(false)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="bg-dark-surface-alt rounded-lg p-6">
      <h2 className="font-bold mb-4 flex items-center gap-2">
        <Database size={20} />
        Data Source
      </h2>

      <div className="space-y-3">
        <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-dark-surface-alt rounded-lg hover:border-primary cursor-pointer transition bg-dark-surface/50">
          <Upload size={18} />
          <span className="text-sm">Upload CSV</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
            disabled={loading}
          />
        </label>

        <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-dark-surface-alt rounded-lg hover:border-primary cursor-pointer transition bg-dark-surface/50">
          <Upload size={18} />
          <span className="text-sm">Upload JSON</span>
          <input
            type="file"
            accept=".json"
            onChange={handleJSONUpload}
            className="hidden"
            disabled={loading}
          />
        </label>
      </div>

      {loading && (
        <div className="mt-3 text-center">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  )
}
