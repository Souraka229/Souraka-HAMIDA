'use client'

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ChartPreviewProps {
  data: any[]
  config: {
    type: string
    title: string
    xAxis: string
    yAxis: string
    color: string
  }
}

const COLORS = ['#0066FF', '#00D9FF', '#FF6B35', '#F7931E', '#FDB913']

export default function ChartPreview({ data, config }: ChartPreviewProps) {
  const chartHeight = 400

  // Prepare data - ensure numeric Y values
  const chartData = data.map((item) => ({
    ...item,
    [config.yAxis]: parseFloat(item[config.yAxis]) || 0,
  }))

  return (
    <div className="bg-dark-surface-alt rounded-lg p-6 border border-dark-surface-alt">
      <h2 className="font-bold text-lg mb-6">{config.title}</h2>

      <div className="w-full overflow-auto">
        {config.type === 'bar' && (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252D3D" />
              <XAxis
                dataKey={config.xAxis}
                stroke="#999"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#999" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1F2E',
                  border: '1px solid #252D3D',
                  borderRadius: '8px',
                }}
                cursor={{ fill: 'rgba(0, 102, 255, 0.1)' }}
              />
              <Legend />
              <Bar dataKey={config.yAxis} fill={config.color} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {config.type === 'line' && (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252D3D" />
              <XAxis
                dataKey={config.xAxis}
                stroke="#999"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#999" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1F2E',
                  border: '1px solid #252D3D',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={config.yAxis}
                stroke={config.color}
                strokeWidth={2}
                dot={{ fill: config.color, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {config.type === 'pie' && (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey={config.yAxis}
                nameKey={config.xAxis}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1F2E',
                  border: '1px solid #252D3D',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        {config.type === 'scatter' && (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#252D3D" />
              <XAxis
                dataKey={config.xAxis}
                stroke="#999"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#999" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1F2E',
                  border: '1px solid #252D3D',
                  borderRadius: '8px',
                }}
              />
              <Scatter name={config.yAxis} data={chartData} fill={config.color} />
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {config.type === 'area' && (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252D3D" />
              <XAxis
                dataKey={config.xAxis}
                stroke="#999"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#999" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1F2E',
                  border: '1px solid #252D3D',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey={config.yAxis}
                fill={config.color}
                stroke={config.color}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

function ChartBuilder() {
  return null
}

export { ChartBuilder }
