'use client'

import { useState, useEffect } from 'react'
import { CategorySummary as CategorySummaryType } from './types'
import CategorySummary from '@/components/CategorySummary'
import GeneralSummary from '@/components/GeneralSummary'
import DateFilter from '@/components/DateFilter'
import Link from 'next/link'

export default function Home() {
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

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Panel de Gastos Personales
          </h1>
          <p className="text-gray-600 text-lg">
            Visualiza y gestiona tus gastos de manera eficiente
          </p>
        </div>

        {/* Filtro por fecha arriba */}
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
            {/* Grid con resumen por categoría a la izquierda y resumen general a la derecha */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <CategorySummary summary={summary} />
              </div>
              <div>
                <GeneralSummary summary={summary} />
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Acciones Rápidas
                  </h2>
                  <p className="text-gray-600">
                    Gestiona tus gastos y visualiza estadísticas
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/gastos"
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
                  >
                    Ver Todos los Gastos →
                  </Link>
                  <Link
                    href="/grafica"
                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg"
                  >
                    Ver Gráfica →
                  </Link>
                </div>
              </div>
            </div>

            {summary.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No hay gastos registrados
                </h3>
                <p className="text-gray-600 mb-6">
                  Comienza agregando tu primer gasto
                </p>
                <Link
                  href="/gastos"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Agregar Primer Gasto
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
