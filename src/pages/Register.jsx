import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.role)
      navigate('/')
    } catch (err) {
      setErro('Erro ao cadastrar: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Criar conta</h1>

        {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}

        <div className="mb-4">
          <label className="block text-sm mb-1">Nome</label>
          <input name="name" value={form.name} onChange={handleChange} required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">E-mail</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Senha</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Tipo de conta</label>
          <select name="role" value={form.role} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="buyer">Comprador</option>
            <option value="seller">Vendedor</option>
          </select>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>

        <p className="text-sm text-center mt-4">
          Já tem conta? <Link to="/login" className="text-blue-600 hover:underline">Entrar</Link>
        </p>
      </form>
    </div>
  )
}
