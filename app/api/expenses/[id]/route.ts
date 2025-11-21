import { NextRequest, NextResponse } from 'next/server'
import { getExpense, updateExpense, deleteExpense } from '@/lib/firebase-helpers'

// GET - Obtener un gasto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const expense = await getExpense(params.id)

    if (!expense) {
      return NextResponse.json(
        { error: 'Gasto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(expense)
  } catch (error) {
    console.error('Error fetching expense:', error)
    return NextResponse.json(
      { error: 'Error al obtener el gasto' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar un gasto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await updateExpense(params.id, {
      amount: parseFloat(amount),
      categoryId: categoryId.toString(),
      date: expenseDate,
      description: description || null,
    })

    // Obtener el gasto actualizado
    const updatedExpense = await getExpense(params.id)
    return NextResponse.json(updatedExpense)
  } catch (error) {
    console.error('Error updating expense:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el gasto' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un gasto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteExpense(params.id)
    return NextResponse.json({ message: 'Gasto eliminado correctamente' })
  } catch (error) {
    console.error('Error deleting expense:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el gasto' },
      { status: 500 }
    )
  }
}
