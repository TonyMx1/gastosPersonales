'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CategorySummary as CategorySummaryType } from '@/app/types'

interface ExpensesChartProps {
  data: CategorySummaryType[]
}

export default function ExpensesChart({ data }: ExpensesChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Gráfica de Gastos</h2>
        <p className="text-gray-500 text-center py-8">No hay datos para mostrar</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Gráfica de Gastos por Categoría</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number) => `$${value.toFixed(2)}`}
            labelStyle={{ color: '#374151' }}
          />
          <Legend />
          <Bar dataKey="total" fill="#3b82f6" name="Total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}



