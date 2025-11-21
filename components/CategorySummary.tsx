'use client'

import { CategorySummary as CategorySummaryType } from '@/app/types'

interface CategorySummaryProps {
  summary: CategorySummaryType[]
}

export default function CategorySummary({ summary }: CategorySummaryProps) {
  const total = summary.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Resumen por Categoría</h2>
      <div className="space-y-3">
        {summary.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay gastos registrados</p>
        ) : (
          <>
            {summary.map((item) => (
              <div key={item.name} className="flex justify-between items-center py-3 px-3 rounded-md hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                </div>
                <span className="font-semibold text-gray-800">
                  ${item.total.toFixed(2)}
                </span>
              </div>
            ))}
            <div className="pt-4 mt-4 border-t-2 border-gray-300 bg-blue-50 rounded-md px-3 py-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-gray-800">Total</span>
                <span className="font-bold text-xl text-blue-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}



