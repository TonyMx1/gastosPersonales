import { NextRequest, NextResponse } from 'next/server'
import { getCategories, createCategory } from '@/lib/firebase-helpers'

// GET - Obtener todas las categorías
export async function GET() {
  try {
    const categories = await getCategories()
    // Ordenar por nombre
    categories.sort((a, b) => a.name.localeCompare(b.name))
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Error al obtener las categorías' },
      { status: 500 }
    )
  }
}

// POST - Crear una nueva categoría
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'El nombre de la categoría es requerido y debe ser un texto válido' },
        { status: 400 }
      )
    }

    const trimmedName = name.trim()

    // Verificar si la categoría ya existe
    try {
      const categories = await getCategories()
      const existingCategory = categories.find(cat => cat.name.toLowerCase() === trimmedName.toLowerCase())
      
      if (existingCategory) {
        return NextResponse.json(
          { error: 'Ya existe una categoría con ese nombre' },
          { status: 400 }
        )
      }
    } catch (findError: any) {
      console.error('Error checking existing category:', findError)
      // Continuar con la creación si hay un error al buscar
    }

    const category = await createCategory({
      name: trimmedName,
      description: description || null,
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error('Error creating category:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    })
    
    return NextResponse.json(
      { 
        error: 'Error al crear la categoría',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
