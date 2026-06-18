import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { buscarProdutoPorId } from '../services/produtos'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [produto, setProduto] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const p = await buscarProdutoPorId(id)
      if (!p) navigate('/')
      setProduto(p)
      setLoading(false)
    }
    carregar()
  }, [id])

  if (loading) return <div className="p-8 text-gray-400">Carregando...</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline mb-6 block">
        ← Voltar
      </button>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row gap-8">
        <img
          src={produto.imageUrl || 'https://via.placeholder.com/300x300?text=Sem+imagem'}
          alt={produto.name}
          className="w-full sm:w-72 h-72 object-cover rounded-xl flex-shrink-0"
        />
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-1">{produto.category}</p>
          <h1 className="text-2xl font-semibold mb-2">{produto.name}</h1>
          <p className="text-3xl font-bold text-blue-600 mb-4">
            R$ {Number(produto.price).toFixed(2)}
          </p>
          <p className="text-gray-600 text-sm mb-4">{produto.description}</p>
          <p className="text-sm text-gray-400 mb-6">Vendedor: {produto.sellerName}</p>
          <p className="text-sm text-gray-400 mb-6">Estoque: {produto.stock} unidades</p>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  )
}