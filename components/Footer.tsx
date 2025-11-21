'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-light mt-auto py-4 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <p className="mb-0 text-base">
            © {currentYear} <strong>FinanzasPro S.A.</strong> - Todos los derechos reservados
          </p>
          <p className="mb-0 text-muted small mt-2">
            Sistema de Gestión de Gastos Personales
          </p>
        </div>
      </div>
    </footer>
  )
}

