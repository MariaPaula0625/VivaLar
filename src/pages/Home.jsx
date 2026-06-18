import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { user, logout } = useAuth()
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Olá, {user?.name}!</h1>
      <p className="text-gray-500 mt-1">Role: {user?.role}</p>
      <button onClick={logout} className="mt-4 text-sm text-red-500 hover:underline">
        Sair
      </button>
    </div>
  )
}
