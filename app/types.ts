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
  date: string
  description?: string | null
  createdAt: string
  updatedAt: string
}

export interface CategorySummary {
  name: string
  total: number
  count: number
}



