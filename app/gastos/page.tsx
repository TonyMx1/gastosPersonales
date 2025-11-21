'use client'

import { useState, useEffect } from 'react'
import { Expense, Category, CategorySummary as CategorySummaryType } from '../types'
import ExpenseForm from '@/components/ExpenseForm'
import DateFilter from '@/components/DateFilter'
import { format } from 'date-fns'

export default function GastosPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    loadCategories()
    loadExpenses()
  }, [startDate, endDate])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
        
        // Si no hay categorías, inicializar las por defecto
        if (data.length === 0) {
          await fetch('/api/seed', { method: 'POST' })
          const newResponse = await fetch('/api/categories')
          if (newResponse.ok) {
            const newData = await newResponse.json()
            setCategories(newData)
          }
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadExpenses = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      
      const response = await fetch(`/api/expenses?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setExpenses(data)
      }
    } catch (error) {
      console.error('Error loading expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este gasto?')) {
      return
    }

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadExpenses()
      } else {
        alert('Error al eliminar el gasto')
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('Error al eliminar el gasto')
    }
  }

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingExpense(null)
  }

  const handleFormSave = () => {
    loadExpenses()
    handleFormClose()
  }

  const handleCategoryAdded = (newCategory: Category) => {
    setCategories([...categories, newCategory])
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
            Lista de Gastos
          </h1>
          <p className="text-gray-600 text-lg">
            Gestiona todos tus gastos registrados
          </p>
        </div>

        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClear={handleClearFilter}
        />

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Todos los Gastos
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              + Nuevo Gasto
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-4">Cargando gastos...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg mb-4">No hay gastos registrados</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Agregar Primer Gasto
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Fecha</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Categoría</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Descripción</th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-700">Monto</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-gray-700">
                        {format(new Date(expense.date), 'dd/MM/yyyy')}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                          {expense.category.name}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {expense.description || <span className="text-gray-400">-</span>}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-800 text-lg">
                        ${expense.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-md"
                            title="Editar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-md"
                            title="Eliminar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          categories={categories}
          onSave={handleFormSave}
          onCancel={handleFormClose}
          onCategoryAdded={handleCategoryAdded}
        />
      )}
    </div>
  )
}

