'use client'

import { useState } from 'react'
import { Upload, Plus, Trash2 } from 'lucide-react'
import DataSourceManager from '@/components/visualization/DataSourceManager'
import ChartBuilder from '@/components/visualization/ChartBuilder'
import ChartPreview from '@/components/visualization/ChartPreview'

export default function VisualizationPage() {
  const [dataSource, setDataSource] = useState<any>(null)
  const [chartConfig, setChartConfig] = useState({
    type: 'bar',
    title: 'Chart',
    xAxis: '',
    yAxis: '',
    color: '#0066FF',
  })

  const handleDataUpload = (data: any) => {
    setDataSource(data)
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Visualization Builder</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Data & Config */}
          <div className="lg:col-span-1 space-y-6">
            <DataSourceManager onDataUpload={handleDataUpload} />

            {dataSource && (
              <div className="bg-dark-surface-alt rounded-lg p-4">
                <h3 className="font-bold mb-4">Chart Configuration</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Chart Type</label>
                    <select
                      value={chartConfig.type}
                      onChange={(e) =>
                        setChartConfig({ ...chartConfig, type: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-dark-surface border border-dark-surface-alt rounded-lg focus:border-primary transition"
                    >
                      <option value="bar">Bar Chart</option>
                      <option value="line">Line Chart</option>
                      <option value="pie">Pie Chart</option>
                      <option value="scatter">Scatter Plot</option>
                      <option value="area">Area Chart</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={chartConfig.title}
                      onChange={(e) =>
                        setChartConfig({ ...chartConfig, title: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-dark-surface border border-dark-surface-alt rounded-lg focus:border-primary transition"
                    />
                  </div>

                  {chartConfig.type !== 'pie' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">X Axis</label>
                        <select
                          value={chartConfig.xAxis}
                          onChange={(e) =>
                            setChartConfig({ ...chartConfig, xAxis: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-dark-surface border border-dark-surface-alt rounded-lg focus:border-primary transition"
                        >
                          <option value="">Select field</option>
                          {dataSource.columns?.map((col: string) => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Y Axis</label>
                        <select
                          value={chartConfig.yAxis}
                          onChange={(e) =>
                            setChartConfig({ ...chartConfig, yAxis: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-dark-surface border border-dark-surface-alt rounded-lg focus:border-primary transition"
                        >
                          <option value="">Select field</option>
                          {dataSource.columns?.map((col: string) => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-3">
            {dataSource && chartConfig.xAxis && chartConfig.yAxis ? (
              <ChartPreview data={dataSource.data} config={chartConfig} />
            ) : (
              <div className="border-2 border-dashed border-dark-surface-alt rounded-lg p-12 text-center">
                <p className="text-gray-500">Upload data and configure chart to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
