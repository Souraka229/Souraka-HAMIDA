'use client'

import { useState } from 'react'
import { ChartType, ChartConfig } from '@/lib/types'

interface ChartBuilderProps {
  data: any[]
  onConfigChange: (config: ChartConfig) => void
}

export function ChartBuilder({ data, onConfigChange }: ChartBuilderProps) {
  const [chartType, setChartType] = useState<ChartType>('bar')
  const [xAxis, setXAxis] = useState<string>('')
  const [yAxis, setYAxis] = useState<string>('')
  const [colors, setColors] = useState({
    primary: '#3b82f6',
    secondary: '#10b981',
  })

  const columns = data.length > 0 ? Object.keys(data[0]) : []

  const handleConfigChange = () => {
    onConfigChange({
      type: chartType,
      xAxis,
      yAxis,
      colors,
    })
  }

  return (
    <div className="space-y-6 p-6 bg-background rounded-lg border border-border">
      <div>
        <label className="block text-sm font-medium mb-2">Chart Type</label>
        <select
          value={chartType}
          onChange={(e) => {
            setChartType(e.target.value as ChartType)
            handleConfigChange()
          }}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="area">Area Chart</option>
          <option value="scatter">Scatter Chart</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">X Axis</label>
        <select
          value={xAxis}
          onChange={(e) => {
            setXAxis(e.target.value)
            handleConfigChange()
          }}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="">Select column...</option>
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Y Axis</label>
        <select
          value={yAxis}
          onChange={(e) => {
            setYAxis(e.target.value)
            handleConfigChange()
          }}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="">Select column...</option>
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Primary Color</label>
          <input
            type="color"
            value={colors.primary}
            onChange={(e) => {
              setColors({ ...colors, primary: e.target.value })
              handleConfigChange()
            }}
            className="w-full h-10 rounded-md cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Secondary Color</label>
          <input
            type="color"
            value={colors.secondary}
            onChange={(e) => {
              setColors({ ...colors, secondary: e.target.value })
              handleConfigChange()
            }}
            className="w-full h-10 rounded-md cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
