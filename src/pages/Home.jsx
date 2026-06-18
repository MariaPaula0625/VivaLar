import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { buscarProdutos } from '../services/produtos'
import ProductCard from '../components/ProductCard'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

const categorias = ['Todos', 'Móveis', 'Eletrônicos', 'Roupas', 'Calçados', 'Decoração', 'Outros']

export default function Home() {
  const { user, logout } = useAuth()
  const [produtos, setProdutos] = useState([])
  const [categoria, setCategoria] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      const lista = await buscarProdutos(categoria === 'Todos' ? null : categoria)
      setProdutos(lista)
      setLoading(false)
    }
    carregar()
  }, [categoria])

  const produtosFiltrados = produtos.filter(p =>
    p.name.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-8 py-8">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />

        <div className="flex gap-2 flex-wrap mb-6">
          {categorias.map(c => (
            <button key={c} onClick={() => setCategoria(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                categoria === c
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border hover:border-blue-400'
              }`}>
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Carregando produtos...</p>
        ) : produtosFiltrados.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtosFiltrados.map(p => <ProductCard key={p.id} produto={p} />)}
          </div>
        )}
      </main>
    </div>
  )
}