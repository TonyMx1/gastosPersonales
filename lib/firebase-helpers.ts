import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint
} from 'firebase/firestore'
import { db } from './firebase'

// Tipos
export interface Category {
  id: string
  name: string
  description?: string | null
}

export interface Expense {
  id: string
  amount: number
  categoryId: string
  category: Category
  date: Date
  description?: string | null
  createdAt: Date
  updatedAt: Date
}

// Helper para convertir Firestore Timestamp a Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate()
  }
  if (timestamp?.seconds) {
    return new Date(timestamp.seconds * 1000)
  }
  return new Date(timestamp)
}

// Helper para convertir Date a Firestore Timestamp
const dateToTimestamp = (date: Date | string) => {
  const dateObj = date instanceof Date ? date : new Date(date)
  return Timestamp.fromDate(dateObj)
}

// ============ CATEGORÍAS ============

export const getCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, 'categories')
    const snapshot = await getDocs(categoriesRef)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Category))
  } catch (error) {
    console.error('Error getting categories:', error)
    throw error
  }
}

export const getCategory = async (id: string): Promise<Category | null> => {
  try {
    const categoryRef = doc(db, 'categories', id)
    const categorySnap = await getDoc(categoryRef)
    
    if (!categorySnap.exists()) {
      return null
    }
    
    return {
      id: categorySnap.id,
      ...categorySnap.data()
    } as Category
  } catch (error) {
    console.error('Error getting category:', error)
    throw error
  }
}

export const createCategory = async (data: Omit<Category, 'id'>): Promise<Category> => {
  try {
    const categoriesRef = collection(db, 'categories')
    const docRef = await addDoc(categoriesRef, data)
    
    return {
      id: docRef.id,
      ...data
    } as Category
  } catch (error: any) {
    console.error('Error creating category:', error)
    
    // Mejorar mensajes de error
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
      throw new Error(
        'Firestore no está habilitado o no está configurado correctamente. ' +
        'Por favor, verifica que Firestore esté habilitado en tu proyecto de Firebase y que las reglas de seguridad permitan escritura.'
      )
    }
    
    if (error.code === 'permission-denied') {
      throw new Error(
        'Permiso denegado. Por favor, verifica las reglas de seguridad de Firestore.'
      )
    }
    
    throw error
  }
}

export const updateCategory = async (id: string, data: Partial<Category>): Promise<void> => {
  try {
    const categoryRef = doc(db, 'categories', id)
    await updateDoc(categoryRef, data)
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const categoryRef = doc(db, 'categories', id)
    await deleteDoc(categoryRef)
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}

// ============ GASTOS ============

export const getExpenses = async (filters?: {
  startDate?: string
  endDate?: string
}): Promise<Expense[]> => {
  try {
    const expensesRef = collection(db, 'expenses')
    let q
    
    // Firestore requiere que orderBy esté después de where cuando se usan filtros
    if (filters?.startDate && filters?.endDate) {
      // Ambos filtros
      q = query(
        expensesRef,
        where('date', '>=', dateToTimestamp(filters.startDate)),
        where('date', '<=', dateToTimestamp(filters.endDate)),
        orderBy('date', 'desc')
      )
    } else if (filters?.startDate) {
      // Solo fecha inicio
      q = query(
        expensesRef,
        where('date', '>=', dateToTimestamp(filters.startDate)),
        orderBy('date', 'desc')
      )
    } else if (filters?.endDate) {
      // Solo fecha fin
      q = query(
        expensesRef,
        where('date', '<=', dateToTimestamp(filters.endDate)),
        orderBy('date', 'desc')
      )
    } else {
      // Sin filtros
      q = query(expensesRef, orderBy('date', 'desc'))
    }
    
    const snapshot = await getDocs(q)
    
    // Obtener categorías para hacer join
    const categories = await getCategories()
    const categoriesMap = new Map(categories.map(cat => [cat.id, cat]))
    
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        amount: data.amount,
        categoryId: data.categoryId,
        category: categoriesMap.get(data.categoryId) || { id: data.categoryId, name: 'Desconocida' },
        date: timestampToDate(data.date),
        description: data.description || null,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
      } as Expense
    })
  } catch (error) {
    console.error('Error getting expenses:', error)
    throw error
  }
}

export const getExpense = async (id: string): Promise<Expense | null> => {
  try {
    const expenseRef = doc(db, 'expenses', id)
    const expenseSnap = await getDoc(expenseRef)
    
    if (!expenseSnap.exists()) {
      return null
    }
    
    const data = expenseSnap.data()
    const category = await getCategory(data.categoryId)
    
    return {
      id: expenseSnap.id,
      amount: data.amount,
      categoryId: data.categoryId,
      category: category || { id: data.categoryId, name: 'Desconocida' },
      date: timestampToDate(data.date),
      description: data.description || null,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as Expense
  } catch (error) {
    console.error('Error getting expense:', error)
    throw error
  }
}

export const createExpense = async (data: {
  amount: number
  categoryId: string
  date: Date | string
  description?: string | null
}): Promise<Expense> => {
  try {
    // Validar que categoryId existe
    const category = await getCategory(data.categoryId)
    if (!category) {
      throw new Error(`La categoría con ID ${data.categoryId} no existe`)
    }

    const expensesRef = collection(db, 'expenses')
    const now = Timestamp.now()
    
    const expenseData = {
      amount: data.amount,
      categoryId: data.categoryId,
      date: dateToTimestamp(data.date),
      description: data.description || null,
      createdAt: now,
      updatedAt: now,
    }
    
    const docRef = await addDoc(expensesRef, expenseData)
    
    return {
      id: docRef.id,
      amount: data.amount,
      categoryId: data.categoryId,
      category: category,
      date: data.date instanceof Date ? data.date : new Date(data.date),
      description: data.description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Expense
  } catch (error: any) {
    console.error('Error creating expense:', error)
    
    // Mejorar mensajes de error
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
      throw new Error(
        'Firestore no está habilitado o no está configurado correctamente. ' +
        'Por favor, verifica que Firestore esté habilitado en tu proyecto de Firebase y que las reglas de seguridad permitan escritura.'
      )
    }
    
    if (error.code === 'permission-denied') {
      throw new Error(
        'Permiso denegado. Por favor, verifica las reglas de seguridad de Firestore.'
      )
    }
    
    throw error
  }
}

export const updateExpense = async (id: string, data: {
  amount?: number
  categoryId?: string
  date?: Date | string
  description?: string | null
}): Promise<void> => {
  try {
    const expenseRef = doc(db, 'expenses', id)
    const updateData: any = {
      updatedAt: Timestamp.now(),
    }
    
    if (data.amount !== undefined) updateData.amount = data.amount
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId
    if (data.date !== undefined) updateData.date = dateToTimestamp(data.date)
    if (data.description !== undefined) updateData.description = data.description
    
    await updateDoc(expenseRef, updateData)
  } catch (error) {
    console.error('Error updating expense:', error)
    throw error
  }
}

export const deleteExpense = async (id: string): Promise<void> => {
  try {
    const expenseRef = doc(db, 'expenses', id)
    await deleteDoc(expenseRef)
  } catch (error) {
    console.error('Error deleting expense:', error)
    throw error
  }
}

// ============ RESUMEN POR CATEGORÍA ============

export const getCategorySummary = async (filters?: {
  startDate?: string
  endDate?: string
}): Promise<Array<{ name: string; total: number; count: number }>> => {
  try {
    const expenses = await getExpenses(filters)
    const summary = new Map<string, { total: number; count: number }>()
    
    expenses.forEach(expense => {
      const categoryName = expense.category.name
      const current = summary.get(categoryName) || { total: 0, count: 0 }
      summary.set(categoryName, {
        total: current.total + expense.amount,
        count: current.count + 1,
      })
    })
    
    return Array.from(summary.entries()).map(([name, data]) => ({
      name,
      ...data,
    }))
  } catch (error) {
    console.error('Error getting category summary:', error)
    throw error
  }
}

