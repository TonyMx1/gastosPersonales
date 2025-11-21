'use client'

import { useState, useEffect } from 'react'
import { CategorySummary as CategorySummaryType } from '../types'
import ExpensesChart from '@/components/ExpensesChart'
import DateFilter from '@/components/DateFilter'
import Link from 'next/link'

export default function GraficaPage() {
  const [summary, setSummary] = useState<CategorySummaryType[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    loadSummary()
  }, [startDate, endDate])

  const loadSummary = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      
      const response = await fetch(`/api/summary?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setSummary(data)
      }
    } catch (error) {
      console.error('Error loading summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClearFilter = () => {
    setStartDate('')
    setEndDate('')
  }

  const total = summary.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Gráfica de Gastos
          </h1>
          <p className="text-gray-600 text-lg">
            Visualiza tus gastos por categoría de forma gráfica
          </p>
        </div>

        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClear={handleClearFilter}
        />

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-4">Cargando datos...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <ExpensesChart data={summary} />
            </div>

            {summary.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Resumen de la Gráfica</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total de Gastos</p>
                    <p className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Categorías</p>
                    <p className="text-2xl font-bold text-green-600">{summary.length}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Promedio</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ${(total / summary.length).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {summary.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No hay datos para mostrar
                </h3>
                <p className="text-gray-600 mb-6">
                  Agrega gastos para ver la gráfica
                </p>
                <Link
                  href="/gastos"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Agregar Gasto
                </Link>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Volver al Inicio
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

