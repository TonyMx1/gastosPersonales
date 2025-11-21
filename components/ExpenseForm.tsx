'use client'

import { useState, useEffect } from 'react'
import { Expense, Category } from '@/app/types'

interface ExpenseFormProps {
  expense?: Expense | null
  categories: Category[]
  onSave: () => void
  onCancel: () => void
  onCategoryAdded?: (category: Category) => void
}

export default function ExpenseForm({ expense, categories, onSave, onCancel, onCategoryAdded }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    date: '',
    description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [availableCategories, setAvailableCategories] = useState<Category[]>(categories)

  useEffect(() => {
    setAvailableCategories(categories)
  }, [categories])

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        categoryId: expense.categoryId.toString(),
        date: new Date(expense.date).toISOString().split('T')[0],
        description: expense.description || '',
      })
    } else {
      setFormData({
        amount: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      })
    }
  }, [expense])

  const handleCategorySelect = (value: string) => {
    if (value === 'new') {
      setShowNewCategory(true)
      setFormData({ ...formData, categoryId: '' })
    } else {
      setShowNewCategory(false)
      setFormData({ ...formData, categoryId: value })
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Por favor ingrese un nombre para la categoría')
      return
    }

    setIsCreatingCategory(true)
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          description: null,
        }),
      })

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError)
        throw new Error('Error al procesar la respuesta del servidor')
      }

      if (!response.ok) {
        const errorMessage = data?.error || `Error al crear la categoría (${response.status})`
        throw new Error(errorMessage)
      }

      const newCategory = data
      if (!newCategory || !newCategory.id) {
        throw new Error('La categoría se creó pero no se recibió correctamente')
      }

      setAvailableCategories([...availableCategories, newCategory])
      setFormData({ ...formData, categoryId: newCategory.id })
      setShowNewCategory(false)
      setNewCategoryName('')
      
      if (onCategoryAdded) {
        onCategoryAdded(newCategory)
      }
    } catch (error) {
      console.error('Error creating category:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al crear la categoría. Por favor, verifique que el nombre no esté duplicado y que la conexión a la base de datos esté funcionando.'
      alert(errorMessage)
    } finally {
      setIsCreatingCategory(false)
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'El monto debe ser un número positivo'
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'La categoría es requerida'
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      const url = expense
        ? `/api/expenses/${expense.id}`
        : '/api/expenses'
      const method = expense ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al guardar el gasto')
      }

      onSave()
    } catch (error) {
      console.error('Error saving expense:', error)
      alert(error instanceof Error ? error.message : 'Error al guardar el gasto')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {expense ? 'Editar Gasto' : 'Nuevo Gasto'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Monto *
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md text-gray-900 bg-white ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría *
            </label>
            <select
              id="categoryId"
              value={showNewCategory ? 'new' : formData.categoryId}
              onChange={(e) => handleCategorySelect(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md text-gray-900 bg-white ${
                errors.categoryId ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Seleccione una categoría</option>
              {availableCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              <option value="new">+ Agregar nueva categoría</option>
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
            )}
          </div>

          {showNewCategory && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <label htmlFor="newCategoryName" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la nueva categoría *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="newCategoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Ropa, Tecnología, etc."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleCreateCategory()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={isCreatingCategory || !newCategoryName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreatingCategory ? '...' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategory(false)
                    setNewCategoryName('')
                    setFormData({ ...formData, categoryId: '' })
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha *
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md text-gray-900 bg-white ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción opcional del gasto"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
