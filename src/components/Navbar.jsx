import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { totalItens } = useCart()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-semibold text-blue-600">VivaLar</Link>

      <div className="flex items-center gap-4">
        {user?.role === 'seller' && (
          <Link to="/seller/dashboard" className="text-sm text-blue-600 hover:underline">
            Painel do vendedor
          </Link>
        )}

        <Link to="/carrinho" className="relative text-gray-600 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {totalItens > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItens}
            </span>
          )}
        </Link>

        <span className="text-sm text-gray-500">{user?.name}</span>
        <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">Sair</button>
      </div>
    </header>
  )
}
