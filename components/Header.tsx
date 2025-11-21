'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              💰 Gastos Personales
            </Link>
          </div>
          <nav className="flex space-x-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-md transition-colors ${
                pathname === '/'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/gastos"
              className={`px-4 py-2 rounded-md transition-colors ${
                pathname === '/gastos'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Lista de Gastos
            </Link>
            <Link
              href="/grafica"
              className={`px-4 py-2 rounded-md transition-colors ${
                pathname === '/grafica'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Gráfica
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

