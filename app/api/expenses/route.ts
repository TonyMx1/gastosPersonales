import { NextRequest, NextResponse } from 'next/server'
import { getExpenses, createExpense } from '@/lib/firebase-helpers'

// GET - Obtener todos los gastos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const filters: { startDate?: string; endDate?: string } = {}
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate

    const expenses = await getExpenses(filters)
    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { error: 'Error al obtener los gastos' },
      { status: 500 }
    )
  }
}

// POST - Crear un nuevo gasto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, categoryId, date, description } = body

    // Validaciones
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'El monto debe ser un número positivo' },
        { status: 400 }
      )
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: 'La categoría es requerida' },
        { status: 400 }
      )
    }

    if (!date) {
      return NextResponse.json(
        { error: 'La fecha es requerida' },
        { status: 400 }
      )
    }

    const expenseDate = new Date(date)
    if (isNaN(expenseDate.getTime())) {
      return NextResponse.json(
        { error: 'La fecha no es válida' },
        { status: 400 }
      )
    }

    const expense = await createExpense({
      amount: parseFloat(amount),
      categoryId: categoryId.toString(),
      date: expenseDate,
      description: description || null,
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error: any) {
    console.error('Error creating expense:', error)
    
    // Mensajes de error más específicos
    if (error.message?.includes('Firestore no está habilitado')) {
      return NextResponse.json(
        { 
          error: 'Firestore no está habilitado. Por favor, habilita Firestore Database en Firebase Console.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      )
    }
    
    if (error.message?.includes('Permiso denegado')) {
      return NextResponse.json(
        { 
          error: 'Permiso denegado. Verifica las reglas de seguridad de Firestore.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error.message || 'Error al crear el gasto',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
