import { NextResponse } from 'next/server'
import { getCategories, createCategory } from '@/lib/firebase-helpers'

// Endpoint para inicializar categorías por defecto
export async function POST() {
  try {
    const defaultCategories = [
      { name: 'Alimentación', description: 'Gastos en comida y bebida' },
      { name: 'Transporte', description: 'Gastos en transporte' },
      { name: 'Entretenimiento', description: 'Gastos en entretenimiento' },
      { name: 'Salud', description: 'Gastos en salud y medicinas' },
      { name: 'Educación', description: 'Gastos en educación' },
      { name: 'Vivienda', description: 'Gastos en vivienda y servicios' },
      { name: 'Otros', description: 'Otros gastos' },
    ]

    // Obtener categorías existentes
    const existingCategories = await getCategories()
    const existingNames = new Set(existingCategories.map(cat => cat.name.toLowerCase()))

    // Crear solo las categorías que no existen
    const created = []
    for (const category of defaultCategories) {
      if (!existingNames.has(category.name.toLowerCase())) {
        await createCategory(category)
        created.push(category.name)
      }
    }

    return NextResponse.json({ 
      message: 'Categorías inicializadas correctamente',
      created: created.length > 0 ? created : 'Todas las categorías ya existían'
    })
  } catch (error) {
    console.error('Error seeding categories:', error)
    return NextResponse.json(
      { error: 'Error al inicializar las categorías' },
      { status: 500 }
    )
  }
}
