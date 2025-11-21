import { NextRequest, NextResponse } from 'next/server'
import { getCategorySummary } from '@/lib/firebase-helpers'

// GET - Obtener resumen por categoría
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const filters: { startDate?: string; endDate?: string } = {}
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate

    const summary = await getCategorySummary(filters)
    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error fetching category summary:', error)
    return NextResponse.json(
      { error: 'Error al obtener el resumen por categoría' },
      { status: 500 }
    )
  }
}
