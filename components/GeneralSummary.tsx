'use client'

import { CategorySummary as CategorySummaryType } from '@/app/types'

interface GeneralSummaryProps {
  summary: CategorySummaryType[]
}

export default function GeneralSummary({ summary }: GeneralSummaryProps) {
  const total = summary.reduce((sum, item) => sum + item.total, 0)
  const totalCount = summary.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Resumen General</h2>
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Total de Gastos</span>
            <span className="text-2xl font-bold text-blue-600">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Total de Registros</p>
            <p className="text-xl font-semibold text-gray-800">{totalCount}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Categorías</p>
            <p className="text-xl font-semibold text-gray-800">{summary.length}</p>
          </div>
        </div>

        {summary.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Promedio por categoría</p>
            <p className="text-lg font-semibold text-gray-800">
              ${(total / summary.length).toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

